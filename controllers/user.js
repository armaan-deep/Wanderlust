const user = require("../models/user.js");

module.exports.sinupRender=(req,res,next)=>{
    res.render("./user/signup.ejs")
};


module.exports.sinUp=async(req,res,next)=>{
    try{ 
     let {username,email,password}= req.body;
     const newUser= new user({username,email});
     const registerUser=await user.register(newUser,password);
     req.login(registerUser,(err)=>{
         if(err)return next(err);
         else{
               req.flash("sucess",`Welcome to Wanderlust Family ${username} :)`);
               res.redirect("/listings");
             }
      })
    }catch(err){
         req.flash("error",`${err.message}`);
         res.redirect("/signup");
    } 
};


module.exports.logInRender=(req,res)=>{
    res.render("./user/login.ejs");
};

module.exports.logIn=async(req,res)=>{
    let {username}=req.body;
    req.flash("sucess",`Welcome back to Wanderlust family ${username}`);
    if(!res.locals.redirectUrl){
        res.redirect("/listings");
    }
    else{
        await res.redirect(res.locals.redirectUrl);
    }
};

module.exports.logOut=async(req,res,next)=>{
    await req.logout((err)=>{
      if(err)return next(err);
      else{
       req.flash("sucess",`User Logout  Sucessfully It is Always Good Pratice to Logout`);
       res.redirect("/listings");
      }
    })
};