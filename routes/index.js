const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Authentication Middleware
const loggedInOnly = (req, res, next) => {
    if (req.isAuthenticated
    ()) next();
    else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    }
};
const loggedOutOnly = (req, res, next) => {
    if (req.isUnauthenticated()) next();
    else res.redirect("/");
};

// Route Handlers
function authenticate(passport) {
    ///root route
    router.get("/", function(req, res){
        res.render("landing");
    });
    // Login View
    router.get("/login", loggedOutOnly, (req, res) => {
        res.render("login");
    });

    // Login Handler
    router.post(
        "/login",
        passport.authenticate("local", {
            successRedirect: "/projects",
            failureRedirect: "/login",
            failureFlash: true,
            successFlash: true
        })
    );

    // Register View
    router.get("/register", loggedOutOnly, (req, res) => {
        res.render("register");
    });

    // Register Handler
    router.post("/register", (req, res, next) => {
        const { username, password } = req.body;
        User.create({ username, password })
            .then(user => {
                req.login(user, err => {
                    if (err) next(err);
                    else res.redirect("/projects");
                });
            })
            .catch(err => {
                if (err.name === "ValidationError") {
                    console.log('TAAAAAAAAAAAAAAAAAAAAAAAAAAA');
                    req.flash("error", "Sorry, that username is already taken.");
                    res.redirect("/register");
                } else next(err);
            });
    });

    // Register as admin View
    router.get("/admin",loggedInOnly, (req, res) => {
        res.render("admin");
    });

    // Register as admin View
    router.post("/admin",loggedInOnly, (req, res) => {
        if(req.body.adminCode == process.env.ADMIN_CODE){
            req.flash(" success", "You are an admin now");
            User.findById(req.user._id , function(err, user){
                if(err){
                    console.log(err);
                } else {
                    user.isAdmin = true;
                    user.save(function(err, updated){
                        if(err){
                            res.redirect("/projects");
                        } else {
                            //redirect somewhere(show page)
                            console.log(updated);
                            res.redirect("/projects");
                        }
                    });
                }
            });
        }
        else{
            req.flash("error", "Wrong code");
            res.redirect("/projects");
        }
    });

    // Logout Handler
    router.all("/logout", function(req, res) {
        req.logout();
        res.redirect("/");
    });


    return router;
}

module.exports = authenticate;