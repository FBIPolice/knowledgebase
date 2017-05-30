const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const dbConfig = require('../config/database')

module.exports = (passport) => {
	// Local Strategy
	passport.use(new LocalStrategy((username, password, done) => {
		// Match Username
		let query = { username: username }
		User.findOne(query, (err, user) => {
			if(err) {
				console.log(err)
			} else if(!user) {
				return done(null, false, { message: "Wrong username" })
			} else {
				// Match Password
				bcrypt.compare(password, user.password, (err, isMatch) => {
					if(err) {
						console.log(err)
					} else if(isMatch) {
						return done(null, user)
					} else {
						return done(null, false, { message: "Wrong password" })
					}
				})
			}
		})
	}))

	passport.serializeUser(function(user, done) {
	  done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
	  User.findById(id, function(err, user) {
	    done(err, user);
	  });
	});
}