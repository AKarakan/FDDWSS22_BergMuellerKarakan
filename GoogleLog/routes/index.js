const express = require ('express')
const router = express.Router()
const mongoose = require('mongoose')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

// @route GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login',
    })
})

// @route GET /maexchen
router.get('/user/:id', ensureAuth, (req, res) => {
    res.render('maexchen', {
        name: req.user.firstName,
        id: req.user.googleId,
    })
})

// @route GET /lobby
router.get('/lobby', ensureAuth, (req, res) => {
    res.render('lobby', {
        name: req.user.firstName,
        id: req.user.googleId,
    })
})

// @route GET /failure
router.get('/failure', ensureAuth, (req, res) => {
    res.render('failure', {
        name: req.user.firstName,
        id: req.user.googleId,
    })
})

module.exports = router