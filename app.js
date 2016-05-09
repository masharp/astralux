/**
 * Node Express Application that inludes our server-side middleware, route indexing,
 * and server-side error logging.
 */

'use strict';

/* Module Dependencies */
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const dotenv = require('dotenv'); dotenv.config();
const debug = require('debug'); debug('astralux:server');

/* Route Controller */
const index = require('./routes/index');

/* time in miliseconds const oneDay = 86400000; */
const oneMinute = 60000;
const oneHour = 3600000;

/* Express Application */
const app = express();
app.use(compression());

/* View Engine setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* express.static for setting browser cache headers, currently cacheing all
 * public scripts, css, and images.
 */
app.use(express.static(path.join(__dirname, 'public'), { maxAge: oneMinute * 10 }));

/* CORS fix for a cross origin error I was getting on mobile
app.use(function(request, response, next) {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
}); */

/* HTTP page routing */
app.use('/', index);
app.use('/robots.txt', index);
app.use('/sitemap.txt', index);

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
