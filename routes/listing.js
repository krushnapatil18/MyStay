const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {listingSchema} = require("../schema.js");
const {isLoggedIn, isOwner} = require("../middleware.js");
const listingController = require("../contollers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");

const upload = multer({storage});

const validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);  
    if(error){
        throw new ExpressError(400, error.message);
    }
    next();
}  

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, validateListing, upload.array("listing[images]", 10), wrapAsync(listingController.createListing));


//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, validateListing, upload.array("listing[images]", 10), wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));



//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;