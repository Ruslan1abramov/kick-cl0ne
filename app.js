var express     	= require("express"),
    app         	= express(),
    bodyParser  	= require("body-parser"),
    mongoose    	= require("mongoose"),
    flash       = require("connect-flash"),
    passport    	= require("passport"),
    LocalStrategy 	= require("passport-local"),
    methodOverride 	= require("method-override"),
    Project  		= require("./models/project"),
    Comment     	= require("./models/comment"),
    User        	= require("./models/user"),
    initDB			= require("./initDB");

//requring routes
var commentRoutes    = require("./routes/comments"),
    projectRoutes = require("./routes/projects"),
    indexRoutes      = require("./routes/index")

mongoose.connect("mongodb://localhost/kick_clone");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
initDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Pow Rules",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
})

app.use("/", indexRoutes);
app.use("/projects", projectRoutes);
app.use("/projects/:id/comments", commentRoutes);;

app.listen(process.env.PORT || '3000', process.env.IP, function(){
	console.log("The Kick Clone server has started");
});