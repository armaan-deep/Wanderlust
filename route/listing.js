const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap.js");
const path = require("path");
const {
  isLogin,
  isOwner,
  validateListing,
} = require("../module/middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.use(express.static(path.join(__dirname, "public")));

// search result filters

router.get("/room", asyncWrap(listingController.filter));
router.get("/iconic", asyncWrap(listingController.filter));
router.get("/artic", asyncWrap(listingController.filter));
router.get("/castle", asyncWrap(listingController.filter));
router.get("/mountain", asyncWrap(listingController.filter));
router.get("/water", asyncWrap(listingController.filter));
router.get("/farm", asyncWrap(listingController.filter));
router.get("/dome", asyncWrap(listingController.filter));
router.get("/camping", asyncWrap(listingController.filter));
router.get("/other", asyncWrap(listingController.filter));
router.get("/recently-added", asyncWrap(listingController.filter));


// New listing
router
  .route("/new")
  .get(isLogin, listingController.newlistForm)
  .post(
    isLogin,
    upload.single("list[image]"),
    validateListing,
    asyncWrap(listingController.newListing)
  );

// ALL listings request
router.get("/", asyncWrap(listingController.index));

router
  .route("/:id")
  .get(asyncWrap(listingController.singleList))
  .put(
    isLogin,
    isOwner,
    upload.single("list[image]"),
    validateListing,
    asyncWrap(listingController.updateListing)
  )
  .delete(isLogin, isOwner, asyncWrap(listingController.delListing));

// Edit route
router.get("/:id/edit", isLogin, asyncWrap(listingController.editListing));

module.exports = router;
