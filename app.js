if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express=require("express");
const mongoose=require("mongoose");
const methodOverride=require("method-override");
const Joi=require("joi");
const path=require("path");
const ejsMate=require("ejs-mate");
const ExpressError=require("./ExpressError.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const session=require("express-session");
const MongoStore=require("connect-mongo").default;
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


const port=8080;
const app=express();
// const mongoUrl="mongodb://127.0.0.1:27017/wl";
const dbUrl=process.env.ATLASDB_URL;
const storeOptions={
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600
};
const store=MongoStore.create(storeOptions);
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60*24*3,
        maxAge:1000*60*60*24*3,
        httpOnly:true
    }
};
store.on("error",(err)=>{
    console.log("err in mongoDB Store", err);
});

async function main(){
    await mongoose.connect(dbUrl);
}
main()
    .then((res)=>{
        console.log(res);
        console.log("Connection Successfull");
    })
    .catch((err)=>{
        console.log(err);
        console.log("Connection bhanja gaya");
    });

app.set("views", path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(session(sessionOptions));
app.use(flash());
app.engine("ejs", ejsMate);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// function asyncWrap(fn){
//     return function(req,res,next){
//         fn(req,res,next).catch((err)=>next(err));
//     }
// }
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/review", reviewRouter);
app.use("/user",userRouter);

app.listen(port,(req,res)=>{
    console.log("Bhanjao Bhanjao");
});

//404
app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
    console.log("***Request from 404 middleware***");
    console.dir(req);
    console.log(req.originalUrl);
    console.log("***Request from 404 middleware***");

});

//error handler
app.use((err,req,res,next)=>{
    console.dir(err);
    let {status=500, message="Some Internal Error"}=err;
    res.status(status).render("error.ejs",{err});
    // res.status(status).send(message);
});