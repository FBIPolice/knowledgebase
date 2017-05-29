// Requires
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const session = require('express-session')

// Init App
const app = express()

// Bring in Models
let Article = require('./models/article')

// Connect to database
mongoose.connect('mongodb://localhost/nodekb')
let db = mongoose.connection

// Check connection
db.once('open', () => {
	console.log('Connected to MongoDB')
})

// Check for DB error
db.on('error', (err) => {
	console.log(err)
})

// Body-parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Express Session Middleware
app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true,
}))

// Express Messsages Middleware
app.use(require('connect-flash')())
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']'
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    }
  }
}))

// Set public folder
app.use(express.static(path.join(__dirname, 'public')))

// View Engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Home Route
app.get('/' , (req, res) => {
	let articles = Article.find({}, (err, articles) => {
		if(err)
			console.log(err)
		else
			res.render('index', {
				articles: articles
			})
	})
})

// Route Files
let articles = require('./routes/articles')
app.use('/article', articles)

// Start server
app.listen(3000, () => {
  console.log('Server running on port 3000...')
})
