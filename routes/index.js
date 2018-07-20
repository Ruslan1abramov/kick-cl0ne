var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var bcrypt          = require('bcryptjs');


//root route
router.get("/", function(req, res){
    res.render("landing");
});

//  ===========
// AUTH ROUTES
//  ===========

// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});
//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }

        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to KickCl0ne " + user.username);
            res.redirect("/projects");
        });
    });
});

// send to admin page
router.get("/admin", function(req, res){
    res.render("admin");
});

//handle sign up logic
router.post("/admin", function(req, res){
    //TODO
});

// show login form
router.get("/login", function(req, res){
   res.render("login"); 
});


// login logic: app.post("/login", middleware, callback)
router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) { return next(err); }
        if (!user) {
            req.flash("error", "Invalid username or password");
            return res.redirect('/login');
        }
        req.logIn(user, err => {
            if (err) { return next(err); }
            let redirectTo = req.session.redirectTo ? req.session.redirectTo : '/projects';
            delete req.session.redirectTo;
            req.flash("success", "Good to see you again, " + user.username);
            res.redirect(redirectTo);
        });
    })(req, res, next);
});


// logic route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/projects");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;