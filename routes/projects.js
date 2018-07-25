const   express         = require("express"),
        router          = express.Router(),
        Project         = require("../models/project"),
        middleware      = require("../middleware");
        cloudinary      = require('cloudinary');

// =========== Image Upload Configuration =============


// cloudinary config
cloudinary.config({
    cloud_name: 'ruslan-kickclone',
    api_key: '771449912674837',
    api_secret: 'wparRy8UFjp2SmRrA2Z_2CaoxNA'
});

//INDEX - show all projects
router.get("/", function(req,res){
     // Get all projects from DB
    Project.find({isActive: true}, function(err, allProjects){
       if(err){
          console.log(err);
       } else {
          res.render("projects/index",{projects:allProjects});
       }
    });
});
//funded - show all projects
router.get("/funded", function(req,res){
    // Get all projects from DB
    Project.find({isActive: false}, function(err, allFunded){
        if(err){
            console.log(err);
        } else {
            res.render("projects/funded",{ funded:allFunded});
        }
    });
});


//CREATE - add new projcts to DB
router.post("/insert",middleware.isLoggedIn, function(req, res){
    // get data from form and add to projects array
    let noImage = {secure_url: 'https://res.cloudinary.com/ruslan-kickclone/image/upload/v1532363251/Product-Coming-Soon-image-600x600.png',
        public_id : ''};
    let author =
    {
        id:           req.user._id,
        username:     req.user.username
    };

    let newProject = {
       owner:         req.user.username,
       name:          req.body.name,
       image:         req.body.posterCloud === 'none' ? noImage : getImageData(JSON.parse(req.body.posterCloud)),
       description:   req.body.description,
        oneLiner:     req.body.oneLiner,
       video:         req.body.video,
       link:          req.body.link,
       endTime:       new Date(req.body.endTime),
       moneyToRaise:  req.body.moneyToRaise,
       moneyRaised:   0,
       isActive:      true,
        morePictures: getImages( req.body.moreImages === [] ? null : JSON.parse(req.body.moreImages)),
       author:        author
    };

    Project.create(newProject, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
          console.log(newlyCreated);
            // Create a new projects and save to DB
            //redirect back to projects page
            res.redirect("/projects");
        }
    });
});

function getImageData( posterInfo){
    if(posterInfo)
        return {secure_url : posterInfo.secure_url, public_id: posterInfo.public_id};
}

function getImages( infoArray){
    if(infoArray) {
        let images = [];
        infoArray.forEach(function (pic) {
            images.push(getImageData(pic));
        });
        return images;
    }
}

//NEW - show form to create new project
router.get("/new",middleware.isLoggedIn, function(req, res){
   res.render("projects/new"); 
});

// SHOW - shows more info about one project
router.get("/:id", function(req, res){
    //find the project with provided ID
    Project.findById(req.params.id).populate("comments").exec(function(err, foundProject){
        if(err){
            console.log(err);
        } else {
            //render show template with that projects
            res.render("projects/show", {project: foundProject});
        }
    });
});

// EDIT Project ROUTE
router.get("/:id/edit", middleware.checkProjectOwnership, function(req, res){
    Project.findById(req.params.id, function(err, foundProject){
      console.log(foundProject);
        res.render("projects/edit", {project: foundProject});
    });
});

//add donors and money raised
router.post("/:id",middleware.isLoggedIn, function(req, res){

    // find and update the correct project
    Project.findById(req.params.id, function(err, foundProject){
        console.log(foundProject);
        let newDonor = null;
        foundProject.moneyRaised += Number(req.body.donation);
        if(!foundProject.donors.includes(req.user.username))
        {
            foundProject.donors.push(req.user.username);
            newDonor = req.user.username;
        }
        foundProject.save(function(err, updated){
            if(err){
                res.render("/projects");
            } else {
                //redirect somewhere(show page)
                console.log(updated);
                res.send({moneyRaised: updated.moneyRaised, newDonor: newDonor});
            }
        });

    });
});

// UPDATE Project ROUTE
router.put("/:id",middleware.checkProjectOwnership, function(req, res){
    // find and update the correct project
    let toRemoveArr = [];
    //handling the updated pictures
    if(req.body.project.image !== null)
        req.body.project.image = getImageData(JSON.parse(req.body.project.image));
    if(req.body.project.morePictures !== null)
        req.body.project.morePictures = getImages( JSON.parse(req.body.project.morePictures));
    if(req.body.toRemove !== null)
        toRemoveArr = getImages( JSON.parse(req.body.toRemove));

    toRemoveArr.forEach(el =>{
        req.body.project.morePictures.forEach((pic, index)=>{
            if(el.public_id === pic.public_id){
                console.log("taaaaaaaaaaaaaaa" , el , req.body.project.morePictures[index]);
                cloudinary.v2.uploader.destroy(el.public_id, function(error, result){console.log(result, error)});
                req.body.project.morePictures.splice(index, 1);
            }
        });

    });


    Project.findByIdAndUpdate(req.params.id, req.body.project, function(err, updatedProject){
       if(err){
           res.redirect("/projects");
       } else {
           //redirect somewhere(show page)
           console.log(updatedProject);
           res.redirect("/projects/" + req.params.id);
       }
    });


});

// DESTROY Project ROUTE
router.delete("/:id",middleware.checkProjectOwnership, function(req, res){
    //removing all picture from cloud
    Project.findById(req.params.id, function(err, foundProject){
        foundProject.morePictures.forEach(pic => {
            cloudinary.v2.uploader.destroy(pic.public_id, function(error, result){console.log(result, error)});
        });
        cloudinary.v2.uploader.destroy(foundProject.image.public_id, function(error, result){console.log(result, error)});
    })
    //delete the project
   Project.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/projects");
      } else {
          res.redirect("/projects");
      }
   });
});

module.exports = router;

