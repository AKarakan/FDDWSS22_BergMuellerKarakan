const express = require('express')
const passport = require('passport')
const mongoose = require('mongoose')
const router = express.Router()

// @route   GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

// @route   GET /auth/google/callback
router.get(
  '/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    const id = req.user.googleId
    const name = req.user.firstName
    res.redirect('/user/'+ id)
  }
)

// @route   /auth/logout
router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { 
        return next(err); 
        }
      res.redirect('/');
    });
  });

module.exports = router
