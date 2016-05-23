/**
 * Node module that exports the Express HTTP router for the application. Handles
 * all server-side HTTP page requests and includes a REST layer for client-side AJAX requests.
 */

'use strict';

/* HTTP Routing */
const express = require('express');
const router = express.Router();
const dotenv = require('dotenv'); dotenv.config();

const credentials = {
  username: process.env.MASTER_USERNAME,
  password: process.env.MASTER_PASSWORD
};

/* Home Page */
router.get('/', (request, response) => {
  response.render('home', { title: 'Astralux - A moonlet Marketplace of the Future', credentials });
});

router.get('/moonlet/:moonletID/:moonletName', (request, response) => {
  const moonletID = request.params.moonletID;
  const moonletName = request.params.moonletName;

  response.render('moonlet', { title: `Astralux - ${moonletName} | A fancy space Moonlet!`, credentials, moonletID });
});

/* Login Page */
router.get('/login', (request, response) => {
  response.render('login', { title: 'Astralux Login | A moonlet Marketplace of the Future', credentials });
});

/* Dashboard Page */
router.get('/dashboard/:username', (request, response) => {
  const username = request.params.username;

  response.render('dashboard', { title: 'Astralux Dashboard | A moonlet Marketplace of the Future', username, credentials });
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
