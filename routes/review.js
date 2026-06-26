const express=require("express");
const asyncWrap=require("../utils/asyncWrap.js");
const {validateReview, isLoggedIn, isRevAuthor}=require("../middleware.js");
const reviewController=require("../controller/reviews.js");

const router=express.Router({mergeParams:true});

//get review form
router.get("/", asyncWrap(reviewController.getReview));

//create
router.post("/", isLoggedIn, validateReview, asyncWrap(reviewController.createReview));

//delete
router.delete("/:reviewID", isLoggedIn, isRevAuthor, asyncWrap(reviewController.deleteReview));

module.exports=router;