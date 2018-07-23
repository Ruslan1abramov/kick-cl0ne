var mongoose = require("mongoose");
var Project = require("./models/project");
var Comment   = require("./models/comment");
/*
[ { _id: 5b4f39c9f248ff3127e17870, username: '1', __v: 0 },
  { _id: 5b4f6ac392e9eb39d82cf256, username: '2', __v: 0 },
  { _id: 5b4fa3ca8dbdcb4eac403f7a, username: 'rus', __v: 0 },
  { _id: 5b4fa57a8e01295067611321, username: 'tatata', __v: 0 },
  { _id: 5b4fa5b853d7ce519a155663, username: 'tart', __v: 0 },
  { _id: 5b4fa64405223351dc106ab9, username: 'er', __v: 0 } ]

*/
var data = [
    {   
        name:           "coffee machine", 
        image:          {url : "https://farm4.staticflickr.com/3859/15123592300_6eecab209b.jpg", signature :"svsv"},
        description:    "blah blah blah",
        endTime:         new Date(),
        isActive:        true
    },
    
    {   
        owner:           "String",
        name:            "String",
        image:           {url : "https://farm4.staticflickr.com/3859/15123592300_6eecab209b.jpg", signature :"svsv"},
        description:     "String",
        video:           "String",
        link:            "String", 
        endTime:         new Date("Aug 1, 2018 15:37:25"),
        moneyToRaise:    1000,
        moneyRaised:     0,
        isActive:        true,
        donors:          ["String"]

    },

    {   
        name:            "Car", 
        image:           {url : "https://farm4.staticflickr.com/3859/15123592300_6eecab209b.jpg", signature :"svsv"},
        description:     "blah blah blah",
        endTime:         "Aug 5, 2018 15:37:25",
        isActive:        true
    }
];

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

}

module.exports = seedDB;