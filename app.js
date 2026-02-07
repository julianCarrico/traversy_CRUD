const path = require('path')
const express = require('express')
const app = express()
// const mongoose = require('mongoose') not needed 
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo').default//needs .default now
const connectDB = require('./config/db')

//load confg
dotenv.config({ path: './config/config.env' })

//Passport config
require('./config/passport')(passport)

connectDB()

//Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//Method override
app.use(
    methodOverride(function (req, res) {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            // look in urlencoded POST bodies and delete it
            let method = req.body._method
            delete req.body._method
            return method
        }
    })
)

//Determine level of logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Hanglebars Helpers
const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs')

//Handlebars
//added .engine after exphbs
app.engine('.hbs', exphbs.engine({
    helpers: {
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select
    },
    defaultLayout: 'main',
    extname: '.hbs'
})
)
app.set('view engine', '.hbs')

//Sessions
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        //Change: MongoStore syntax has changed
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI
        })
    })
)
//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//SET GLOBAL VARIABLE
app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next()
})

//Static folder
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 8000

app.listen(PORT, console.log(`server running on ${process.env.NODE_ENV} mode on PORT ${PORT}`))