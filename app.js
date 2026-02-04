const express = require('express')
const app = express()
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const connectDB = require('./config/db')

//load confg
dotenv.config({ path: './config/config.env' })

connectDB()

//Determine level of logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Handlebars
//added .engine after exphbs
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    extname: '.hbs'
})
)
app.set('view engine', '.hbs')

//Routes
app.use('/', require('./routes/index'))

const PORT = process.env.PORT || 8000

app.listen(PORT, console.log(`server running on ${process.env.NODE_ENV} mode on PORT ${PORT}`))