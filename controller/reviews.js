const Review=require("../models/reviews");
const Listing=require("../models/listing");

module.exports.getReview=async (req,res)=>{
    let {id}=req.params;
    let data= await Listing.findById(id);
    res.render("listings/review.ejs",{data});
};

module.exports.createReview=async (req,res)=>{
    let data= await Listing.findById(req.params.id);
    const newRev= new Review(req.body.reviews);
    newRev.author=req.user._id;
    data.reviews.push(newRev);
    let rev=await newRev.save();
    let d=await data.save();
    req.flash("success", "New Review Added!");
    res.redirect(`/listings/${req.params.id}`);
    // console.log(rev);
    // console.log(d);
};

module.exports.deleteReview=async (req,res)=>{
    let {id, reviewID}=req.params;
    let delRev=await Review.findByIdAndDelete(reviewID);
    let del=await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewID}});
    // console.log(delRev);
    // console.log(del);
    req.flash("success", "Review Removed!");
    res.redirect(`/listings/${id}`);
};