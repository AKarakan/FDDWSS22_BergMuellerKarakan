const express = require ('express')
const router = express.Router()
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
router.get('/maexchen', ensureAuth, (req, res) => {
    res.render('maexchen', {
        name: req.user.firstName,
    })
})


module.exports = router