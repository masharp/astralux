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

/* handle web crawlers */
router.get('/robots.txt', (request, response) => {
  response.type('text/plain');
  response.send('User-agent: *\nDisallow:');
});

/* displays the sitemap */
router.get('/sitemap.txt', (request, response) => {
  response.type('text/plain');
  response.send('/s+itemap.txt');
});

/* Home Page */
router.get('/', (request, response) => {
  const username = request.params.username ? request.params.username : '';
  response.render('home', { title: 'Astralux - A moonlet Marketplace of the Future', username });
});

router.get('/moonlet/:moonletID/:moonletName?', (request, response) => {
  const moonletID = request.params.moonletID;
  const moonletName = request.params.moonletName ? request.params.moonletName : 'Moonlet';
  const username = 'admin';

  response.render('moonlet', { title: `Astralux - ${moonletName} | A fancy space Moonlet!`, moonletID, username });
});

/* Login Page */
router.get('/login', (request, response) => {
  const username = request.params.username ? request.params.username : '';
  response.render('login', { title: 'Astralux Login | A moonlet Marketplace of the Future', username });
});

/* Dashboard Page */
router.get('/dashboard/:username?', (request, response) => {
  const username = request.params.username ? request.params.username : '';
  response.render('dashboard', { title: 'Astralux Dashboard | A moonlet Marketplace of the Future', username });
});

router.get('/cart/:username?', (request, response) => {
  const username = request.params.username ? request.params.username : '';
  response.render('cart', { title: 'Astralux Cart | A moonlet Marketplace of the Future', username });
});

/* Marketplace Page */
router.get('/marketplace', (request, response) => {
  const username = request.params.username ? request.params.username : '';
  response.render('marketplace', { title: 'Astralux Marketplace | A moonlet Marketplace of the Future', username });
});

/* Marketplace Page */
router.get('/about', (request, response) => {
  const username = request.params.username ? request.params.username : '';
  response.render('about', { title: 'Astralux About | A moonlet Marketplace of the Future', username });
});

/* Error Page */
router.get('/error/:code?', (request, response) => {
  const username = request.params.username ? request.params.username : '';
  let code = request.params.code ? Number(request.params.code) : 500; // pull out the error code, if present
  if (code < 400 || code > 501 || isNaN(code)) code = 500; // check if error code is valid
  let message = '';

  /* assign error message based on code */
  switch (code) {
      case 400:
        message = 'Bad Request';
        break;
      case 403:
        message = 'Unauthorized Access';
        break;
      case 404:
        message = 'Not Found';
        break;
      case 405:
        message = 'Request Not Allowed';
        break;
      // custom error response
      case 455:
        message = 'Our code is broken. Please forgive.';
        break;
      case 500:
        message = 'Internal Server Error';
        break;
      default:
        message = 'Internal Server Error';
  }

  response.render('error', { title: 'Astralux - Critical Error!', error: { status: code, message }, username });
});

/* Credentials Route - returns credentials for calling the Flask API
   TODO: Add local validation via host variable. match it to production server? */
router.get('/credentials', (request, response) => {
  const host = request.get('host');

  response.json(credentials);
});

module.exports = router;
