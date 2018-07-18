var express = require("express");
var router  = express.Router({mergeParams: true});
var Project = require("../models/project");
var Comment = require("../models/comment");

// ====================
// COMMENTS ROUTES
// ====================

router.get("/new", isLoggedIn, function(req, res){
    // find project by id
    Project.findById(req.params.id, function(err, project){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {project: project});
        }
    })
});

router.post("/", isLoggedIn, function(req, res){
   //lookup Project using ID
   Project.findById(req.params.id, function(err, project){
       if(err){
           console.log(err);
           res.redirect("/projects");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               comment.author.enterDate = new Date().getTime();
               //save comment
               comment.save();
          
               project.comments.push(comment);
               project.save();
               res.redirect('/projects/' + project._id);
           }
        });
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