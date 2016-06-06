/**
 * Node Express Application that inludes our server-side middleware, route indexing,
 * and server-side error logging. */
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
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* express.static for setting browser cache headers, currently cacheing all
 * public scripts, css, and images. */
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 0 }));

/* HTTP page routing */
app.use('/', index);
app.use('/login', index);
app.use('/marketplace', index);
app.use('/dashboard', index);
app.use('/moonlet', index);
app.use('/cart', index);
app.use('/about', index);
app.use('/error', index);
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
