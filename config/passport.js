const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
module.exports = app => {
    //初始化passport模組
    app.use(passport.initialize())
    app.use(passport.session())

    //設定本地登入策略
    passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
        User.findOne({ email })
            .then(user => {
                if (!user) {
                    return done(null, false, req.flash('error', 'The email is not registered!'))
                }
                if (user.password !== password) {
                    return done(null, false, req.flash('error', 'Email or Password incorrect!'))
                }
                return done(null, user)
            })
            .catch(err => done(err, false))
    }))

    //設定序列反序列
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id)
            .lean()
            .then(user => done(null, user))
            .catch(err => done(err, null))
    })
}