require('dotenv').load();

const express     	= require("express"),
    app         	= express(),
    bodyParser  	= require("body-parser"),
    mongoose    	= require("mongoose"),
    flash       	= require("connect-flash"),
    passport    	= require("passport"),
    LocalStrategy 	= require("passport-local"),
    methodOverride 	= require("method-override"),
    User        	= require("./models/user"),
    initDB			= require("./initDB");

//require routes
const   commentRoutes    = require("./routes/comments"),
        projectRoutes 	 = require("./routes/projects"),
        indexRoutes      = require("./routes/index");

mongoose.connect("mongodb://localhost/kick_clone");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(require('express-domain-middleware'));
app.use(methodOverride("_method"));
app.use(flash());
//initDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Pow Rules",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(userId, done) {
    User.findById(userId, (err, user) => done(err, user));
});
// Passport Local
const local = new LocalStrategy((username, password, done) => {
    User.findOne({ username })
        .then(user => {
            if (!user || !user.validPassword(password)) {
                done(null, false, { message: "Invalid username/password" });
            } else {
                done(null, user, { message: "Good to have you back!" });
            }
        })
        .catch(e => done(e));
});
passport.use("local", local);


app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})


function stringifyError(err) {
    return (err.stack ? err.stack : err) + (err.path ? ' at ' + err.path : '');
}

function logError(time, req, err) {
    console[this.level](time, req.method, req.path, err);

    if (err && err instanceof Error) {
        console[this.level](err.stack);
    }
}

logError.error = logError.bind({level: 'error'});
logError.log = logError.bind({level: 'log'});

app.use(function (err, req, res, next) {
    if (!err) {
        next();
    } else {
        var d = Date.now();
        if (/please relogin/i.test(err)) {
            req.logout();
            res.status(401).end();
        } else if (err.errors) {
            logError.error(d, req, JSON.stringify(err.errors));
            res.status(400).json({errorMessage: err});
        } else if (err.status) {
            if (err.status < 500) {
                logError.log(d, req, stringifyError(err));
            } else {
                logError.error(d, req, stringifyError(err));
            }
            res.status(400).end();
        } else {
            logError.error(d, req, err);
            res.status(500).json({code: d});
        }
    }
});

app.use("/", indexRoutes(passport));
app.use("/projects", projectRoutes);
app.use("/projects/:id/comments", commentRoutes);

app.listen(process.env.PORT|| '3000', process.env.IP, function(){
    console.log("The KickCl0ne server has started");
});