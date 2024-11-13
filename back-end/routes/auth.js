const express = require('express');
const passport = require('passport');
const {handleLogin,handleProfile, handleGoogleCallback, handleSignUp} = require('../controllers/authController');
const router = express.Router();

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', 
  passport.authenticate('google'), 
  handleGoogleCallback
);

router.post('/signup', handleSignUp);

router.get('/profile', handleProfile);

router.post('/login',handleLogin)

module.exports = router;
