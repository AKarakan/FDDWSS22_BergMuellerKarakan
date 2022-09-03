const express = require ('express')
const router = express.Router()
const mongoose = require('mongoose')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

//@desc Login/Landing page
// @route GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('Login', {
        layout: 'login',
    })
})

//@desc Login/maexchen
// @route GET /maexchen
router.get('/user/:id', ensureAuth, (req, res) => {
    res.render('maexchen', {
        name: req.user.firstName,
        id: req.user.googleId,
    })
})


module.exports = router