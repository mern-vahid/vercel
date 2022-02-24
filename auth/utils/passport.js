const passport = require('passport')
const { Strategy } = require('passport-local')

const Users = require('../../models/users')

passport.use(
    new Strategy(async (username, password, done) => {
        const user = await Users.findOne({ user_name: username })

        if (!user)
            return done(null, false, {
                message: 'Username or password is incorrect ',
            })

        if (user.password != password)
            return done(null, false, {
                message: 'Username or password is incorrect ',
            })

        if (user.is_active == false)
            return done(null, false, {
                message: 'Your Account DeAcitved ',
            })

        if (user.is_verify == false)
            return done(null, false, {
                message: 'Please Verify Account',
            })
        else return done(null, user)
    })
)

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((id, done) => {
    Users.findById(id, (err, user) => {
        done(err, user)
    })
})
