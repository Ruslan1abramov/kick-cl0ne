const Project = require("./models/project");
const User = require("./models/user");
const Comment   = require("./models/comment");

const data = [
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
    User.remove({}, function(err){});
    Project.remove({}, function(err){});

}

module.exports = seedDB;