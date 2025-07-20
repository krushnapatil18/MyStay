const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: [true, "Listing title is required"],
    trim: true,
    minlength: [1, "Title must be at least 1 characters"],
    maxlength: [100, "Title must be under 100 characters"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, "Description too long"],
    default: "No description provided",
  },
  images: [
    {
      filename: {
        type: String,
        // Not required — because image might not change during edit
      },
      url: {
        type: String,
        required: true,
        validate: {
          validator: function (v) {
            return /^https?:\/\/.+/i.test(v); // Validates URL
          },
          message: props => `"${props.value}" is not a valid image URL`,
        }
      }
    }
  ],  
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
  location: {
    type: String,
    required: [true, "Location is required"],
    trim: true,
  },
  country: {
    type: String,
    required: [true, "Country is required"],
    trim: true,
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: [
      "Trending",
      "Rooms",
      "Iconic Cities",
      "Mountain",
      "Castles",
      "Amazing Pools",
      "Campings",
      "Farms",
      "Arctic Places",
      "Domes"
    ]
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  wishlistCount: {
    type: Number,
    default: 0
  }
});

listingSchema.post("findOneAndDelete", async (listing) =>{
  if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}});
  }
});

// 👇 Export the model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;