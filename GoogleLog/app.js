const path = require ('path')
const express = require ('express')
const mongoose = require('mongoose')
const dotenv = require ('dotenv')
const morgan = require ('morgan')
const exphbs = require ('express-handlebars')
const passport = require ('passport')
const session = require ('express-session')
const MongoStore = require ('connect-mongo')
const connectDB = require ('./config/db')
const http = require('http')

//Load config
dotenv.config({path: './config/config.env'})

//Passport config
require('./config/passport')(passport)

connectDB()

const app = express()

//Logging
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//Handlebars
app.engine('.hbs', exphbs.engine({extname: '.hbs', defaultLayout: 'main'}));
app.set('view engine', '.hbs');

//Session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: process.env.MONGO_URI,}),
  }))

//Passport
app.use(passport.initialize())
app.use(passport.session())

//Static
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))



const LOGIN_PORT = process.env.LOGIN_PORT || 3005

app.listen(
  LOGIN_PORT,
     console.log(`Server running in ${process.env.NODE_ENV} mode on port ${LOGIN_PORT}`)
     )

