var express         = require("express");
var router          = express.Router({mergeParams: true});
var Funded          = require("../models/funded");
var Project         = require("../models/project");
var Comment         = require("../models/comment");
var middleware      = require("../middleware");

// ====================
// COMMENTS ROUTES
// ====================

router.get("/new", middleware.isLoggedIn, function(req, res){
    // find project by id
    var str = req._parsedOriginalUrl.path;
    console.log("##################33",str);
    if(str.includes('projects'))
    {
      Project.findById(req.params.id, function(err, project){
          if(err){
              console.log(err);
          } else {
               res.render("comments/new", {project: project});
          }
      })
    }
    else
    {
        Funded.findById(req.params.id, function(err, project){
        if(err){
            console.log(err);
        } else {
            console.log("##################33",project);
            res.render("comments/newF", {project: project});
        }
    })
    }
});

router.post("/", middleware.isLoggedIn, function(req, res){
   //lookup Project using ID
    var str = req._parsedOriginalUrl.path;
    console.log("##################33",str);
    if(str.includes('projects'))
    {
       Project.findById(req.params.id, function(err, project){
           if(err){
               console.log(err);
               res.redirect("/projects");
           } else {
            Comment.create(req.body.comment, function(err, comment){
               if(err){
                  req.flash("error", "Something went wrong");
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
                   req.flash("success", "Successfully added comment");
                   res.redirect('/projects/' + project._id);
               }
            });
           }
       });
     }
     else
     {

       Funded.findById(req.params.id, function(err, project){
           if(err){
               console.log(err);
               res.redirect("/funded");
           } else {
            Comment.create(req.body.comment, function(err, comment){
               if(err){
                  req.flash("error", "Something went wrong");
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
                   req.flash("success", "Successfully added comment");
                   res.redirect('/funded/' + project._id);
               }
            });
           }
       });
     }

});


// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    var str = req._parsedOriginalUrl.path;
    console.log("##################33",str);
    if(str.includes('projects'))
    {
       Comment.findById(req.params.comment_id, function(err, foundComment){
          if(err){
              res.redirect("back");
          } else {
            res.render("comments/edit", {project_id: req.params.id, comment: foundComment});
          }
       });
    }
    else
    {
        Comment.findById(req.params.comment_id, function(err, foundComment){
          if(err){
              res.redirect("back");
          } else {
            res.render("comments/editF", {project_id: req.params.id, comment: foundComment});
          }
       });
    }
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    var str = req._parsedOriginalUrl.path;
    console.log("##################33",str);
    if(str.includes('projects'))
    {
       Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
          if(err){
              res.redirect("back");
          } else {
              res.redirect("/projects/" + req.params.id );
          }
       });
     }
     else
     {
      Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
          if(err){
              res.redirect("back");
          } else {
              res.redirect("/funded/" + req.params.id );
          }
       });
     }
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    var str = req._parsedOriginalUrl.path;
    console.log("##################33",str);
    if(str.includes('projects'))
    {
        Comment.findByIdAndRemove(req.params.comment_id, function(err){
           if(err){
               res.redirect("back");
           } else {
              req.flash("success", "Comment deleted");
              res.redirect("/projects/" + req.params.id);
           }
        });
      }
     else
     {
          Comment.findByIdAndRemove(req.params.comment_id, function(err){
           if(err){
               res.redirect("back");
           } else {
              req.flash("success", "Comment deleted");
              res.redirect("/funded/" + req.params.id);
           }
        });
      }
});


module.exports = router;