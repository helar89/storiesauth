const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db')



//Load config

dotenv.config({ path:'./config/config.env'})

//Passport conf 
require('./config/passport')(passport)

// Call de DB connection Method
connectDB()

const app = express()
// Use morgan for login purposes check if is in dev mode to bring in morgan
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}
//Handlebars

app.engine('.hbs',exphbs({defaultLayout:'main', extname: '.hbs'}));
app.set('view engine', '.hbs');


//sessions
app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:false,
    store:new MongoStore({mongooseConnection: mongoose.connection})
}))

//Passport middlerware
app.use(passport.initialize())
app.use(passport.session())

//Static folder
app.use(express.static(path.join(__dirname,'public')))

//Routes 

app.use('/',require('./routes/index'))
app.use('/auth', require('./routes/auth'))


const PORT = process.env.PORT || 3000

app.listen(PORT,
    console.log(`Server running in ${process.env.NODE_ENV}mode on port ${PORT}`))