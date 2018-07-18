var express = require("express");
var router  = express.Router();
var Project = require("../models/project");

//INDEX - show all projects
router.get("/", function(req,res){
     // Get all prohects from DB
    Project.find({}, function(err, allProjects){
       if(err){
           console.log(err);
       } else {
        console.log('rus', allProjects);
          res.render("projects/index",{projects:allProjects});
       }
    });
});


//CREATE - add new projcts to DB
router.post("/",isLoggedIn, function(req, res){
    // get data from form and add to projects array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
        var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newProject = {name: name, image: image, description: desc, author: author}
    // Create a new projects and save to DB
    Project.create(newProject, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to projects page
            res.redirect("/projects");
        }
    });
});

//NEW - show form to create new project
router.get("/new",isLoggedIn, function(req, res){
   res.render("projects/new"); 
});

// SHOW - shows more info about one project
router.get("/:id", function(req, res){
    //find the project with provided ID
    Project.findById(req.params.id).populate("comments").exec(function(err, foundProject){
        if(err){
            console.log(err);
        } else {
            //render show template with that prohect
            res.render("projects/show", {project: foundProject});
        }
    });
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;

