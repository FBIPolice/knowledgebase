// Requires
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

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
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

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

// Add article GET Route
app.get('/article/add', (req, res) => {
	res.render('add_article')
})

// Add article POST Route
app.post('/articles/add', (req, res) => {
	let article = new Article()
	article.title = req.body.title
	article.author = req.body.author
	article.body = req.body.body
	article.save((err) => {
		if(err)
			console.log(err)
		else
			res.redirect('/')
	})
})

app.get('/article/edit/:id', (req, res) => {
	Article.findById(req.params.id, (err, article) => {
		if(err)
			console.log(err)
		else
			res.render('edit_article', {article: article})
	})
})

app.post('/article/edit/:id', (req, res) => {
	let article = {}
	article.title = req.body.title
	article.author = req.body.author
	article.body = req.body.body
	let query = {_id: req.params.id}
	Article.update(query, article, (err) => {
		if(err)
			console.log(err)
		else
			res.redirect('/')
	})
})

// Single Article Route
app.get('/article/:id', (req, res) => {
	Article.findById(req.params.id, (err, article) => {
		if(err)
			console.log(err)
		else
			res.render('article', {article: article})
	})
})

app.delete('/article/:id', (req, res) => {
	let query = {_id: req.params.id}
	Article.remove(query, (err) => {
		if(err)
			console.log(err)
		else
			res.send()
	})
})

// Start server
app.listen(3000, () => {
  console.log('Server running on port 3000...')
})
