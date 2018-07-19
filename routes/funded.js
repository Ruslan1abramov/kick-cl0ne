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

