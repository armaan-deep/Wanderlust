const express =require("express");
const router=express.Router({mergeParams:true});
const asyncWrap= require("../utils/asyncWrap.js");
const {validateReview,isLogin,isROwner}= require("../module/middleware.js");
const reviewController=require("../controllers/review.js");  
  
// update render and update route
router.route("/:rid/edit")
.get(isLogin,isROwner,asyncWrap(reviewController.updateRen))
.put(isLogin,isROwner,validateReview,asyncWrap(reviewController.update))
  
// adding reviews 
router.post("/",isLogin,validateReview,asyncWrap(reviewController.add));

// delete  review route
router.delete("/:rid",isLogin,isROwner,asyncWrap(reviewController.destroy));

module.exports= router;