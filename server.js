//* Exterior Library
const express = require('express')
const layout = require('express-ejs-layouts')
const flash = require('connect-flash')
const session = require('express-session')
const cookie = require('cookie-parser')
const csrf = require('csurf')
const morgan = require('morgan')
const MongoStore = require('connect-mongo')
const fileupload = require('express-fileupload')

//* Internal Library
const { join } = require('path')
const passport = require('passport')

const app = express()

//* Logger
//! app.use(morgan('dev'))

//* App Config
require('./config/db')()
require('./auth/utils/passport')

//* App Setting
app.set('view engine', 'ejs')
app.set('views', 'templates')
app.set('layout', './layouts/app')

//* Middleware
app.use(express.static(join(__dirname, 'static')))
app.use(express.urlencoded({ extended: false }))
app.use(layout)
app.use(cookie('SECRET'))
app.use(
    session({
        secret: 'SECRET',
        saveUninitialized: false,
        resave: false,
        store: new MongoStore({
            mongoUrl: 'mongodb://localhost:27017/express',
        }),
    })
)
app.use(csrf())
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(fileupload())

//* Custome Middeware
app.use(require('./middlewares/response'))
app.use(require('./middlewares/csrf_custom'))

//* Router Middleware
app.use('/', require('./app/router'))
app.use('/', require('./auth/router'))
app.use('/admin', require('./admin/router'))

//* Page Not Found ( 404 )
app.use((req, res) => {
    console.log(req.user)
    res.code()
})

//* App Port
const PORT = 5000 || process.env.PORT

app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
