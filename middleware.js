const Listing=require("./models/listing");
const Review=require("./models/reviews");
const {listingSchema, reviewSchema}=require("./schema.js");
const ExpressError=require("./ExpressError.js");


module.exports.isLoggedIn=(req,res,next)=>{
    // console.log(req.path, "..",req.originalUrl);
    if(!req.isAuthenticated()){
        // console.log(req.path, "..",req.originalUrl);
        //redirectUrl afetr login
        // req.session.redirectUrl=req.originalUrl; kahe ki login/signup/logout ke baad passport session ko reset kar deta hai isiliye use nhi kar sakte hain
        //res.locals mein save karwa
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","Must login to first!");
        res.redirect("/user/login");
    }
    else{
        next();
    }
}

module.exports.saveRedirectUrl=(req,res,next)=>{
        if(req.session.redirectUrl){
            res.locals.redirectUrl=req.session.redirectUrl;
            // console.log("middleware","..",`${res.locals.redirectUrl}`);
        }
        next();
        // else{
    //     res.redirect("/user/login");
    // }
}



module.exports.validateListing=(req,res,next)=>{
    let {error} = listingSchema.validate(req.body); //schema validation using joi on backend
    console.log(error);
    console.log(new Date());
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, error);
    }
    else{
        next();
    }
}

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    console.log(error);
    console.log(new Date());
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, error);
    }
    else{
        next();
    }
}

module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let data=await Listing.findById(id);
    if(!data.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","Unauthorized Access You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isRevAuthor=async (req,res,next)=>{
    let {id ,reviewID}=req.params;
    let data=await Review.findById(reviewID);
    if(!data.author.equals(res.locals.currUser._id)){
        req.flash("error","Unauthorized Access You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}