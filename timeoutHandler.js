var mongoose = require("mongoose");
var Project = require("./models/project");
var Funded = require("./models/funded");

var timeoutHander = {
	handleTimeOut: function handleTimeOut(project) {
	    Project.findById(project._id, function(err, foundProject){
	      	if(foundProject.moneyRaised>= foundProject.moneyToRaise)
		      	{
			      	var funded = {
			      		owner: 			foundProject.owner,
						name: 			foundProject.name,
						image: 			foundProject.image,
						description: 	foundProject.description,
						video: 			foundProject.video,
						link: 			foundProject.link,
						moneyToRaise:  	foundProject.moneyToRaise, 
						moneyRaised: 	foundProject.moneyRaised,
						donors: 		foundProject.donors,
						author: 		foundProject.author,
						isActive:       false,
						comments: 		foundProject.comments
					}
					Funded.create(funded, function(err, newlyCreated){
				        if(err){
				            console.log(err);
				        } else {
				          console.log("add funded project");
				         
				        }
			    	});
				}
			Project.remove({_id: project._id}, 
		    function(err){
			if(err) console.log(err);
			else    console.log('Removed');
			});
		});
	}
}


module.exports = timeoutHander;