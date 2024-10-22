const Listing = require("../models/listing.js");
const review = require("../models/review.js");

module.exports.updateRen=async(req,res)=>{
    let {id,rid} =req.params;
    let list = await Listing.findById(id);
    let Review =await review.findById(rid);
    res.render("./reviews/editRev.ejs",{Review,list});
};


module.exports.add=async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new review(req.body.review);
    newReview.owner=req.user._id;
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("sucess","Review Added Sucessfulluy !");
    res.redirect(`/listings/${req.params.id}`);
};


module.exports.destroy=async (req,res,next)=>{    
    let {id,rid} =req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:rid}});
    await review.findByIdAndDelete(rid);
    req.flash("sucess","Review Delete Sucessfulluy !");
    res.redirect(`/listings/${id}`);
};


module.exports.update=async (req,res,next)=>{    
    let {id,rid} =req.params;
    await review.findByIdAndUpdate(rid,{...req.body.review});
    req.flash("sucess","Review Updated Sucessfulluy !");
    res.redirect(`/listings/${id}`);
};