/**
 * Node module that exports the Express HTTP router for the application. Handles
 * all server-side HTTP page requests and includes a REST layer for client-side AJAX requests.
 */

'use strict';

/* HTTP Routing */
const express = require('express');
const router = express.Router();
const dotenv = require('dotenv'); dotenv.config();

/* handle web crawlers */
router.get('/robots.txt', (request, response) => {
  response.type('text/plain');
  response.send('User-agent: *\nDisallow: /api/');
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

/* Home Page */
router.get('/', (request, response) => {
  response.render('home', { title: 'Astralux - A moonlet Marketplace of the Future' });
});

module.exports = router;
