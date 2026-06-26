const express=require("express");
const asyncWrap=require("../utils/asyncWrap.js");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../controller/user.js");

const router=express.Router({mergeParams:true});

router.get("/signup",userController.renderSignUp);

router.post("/signup", asyncWrap(userController.signUp));

router.get("/login", userController.renderLogIn);

router.post("/login", saveRedirectUrl, passport.authenticate("local",{failureRedirect:"/user/login", failureFlash:true}), userController.LogIn);

router.get("/logout", userController.logOut);
// router.get("/demouser", async (req,res)=>{
// let fakeuser= new User({
//         email:"tantrik@gmail.com",
//         username:"Kumar Tantrik",
//     });
//     let data=await User.register(fakeuser, "hemlo world");
//     res.send(data);
// });

module.exports=router;