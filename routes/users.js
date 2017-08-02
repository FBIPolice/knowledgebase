const express = require('express')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const router = express.Router()

// Bring in Article Model
let User = require('../models/user')

// Register Route
router.get('/register', (req, res) => {
	res.render('register')
})

// Register Proccess
router.post('/register', (req, res) => {
	const name = req.body.name
	const email = req.body.email
	const username = req.body.username
	const password = req.body.password
	const repeat_password = req.body.repeat_password

	req.checkBody('name', "Name is required").notEmpty
	req.checkBody('email', "Email is required").notEmpty
	req.checkBody('email', "Email is not valid").notEmail
	req.checkBody('username', "Username is required").notEmpty
	req.checkBody('password', "Password is required").notEmpty
	req.checkBody('repeat_password', "Passwords do not match").equals(req.body.password)

	let errors = req.validationErrors()

	if (errors) {
		res.render('register', {
			errors: errors
		})
	} else {
		let user = new User({
			name: name,
			email: email,
			username: username,
			password: password
		})

		bcrypt.genSalt(10, (err, salt) => {
			if (err) {
				console.log(err)
			} else {
				bcrypt.hash(user.password, salt, (err, hash) => {
					if (err) {
						console.log(err)
					} else {
						user.password = hash
						user.save((err) => {
							if (err) {
								console.log(err)
							} else {
								req.flash('success', 'You have registered successfully!')
								res.redirect('/users/login')
							}
						})
					}
				})
			}
		})
	}
})

// Login Route
router.get('/login', (req, res) => {
	res.render('login')
})

// Login Proccess
router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/users/login',
		failureFlash: true
	})(req, res, next)
})

// Logout
router.get('/logout', (req, res) => {
	req.logout()
	req.flash('success', 'You have logged out!')
	res.redirect('/users/login')
})

module.exports = router