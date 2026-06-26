const Listing=require("../models/listing");
const ExpressError=require("../ExpressError");
const mbxGeocoding=require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken=process.env.MAP_TOKEN;
const baseClient = mbxGeocoding({accessToken:mapToken});

module.exports.indexRoute= async (req,res)=>{
    const list= await Listing.find({});
    res.render("listings/index.ejs",{list});
};

module.exports.newListingForm=(req,res)=>{
    // console.log(req.user);
    res.render("listings/list.ejs");
};

module.exports.createListing=async (req,res,next)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send Valid Data For Listing!")
    // }
    // let validSchemaRes = listingSchema.validate(req.body.listing); //schema validation using joi on backend
    // console.log(validSchemaRes);
    // console.log(new Date());
    // if(validSchemaRes.error){
    //     throw new ExpressError(400, validSchemaRes.error);
    // }
    const newListing=new Listing(req.body.listing);
    let {path, filename}=req.file;
    // console.log(path," .. ", filename);
    newListing.owner=req.user._id;
    newListing.image.filename=filename;
    newListing.image.url=path;
    let coordinatesResponse=await baseClient.forwardGeocode({
        query: newListing.location,
        limit:1
    }).send();
    newListing.geometry=coordinatesResponse.body.features[0].geometry;
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};

module.exports.showListing= async (req,res)=>{
    let {id}=req.params;
    const data= await Listing.findById(id).populate({path:"reviews", populate:{path:"author"}}).populate("owner");//nested populate
    if(!data){
        req.flash("error","Listing Does Not Exist!");
        res.redirect("/listings");
    }
    // console.log(data);
    res.render("listings/show.ejs", {data});
};

module.exports.getEditForm=async (req,res)=>{
    let {id}=req.params;
    let data= await Listing.findById(id);
    if(!data){
        req.flash("error","Listing Does Not Exist!");
        res.redirect("/listings");
    }
    let originalImage=data.image.url;
    let reducedImage=originalImage.replace("/upload","/upload/h_300,w_300");
    res.render("listings/edit.ejs",{data, reducedImage});
};

module.exports.updateListing=async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send Valid Data For Listing!")
    }
    let {id}=req.params;
    let data=await Listing.findById(id);
    data=await Listing.findByIdAndUpdate(id, {...req.body.listing},{returnDocument:"after", runValidators:true});
    if(req.file){
        let {path, filename}=req.file;
        // console.log(path," .. ", filename);
        data.image.url=path;
        data.image.filename=filename;
    }
    let newData=await data.save();
    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing=async (req,res)=>{
    let {id}=req.params;
    let del=await Listing.findByIdAndDelete(id);
    // console.log(del);
    req.flash("success","Listing Deleted Successfully!");
    res.redirect("/listings");
};