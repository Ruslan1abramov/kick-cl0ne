var express         = require("express");
var router          = express.Router();
var Project         = require("../models/project");
var middleware      = require("../middleware");
var timeoutHandler  = require("../timeoutHandler");

//INDEX - show all projects
router.get("/", function(req,res){
     // Get all projects from DB
    Project.find({}, function(err, allProjects){
       if(err){
          console.log(err);
       } else {
          res.render("projects/index",{projects:allProjects});
       }
    });
});


//CREATE - add new projcts to DB
router.post("/",middleware.isLoggedIn, function(req, res){
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
       endTime:       new Date(req.body.endTime),
       moneyToRaise:  req.body.moneyToRaise,
       moneyRaised:   0,
       isActive:      true,
       author:        author
    }

    Project.create(newProject, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
          console.log(newlyCreated);
          setTimeout(function(){timeoutHandler.handleTimeOut(newlyCreated)},
            new Date(newProject.endTime).getTime() - new Date().getTime())
            // Create a new projects and save to DB
            //redirect back to projects page
            res.redirect("/projects");
        }
    });
});

//NEW - show form to create new project
router.get("/new",middleware.isLoggedIn, function(req, res){
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

// EDIT Project ROUTE
router.get("/:id/edit", middleware.checkProjectOwnership, function(req, res){
    Project.findById(req.params.id, function(err, foundProject){
      console.log(foundProject);
        res.render("projects/edit", {project: foundProject});
    });
});

// UPDATE Project ROUTE
router.put("/:id",middleware.checkProjectOwnership, function(req, res){
    // find and update the correct project
    Project.findByIdAndUpdate(req.params.id, req.body.project, function(err, updatedProject){
       if(err){
           res.redirect("/projects");
       } else {
           //redirect somewhere(show page)
           console.log(updatedProject);
           res.redirect("/projects/" + req.params.id);
       }
    });
});

// DESTROY Project ROUTE
router.delete("/:id",middleware.checkProjectOwnership, function(req, res){
   Project.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/projects");
      } else {
          res.redirect("/projects");
      }
   });
});

module.exports = router;

