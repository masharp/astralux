/**
 * Node Express Application that inludes our server-side middleware, route indexing,
 * and server-side error logging. */
'use strict';

/* Module Dependencies */
const express = require('express');
const session = require('express-session');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const dotenv = require('dotenv'); dotenv.config();
const debug = require('debug'); debug('astralux:server');
const cors = require('cors');
const request = require('request');
const passport = require('passport');

/* Passport auth strategies */
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

/* Astralux API Credentials */
const credentials = {
  username: process.env.MASTER_USERNAME,
  password: process.env.MASTER_PASSWORD
};

/**
 * Function that issues a promise to request a POST for registering a new user
 * via the Flask API. Parses the OAuth Passport profile object for useful fields
 * @param {object} profile - passport user profile object
 * @return {object} returned API object for this user to be serialized
 */
function registerNewUser(profile) {
  const options = {
    url: 'http://astralux-api.herokuapp.com/api/users',
    method: 'POST',
    json: {
      username: profile.username ? profile.username : profile.id,
      name: profile.displayName,
      platform: profile.provider
    }
  };
  return new Promise((resolve, reject) => {
    request.post(options, (error, response, body) => {
      if (error) reject(error);
      resolve(body);
    }).auth(credentials.username, credentials.password, true);
  });
}

/* Passport TWITTER STRATEGY Configuration */
passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: 'http://127.0.0.1:3000/auth/twitter/callback'

}, function (token, tokenSecret, profile, done) {
  const username = profile.username;
  const apiUserURL = `http://astralux-api.herokuapp.com/api/users/${username}`;

  /* check if the user with this username exisits already */
  request.get(apiUserURL, (error, response, body) => {
    if (error) console.error(error);
    const content = JSON.parse(body);

    /* if user doesn't exisit, indicated via returned json error message, create */
    if (content.hasOwnProperty('error')) {
      registerNewUser(profile).then((result) => {
        return done(null, result.user);

      }).catch((error) => console.log(error));
    } else {
      /* if user does exist in the datastore, return what was queried */
      return done(null, content.user);
    }
  }).auth(credentials.username, credentials.password, true);
}));

/* Passport FACEBOOK STRATEGY Configuration */
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:3000/auth/facebook/callback'

}, function (accessToken, refreshToken, profile, done) {
  /* use Facebook user ID if it does not provide a username */
  const username = profile.username ? profile.username : profile.id;
  const apiUserURL = `http://astralux-api.herokuapp.com/api/users/${username}`;

  /* check if the user with this username exisits already */
  request.get(apiUserURL, (error, response, body) => {
    if (error) console.error(error);
    const content = JSON.parse(body);

    /* if user doesn't exisit, indicated via returned json error message, create */
    if (content.hasOwnProperty('error')) {
      registerNewUser(profile).then((result) => {
        return done(null, result.user);

      }).catch((error) => console.log(error));
    } else {
      /* if user does exist in the datastore, return what was queried */
      return done(null, content.user);
    }
  }).auth(credentials.username, credentials.password, true);
}));

/* Passport Serialization of User */
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

/* Route Controllers */
const index = require('./routes/index');
const auths = require('./routes/auths');

/* time in miliseconds, const oneDay = 86400000; */
const oneMinute = 60000;
const oneHour = 3600000;

/* Express Application */
const app = express();
app.use(compression());

/* Express Session Configuration */
app.use(session({
  name: 'astralux-marketplace',
  secret: process.env.ASTRALUX_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

/* View Engine setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* express.static for setting browser cache headers, currently cacheing all
 * public scripts, css, and images. */
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 0 }));

/* Passport Middleware */
app.use(passport.initialize());
app.use(passport.session());

/* HTTP page routing */
app.use(index);
app.use(auths);

/* Handle 400 errors with custom error page */
app.use((request, response) => {
  response.status(400);
  response.render('error', { message: 'Not Found', error: { status: 404 }});
});

/* Handle 500 errors with custom error page */
app.use((error, request, response) => {
  response.status(500);
  response.render('error', { message: 'Bad Request', error: { status: 500 }});
});

module.exports = app;
