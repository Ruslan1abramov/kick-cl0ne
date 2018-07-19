var express = require("express");
var router  = express.Router();
var Funded = require("../models/funded");

//INDEX - show all projects
router.get("/", function(req,res){
     // Get all projects from DB
    Funded.find({}, function(err, allFunded){
       if(err){
          console.log(err);
       } else {
          res.render("funded/index",{funded:allFunded});
       }
    });
});


//CREATE - add new projcts to DB
router.post("/", function(req, res){
    // get data from form and add to projects array

    var author = 
    {
        id:           req.user._id,
        username:     req.user.username
    }
    var newProject = {
       owner:         req.user.username,
       name:          req.body.name,
       image:         req.body.image,
       description:   req.body.description,
       video:         req.body.projectVideo,
       link:          req.body.moreInfoLink, 
       moneyToRaise:  req.body.moneyToRaise,
       author:        author
    }
    // Create a new projects and save to DB
    Funded.create(newProject, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
          console.log(newlyCreated);
            //redirect back to projects page
            res.redirect("/funded");
        }
    });
});


// SHOW - shows more info about one project
router.get("/:id", function(req, res){
    //find the project with provided ID
    Funded.findById(req.params.id).populate("comments").exec(function(err, foundProject){
        if(err){
            console.log(err);
        } else {
            //render show template with that prohect
            res.render("funded/show", {project: foundProject});
        }
    });
});


module.exports = router;

