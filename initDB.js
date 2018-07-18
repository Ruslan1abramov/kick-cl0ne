var mongoose = require("mongoose");
var Project = require("./models/project");
var Comment   = require("./models/comment");

var data = [
    {
        name: "coffee machine", 
        image: "https://farm4.staticflickr.com/3859/15123592300_6eecab209b.jpg",
        description: "blah blah blah",
        endTime: "Sep 1, 2018 15:37:25"
    },
    
    {
        owner:          "String",
        name:            "String",
        image:           "https://farm4.staticflickr.com/3859/15123592300_6eecab209b.jpg",
        description:     "String",
        video:           "String",
        link:            "String", 
        endTime:         new Date("Aug 1, 2018 15:37:25"),
        moneyToRaise:    1000,
        moneyRaised:     0,
        donors:          ["String"],

    },

    {
        name: "Car", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "blah blah blah",
        endTime: "Aug 5, 2018 15:37:25"
    }
]

function seedDB(){
   //Remove all projects
   Project.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed projects!");
         //add a few Project
        data.forEach(function(seed){
            Project.create(seed, function(err, project){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a project");
                    //create a comment
                    Comment.create(
                        {
                            text: "This project is great",
                            author: {username : "mr taa",
                                     enterDate: new Date("Aug 1, 2018 15:37:25")
                                    } 
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                project.comments.push(comment);
                                project.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    }); 
    //add a few comments
}

module.exports = seedDB;