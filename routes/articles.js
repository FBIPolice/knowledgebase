const express = require('express')
const router = express.Router()

// Bring in Article Model
let Article = require('../models/article')

// Add article GET Route
router.get('/add', (req, res) => {
	res.render('add_article')
})

// Add article POST Route
router.post('/add', (req, res) => {
	req.checkBody('title', 'Title is required').notEmpty()
	req.checkBody('author', 'Author is required').notEmpty()
	req.checkBody('body', 'Body is required').notEmpty()

	// Get Errors
	let errors = req.validationErrors()
	if(errors)
		res.render('add_article', {
			errors: errors
		})
	else {
		let article = new Article()
		article.title = req.body.title
		article.author = req.body.author
		article.body = req.body.body

		article.save((err) => {
			if(err)
				console.log(err)
			else {
				req.flash('success', 'Article added')
				res.redirect('/')
			}
		})
	}

})

router.get('/edit/:id', (req, res) => {
	Article.findById(req.params.id, (err, article) => {
		if(err)
			console.log(err)
		else
			res.render('edit_article', {article: article})
	})
})

router.post('/edit/:id', (req, res) => {
	let article = {}
	article.title = req.body.title
	article.author = req.body.author
	article.body = req.body.body
	let query = {_id: req.params.id}
	Article.update(query, article, (err) => {
		if(err)
			console.log(err)
		else {
			req.flash('success', 'Article updated')
			res.redirect('/')
		}
	})
})

// Single Article Route
router.get('/:id', (req, res) => {
	Article.findById(req.params.id, (err, article) => {
		if(err)
			console.log(err)
		else
			res.render('article', {article: article})
	})
})

router.delete('/:id', (req, res) => {
	let query = {_id: req.params.id}
	Article.remove(query, (err) => {
		if(err)
			console.log(err)
		else
			res.send()
	})
})

module.exports = router
