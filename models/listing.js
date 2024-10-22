const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user", // wrote according to mngodb
  },

  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },

  category: {
    type: String,
    enum: [
      "room",
      "new",
      "iconic",
      "artic",
      "castle",
      "mountain",
      "water",
      "farm",
      "dome",
      "camping",
      "other",
    ],
    default: "new",
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.review } }); // please check spellings
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
