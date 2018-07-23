var mongoose = require("mongoose");


// SCHEMA SETUP
var projectSchema = new mongoose.Schema({
   owner: 			String,
   name: 			String,
   image: 			{secure_url: String, public_id : String},
   description: 	String,
   oneLiner: 	    String,
   video: 			String,
   link: 			String, 
   endTime: 		Date,
   moneyToRaise: 	Number,
   moneyRaised: 	Number,
   isActive:        Boolean,
   donors: 			[String],
   morePictures:    [{secure_url: String, public_id : String}],


   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]

});
projectSchema.index({isActive: 1, endTime: 1})

const Project = mongoose.model("Project", projectSchema);

const TEN_MINUTES = 10 * 60 * 1000;
setInterval(() => {

    Project.find({
        isActive: true,
        endTime: {$lte: new Date()}
    }).then(projectThatWereFinished => {
        projectThatWereFinished.forEach(project => {
           if(project.moneyRaised >= project.moneyToRaise)
           {
               console.log('THIS PROJECT IS DONE And Funded', project);
               project.isActive = false;
               project.save(function(err, updated){
                   if(err){
                       console.log(err);
                   } else {
                       console.log(updated);
                   }
               });
           }
           else
           {
               console.log('THIS PROJECT IS DONE And not funded', project);
               project.remove(function(err){
                   if(err){
                       console.log(err);
                   } else {
                       console.log('project removed');;
                   }
               });
           }


        });
    })
}, TEN_MINUTES);

module.exports = Project;
