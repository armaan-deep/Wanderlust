const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError= require("../utils/ExpressError.js");
const {ListingSchema,reviewSchema} = require("../schema.js");
module.exports.isLogin=(req,res,next)=>
{ 
  if(!req.isAuthenticated()){
    req.session.redirectUrl=req.originalUrl;
    req.flash("error","Please Login first");
    res.redirect("/login");
  }
  else{  next();}
}
module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    let link =( req.session.redirectUrl || "/listings");
    res.locals.redirectUrl=link;
  }  
  next();
}

module.exports.isOwner=async(req,res,next)=>{
  let {id} =req.params;
  let list=await Listing.findById(id);
  if(!list.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","You dont have Acess to perform thses actions !");
   return res.redirect(`/listings/${id}`)
  }
  next();
}


module.exports.validateListing=(req,res,next)=>{
  let {error}=ListingSchema.validate(req.body); // check schema
  if(error){
    let errmsg=error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400,errmsg);
  }
  else
   next();
}

module.exports.validateReview=(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body); // check schema
  if(error){
    let errmsg=error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400,errmsg);
  }
  else
   next();
}

module.exports.isROwner=async(req,res,next)=>{
  let {id,rid} =req.params;
  let review=await Review.findById(rid);
  if(!review.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","You dont have Acess to perform thses actions !");
   return res.redirect(`/listings/${id}`)
  }
  next();
}
