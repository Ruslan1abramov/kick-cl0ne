var mongoose = require("mongoose");


// SCHEMA SETUP
var projectSchema = new mongoose.Schema({
   owner: 			String,
   name: 			String,
   image: 			String,
   description: 	String,
   video: 			String,
   link: 			String,
   moneyToRaise:  Number, 
   moneyRaised: 	Number,
   donors: 			[String],
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

module.exports = mongoose.model("Funded", projectSchema);