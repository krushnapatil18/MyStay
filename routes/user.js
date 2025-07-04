const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../contollers/users.js");

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





module.exports = router;