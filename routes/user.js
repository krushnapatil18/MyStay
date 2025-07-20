const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const userController = require("../contollers/users.js");
const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");
const Review = require("../models/review.js");
const multer = require("multer");
const { storage, cloudinary } = require("../cloudConfig");
const upload = multer({ storage });


router.route("/")
    
    .post(wrapAsync(userController.signup));

router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), userController.login);

router.route("/logout")
    .get(userController.logout);
    
router.route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));  // <-- Add this line

// Profile page for logged-in user
router.get("/profile", isLoggedIn, async (req, res) => {
  const user = req.user;
  const listings = await Listing.find({ owner: user._id });
  const bookings = await Booking.find({ user: user._id }).populate("listing");
  const reviews = await Review.find({ author: user._id }).populate("listing");
  res.render("users/profile.ejs", { user, listings, bookings, reviews });
});

// Profile picture upload route (Cloudinary)
router.post("/profile/picture", isLoggedIn, upload.single("profilePic"), async (req, res) => {
  if (req.file && req.file.path) {
    const user = await User.findById(req.user._id);
    // Remove old Cloudinary image if not default
    if (user.profilePic && !user.profilePic.startsWith("/images/default-profile.png")) {
      try {
        // Extract public_id from the Cloudinary URL
        const publicId = user.profilePic.split("/").slice(-1)[0].split(".")[0];
        await cloudinary.uploader.destroy(`mystay_DEV/${publicId}`);
      } catch (e) {
        console.error("Cloudinary delete error:", e);
      }
    }
    user.profilePic = req.file.path; // Cloudinary URL
    await user.save();
    req.flash("success", "Profile picture updated!");
  }
  res.redirect("/profile");
});

// Edit profile info route with validation
router.post("/profile/edit", isLoggedIn, async (req, res) => {
  const { username, email } = req.body;
  const user = await User.findById(req.user._id);

  // Check for unique username
  const existingUsername = await User.findOne({ username, _id: { $ne: user._id } });
  if (existingUsername) {
    req.flash("error", "Username is already taken.");
    return res.redirect("/profile");
  }
  // Check for unique email
  const existingEmail = await User.findOne({ email, _id: { $ne: user._id } });
  if (existingEmail) {
    req.flash("error", "Email is already in use.");
    return res.redirect("/profile");
  }

  user.username = username;
  user.email = email;
  await user.save();
  req.flash("success", "Profile updated!");
  res.redirect("/profile");
});


module.exports = router;