const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const allList = await Listing.find();
  res.render("./listings/index", { allList });
};

module.exports.newlistForm = (req, res) => {
  res.render("./listings/new");
};

module.exports.singleList = async (req, res) => {
  let { id } = req.params;
  const list = await Listing.findById(id)
    .populate({ path: "review", populate: { path: "owner" } })
    .populate("owner");
  if (!list) {
    req.flash(
      "error",
      "Sorry seems you are trying to visiting deleted listing"
    );
    res.redirect("/listings");
  }
  res.render("./listings/show", { list });
};

module.exports.newListing = async (req, res, next) => {
  let location = req.body.list.location.replace(/ /g, "%20"); // Removing Spaces
  let coordinates_data = await fetch(
    `https://api.geoapify.com/v1/geocode/search?text=${location}&format=json&apiKey=${process.env.GEO_KEY}`
  ).then((response) => response.json());

  const geometry = {
    type: "Point",
    coordinates: [
      coordinates_data.results[0].lon,
      coordinates_data.results[0].lat,
    ],
  };
  let url = req.file.path;
  let filename = req.file.filename;
  const listed = new Listing(req.body.list);
  listed.owner = req.user._id;
  listed.image = { url, filename };
  listed.geometry = geometry;
  listed.save();
  req.flash("sucess", "New Listing Created Sucessfulluy !");
  res.redirect("/listings");
};

module.exports.editListing = async (req, res, next) => {
  let { id } = req.params;
  const list = await Listing.findById(id);
  if (!list) {
    req.flash(
      "error",
      "Sorry seems you are trying to visiting deleted listing"
    );
    res.redirect("/listings");
  }
  let orgUrl = list.image.url;
  orgUrl = orgUrl.replace("/uploads", "/uploads/w_250");
  res.render("./listings/edit", { list, orgUrl });
};

module.exports.updateListing = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.list });
  if (typeof req.file !== "unndefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("sucess", "Listing Modify Sucessfulluy !");
  res.redirect(`/listings/${id}`);
};

module.exports.delListing = async (req, res, next) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("sucess", "Listing Deleted Sucessfulluy !");
  res.redirect("/listings");
};

module.exports.filter = async (req, res, next) => {
  let filter = req.path;
  filter = filter.slice(1);
  if (filter == "recently-added") {
    filter = "new";
  }
  let lists = await Listing.find({ category: filter });
  res.render("./listings/filter.ejs", { lists, filter });
};


