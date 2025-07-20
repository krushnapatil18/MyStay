const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    profilePic: {
        type: String,
        default: "/images/default-profile.png"
    },
    wishlist: [{
        type: Schema.Types.ObjectId,
        ref: "Listing"
    }]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);