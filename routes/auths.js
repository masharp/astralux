/**
 * Node Router module that exports the Express HTTP paths for OAuth authentication.
 * Includes authentication route and callbacks for each strategy.
 */

'use strict';

/* HTTP Routing */
const express = require('express');
const router = express.Router();
const dotenv = require('dotenv'); dotenv.config();
const passport = require('passport');

/* Twitter Authentication Routes */
router.get('/auth/twitter', passport.authenticate('twitter'));
router.get('/auth/twitter/callback', passport.authenticate('twitter',
  { successReturnToOrRedirect: '/dashboard', failureRedirect: '/login' }
));

/* Facebook Authentication Routes */
router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback', passport.authenticate('facebook',
  { successReturnToOrRedirect: '/dashboard', failureRedirect: '/login' }
));

module.exports = router;
