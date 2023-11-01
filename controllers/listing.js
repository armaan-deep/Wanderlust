const Listing = require("../models/listing.js");
const mapToken= process.env.MAP_KEY;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index=async (req,res)=>{ 
    const allList=await Listing.find();
     res.render("./listings/index",{allList});
};

module.exports.newlistForm=(req,res)=>{  
    res.render("./listings/new");
};

module.exports.singleList=async(req,res)=>{  
    let {id}= req.params;
    const list=await Listing.findById(id).populate({path:"review",populate:{path:"owner"}}).populate("owner");
    if(!list){
      req.flash("error","Sorry seems you are trying to visiting deleted listing")
      res.redirect("/listings");
    }
    res.render("./listings/show",{list});
};


module.exports.newListing=async(req,res,next)=>{ 
   let cordinates= await geocodingClient.forwardGeocode({
    query:req.body.list.location,
    limit: 1
  }).send();
        let url= req.file.path;
        let filename=req.file.filename;
        const listed= new Listing(req.body.list);
        listed.owner=req.user._id;
        listed.image={url,filename};
        listed.geometry= cordinates.body.features[0].geometry;
        listed.save();
      req.flash("sucess","New Listing Created Sucessfulluy !");
      res.redirect("/listings");
};


module.exports.editListing=async (req,res,next)=>{    
    let {id} =req.params;
    const list=await Listing.findById(id);
    if(!list){
      req.flash("error","Sorry seems you are trying to visiting deleted listing")
      res.redirect("/listings");
    }
     let orgUrl=list.image.url;
     orgUrl=orgUrl.replace("/uploads","/uploads/w_250");
     res.render("./listings/edit",{list,orgUrl});
};


    module.exports.updateListing=async (req,res,next)=>{     
        let {id} =req.params;
        let listing=await Listing.findByIdAndUpdate(id,{...req.body.list});
        if(typeof req.file !=="unndefined"){
          let url= req.file.path;
          let filename=req.file.filename;
          listing.image={url,filename};
          await listing.save(); 
        }
        req.flash("sucess","Listing Modify Sucessfulluy !");  
        res.redirect(`/listings/${id}`);
};


        module.exports.delListing=async(req,res,next)=>{    
            let {id} =req.params;
             await Listing.findByIdAndDelete(id);
             req.flash("sucess","Listing Deleted Sucessfulluy !");
            res.redirect("/listings");
};


module.exports.filter=async(req,res,next)=>{  
   let filter = req.path;
   filter=filter.slice(1);  
   let lists=await Listing.find({category:filter});
    res.render("./listings/srch.ejs",{lists,filter});
};