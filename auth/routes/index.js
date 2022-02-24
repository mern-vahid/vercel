const { Router } = require('express')

const {
    login,
    register,
    _register,
    verify,
    _login,
    remember,
    forgot,
    logout,
    _forgot,
    password,
    _password,
} = require('../controllers/index')

const router = Router()

//* Login Page | Path => /login | GET Mehtod
router.get('/login', login)

//* Logout Heandler | Path => /logout | GET Mehtod
router.get('/logout', logout)

//* Login Heandler | Path => /login | POST Mehtod
router.post('/login', remember, _login)

//* Register Page | Path => /register | GET Mehtod
router.get('/register', register)

//* Register Heandler | Path => /register | POST Mehtod
router.post('/register', _register)

//* Verify Heandler | Path => /verify/id/token | GET Mehtod
router.get('/verify/:id/:token', verify)

//* Forgot Page | Path => /forgot | GET Mehtod
router.get('/forgot', forgot)

//* Forgot Heandler | Path => /forgot | POST Mehtod
router.post('/forgot', _forgot)

//* Password Change Page | Path => /forgot/password/[id]/[token] | GET Mehtod
router.get('/forgot/password/:id/:token', password)

//* Password Change Heandler | Path => /forgot/password/[id]/[token] | POST Mehtod
router.post('/forgot/password/:id/:token', _password)

module.exports = router
