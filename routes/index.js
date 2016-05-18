/**
 * Node module that exports the Express HTTP router for the application. Handles
 * all server-side HTTP page requests and includes a REST layer for client-side AJAX requests.
 */

'use strict';

/* HTTP Routing */
const express = require('express');
const router = express.Router();
const dotenv = require('dotenv'); dotenv.config();

/* Home Page */
router.get('/', (request, response) => {
  const credentials = {
    username: process.env.MASTER_USERNAME,
    password: process.env.MASTER_PASSWORD
  };

  response.render('home', { title: 'Astralux - A moonlet Marketplace of the Future', credentials });
});

/* Login Page */
router.get('/login', (request, response) => {
  response.render('login', { title: 'Astralux Login | A moonlet Marketplace of the Future' });
});

/* Dashboard Page */
router.get('/dashboard', (request, response) => {
  response.render('dashboard', { title: 'Astralux Dashboard | A moonlet Marketplace of the Future' });
});

/* Marketplace Page */
router.get('/marketplace', (request, response) => {
  response.render('marketplace', { title: 'Astralux Marketplace | A moonlet Marketplace of the Future' });
});

/* Marketplace Page */
router.get('/about', (request, response) => {
  response.render('about', { title: 'Astralux About | A moonlet Marketplace of the Future' });
});

/* handle web crawlers */
router.get('/robots.txt', (request, response) => {
  response.type('text/plain');
  response.send('User-agent: *\nDisallow:');
});

/* displays the sitemap */
router.get('/sitemap.txt', (request, response) => {
  response.type('text/plain');
  response.send('/sitemap.txt');
});

/* Error Page */
router.get('/error', (request, response) => {
  response.render('error', { message: 'Something went wrong here!', title: 'Astralux - Critical Error!',
    error: { status: 500 } });
});

module.exports = router;
