const express =require("express");
const router=express.Router();
const asyncWrap= require("../utils/asyncWrap.js");
const passport= require("passport");
const {saveRedirectUrl}= require("../module/middleware.js");
const userController= require("../controllers/user.js");


router.route("/signup")
.get(userController.sinupRender)
.post(asyncWrap(userController.sinUp))



router.route("/login")
.get(userController.logInRender)
.post(saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true
}),userController.logIn);


// logout
router.get("/logout",userController.logOut);

module.exports= router;