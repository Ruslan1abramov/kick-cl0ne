const express         = require("express");
const router          = express.Router({mergeParams: true});
const Project         = require("../models/project");
const Comment         = require("../models/comment");
const middleware      = require("../middleware");

// ====================
// COMMENTS ROUTES
// ====================

router.post("/", middleware.isLoggedIn, function(req, res){
   //lookup Project using ID
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

});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/projects/" + req.params.id );
      }
   });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
//findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
          req.flash("success", "Comment deleted");
          res.redirect("/projects/" + req.params.id);
       }
    });
});


module.exports = router;