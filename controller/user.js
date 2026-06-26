const User=require("../models/user");

module.exports.renderSignUp=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signUp=async (req,res)=>{
    let {username,email,password}=req.body;
    const newUser=new User({email, username});
    let data=await User.register(newUser, password);
    console.log(data);
    req.login(data,(err)=>{
        if(err){
            next(err);
        }
        else{
            req.flash("success","New User Registered!");
            res.redirect("/listings");
        }
    });
    // catch(e){
    //     req.flash("error", "User already exists!");
    //     console.log(e);
    //     console.log(data);
    //     res.redirect("/user/signup");
    // }
};

module.exports.renderLogIn=(req,res)=>{
    res.render("users/login");
};

module.exports.LogIn=(req,res)=>{
    // let {username, password}=req.body;
    req.flash("success","Your Are Now Logged In!");
    // console.log(res.locals.redirectUrl,"Aur bakait");
    if(res.locals.redirectUrl){
        res.redirect(res.locals.redirectUrl);
        // console.log(res.locals.redirectUrl);
    }
    else{
        res.redirect("/listings");
        // console.log("sfianf");
    }
    // let redirectUrl=res.locals.redirectUrl || "/listings";
    // delete req.session.redirectUrl;
    // res.redirect(redirectUrl);
}

module.exports.logOut=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            next(err);
        }
        else{
            req.flash("success","You've now logged out");
            res.redirect("/listings");
        }
    });
};