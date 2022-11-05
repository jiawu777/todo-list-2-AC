const express = require('express')
const router = express.Router()

const passport = require('passport')
//向facebook發出請求
router.get('/facebook', passport.authenticate('facebook', {
    scope: ['email', 'public_profile']
}))
//facebook把資料發回來,類似post/users/login
router.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/user/login'
}))

module.exports = router