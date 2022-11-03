const express = require('express')
const router = express.Router()
const passport = require('passport')

const User = require('../../models/user')
router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureMessage: true
}))

router.get('/logout', (req, res) => {
    req.logout()//passport提供的功能
    req.flash('success_msg', '你已成功登出!')
    res.redirect('/users/login')
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    const errors = []
    if (!name || !email || !password || !confirmPassword) {
        errors.push({ message: '所有欄位都是必填!' })//push object to array，array裡面的是message是object
    }
    if (password !== confirmPassword) {
        errors.push({ message: '密碼與確認密碼不一致!' })
    }
    if (errors.length) {
        return res.render('register', { errors, name, email, password, confirmPassword })
    }
    User.findOne({ email })
        .then(user => {
            if (user) {
                errors.push({ message: 'Email已被註冊!' })
                res.render('register', { errors, name, email, password, confirmPassword })
            } else {
                return User
                    .create({ name, email, password })
                    .then(() => res.redirect('/'))
                    .catch(err => console.log(err))
            }
        })
        .catch(err => console.log(err))



})

module.exports = router