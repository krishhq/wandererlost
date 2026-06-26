const express=require("express");
const asyncWrap=require("../utils/asyncWrap.js");
const {isLoggedIn, isOwner, validateListing}=require("../middleware.js");
const {storage}=require("../cloudConfig.js");
const multer  = require("multer")
const upload = multer({ storage });
const listingController=require("../controller/listing.js");

const router=express.Router({mergeParams:true});

router.route("/new")
.get(isLoggedIn, listingController.newListingForm)
.post(isLoggedIn, validateListing, upload.single("listing[image]"), asyncWrap(listingController.createListing));

router.route("/:id")
.get(asyncWrap(listingController.showListing))
.post(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, asyncWrap(listingController.updateListing))
.delete(isLoggedIn, isOwner, asyncWrap(listingController.deleteListing));

//index
router.get("/", asyncWrap(listingController.indexRoute));

//new listing form
// router.get("/new", isLoggedIn, listingController.newListingForm);

//create
// router.post("/new", isLoggedIn, validateListing, asyncWrap(listingController.createListing));

//show
// router.get("/:id", asyncWrap(listingController.showListing));

//editing form
router.get("/:id/edit", isLoggedIn, isOwner, asyncWrap(listingController.getEditForm));

//update
// router.post("/:id", isLoggedIn, isOwner, validateListing, asyncWrap(listingController.updateListing));

//delete
// router.delete("/:id", isLoggedIn, isOwner, asyncWrap(listingController.deleteListing));

module.exports=router;

//listing form
// router.get("/new", (req,res)=>{
//     // console.log(req.user);
//     if(!req.isAuthenticated()){
//         req.flash("error","Must login for listing a property");
//         res.redirect("/user/login");
//     }
//     else{
//         res.render("listings/list.ejs");
//     }
// });