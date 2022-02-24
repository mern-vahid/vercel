const layout = './layouts/auth'

// TODO add hash password
// const bcrypt = require('bcryptjs')
const { v4: uuid } = require('uuid')

const Users = require('../../models/users')
const errors_helper = require('../../utils/errors')
const mail = require('../../utils/mail')
const passport = require('passport')

exports.login = async (req, res) => {
    return res.page('auth/login', {
        title: 'Sign In',
        layout,
        errors: req.flash('error'),
        success: req.flash('success'),
    })
}

exports._login = async (req, res, next) => {
    console.log('test')
    passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: '/login',
        successRedirect: '/',
    })(req, res, next)
}

exports.logout = async (req, res) => {
    req.logOut()
    req.flash('success', 'Sgin Out Successfly')
    return res.redirect('/login')
}

exports.register = async (req, res) => {
    return res.page('auth/register', {
        title: 'Sign Up',
        layout,
        errors: req.flash('error'),
        errors_helper,
    })
}

exports._register = async (req, res) => {
    const { first_name, last_name, user_name, email, password } = req.body
    try {
        await Users.valid(req.body)
        const user =
            (await Users.findOne({ email })) ||
            (await Users.findOne({ user_name }))

        if (user) {
            req.flash('error', [
                { path: 'all', error: 'username or email exies' },
            ])
            return res.redirect('/register')
        }
        const verify_token = await uuid()

        const new_user = await Users.create({
            first_name,
            last_name,
            user_name,
            email,
            password,
            verify_token,
        })
        const html = `<h1>Hi ${first_name} ${last_name}</h1><hr/ ><h3> Please Verify Your Account : <a  href="${req.protocol}://${req.hostname}:5000/verify/${new_user._id}/${verify_token}" target="_blank"> Link Verify </a></h3>`
        mail('Express', email, 'Verify Email', html)
        req.flash(
            'success',
            `Your Account Created Go To inbox ${email} And Verify Account`
        )
        return res.redirect('/login')
    } catch (error) {
        const arr = []

        if (error.inner) {
            error.inner.map((err) => {
                arr.push({ path: err.path, error: err.errors })
            })

            req.flash('error', arr)
        }

        return res.redirect('/register')
    }
}

exports.verify = async (req, res) => {
    const { id, token } = req.params
    try {
        const user = await Users.findOne({
            verify_token: token,
            is_verify: false,
        })
        if (!user || user.id != id) {
            return res.code()
        } else {
            user.is_verify = true
            user.verify_token = ''
            user.save()
            req.flash('success', 'Your Account Verify Please Login Account')
            return res.redirect('/login')
        }
    } catch (error) {}
}

exports.remember = async (req, res, next) => {
    if (req.body.remember) {
        req.session.cookie.originalMaxAge = 24 * 60 * 60 * 1000 // 1 day
    } else {
        req.session.cookie.expires = null
    }
    return next()
}

exports.forgot = async (req, res) => {
    return res.page('auth/forgot', {
        title: 'Forgot Password',
        layout,
        error: req.flash('error'),
        success: req.flash('success'),
    })
}

exports._forgot = async (req, res) => {
    const { email, username } = req.body
    try {
        const user = await Users.findOne({ email })
        if (!user) {
            console.log('object')
            return res.reflash('error', 'No user found with this email')
        } else if (user.is_verify == false) {
            return res.reflash('error', 'Please verify account')
        } else if (user.is_active == false) {
            return res.reflash('error', 'Your account deactived')
        } else {
            const token = await uuid()
            let html = `<h1>${
                username
                    ? `Hi ${user.first_name} ${user.last_name}`
                    : 'Hi Friend'
            }</h1><hr/ ><h3> if forgot password click this <a  href="${
                req.protocol
            }://${req.hostname}:5000/forgot/password/${
                user._id
            }/${token}" target="_blank"> Link </a></h3>`

            mail('express.com', email, 'ForGot Password', html)

            user.forgot_token = token
            user.save()

            return res.reflash(
                'success',
                `Link sending please check ${email} inbox`
            )
        }
    } catch (error) {}
}

exports.password = async (req, res) => {
    const { id, token } = req.params
    try {
        const user = await Users.findOne({ forgot_token: token })
        if (!user || user.id != id) return res.code()

        return res.page('auth/password', {
            title: 'Password Change',
            layout,
            error: req.flash('error'),
            success: req.flash('success'),
            id,
            token,
        })
    } catch (error) {
        console.log(error)
    }
}

exports._password = async (req, res) => {
    const { id, token } = req.params
    const { password, password_confirm } = req.body
    try {
        const user = await Users.findOne({ token })
        if (!user || user.id != id) {
            return res.code()
        }

        if (password.length == 0 || password_confirm.length == 0) {
            return res.reflash('error', 'password or password confirm required')
        }
        if (password.length < 6) {
            return res.reflash(
                'error',
                'password must be at least 6 characters'
            )
        }
        if (password != password_confirm) {
            return res.reflash('error', 'password !== password confirm')
        } else {
            user.password = password
            user.forgot_token = ''
            user.save()
            req.flash('success', 'password changhed')
            return res.redirect('/login')
        }
    } catch (error) {}
}
