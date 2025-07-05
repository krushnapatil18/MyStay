const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const { cloudinary } = require("../cloudConfig.js");
const mapToken = 'pk.eyJ1Ijoibm90a3Jzc25hIiwiYSI6ImNtY2hiY2VseDByeXUya3NkMmJuYWJsb3YifQ.5RBcbY_vT4Nvxg0XVa54FQ';
const geocodingClient = mbxGeocoding({accessToken: mapToken});

//index route
module.exports.index = async(req, res)=>{
    const { category, search } = req.query;
    let filter = {};
    if (category) {
        filter.category = category;
    }
    if (search) {
        // Case-insensitive, partial match for location or country
        filter.$or = [
            { location: { $regex: search, $options: 'i' } },
            { country: { $regex: search, $options: 'i' } }
        ];
    }
    const allListings = await Listing.find(filter);
    res.render("listings/index.ejs", { allListings, category, search });
}
//new route
module.exports.renderNewForm = (req, res) =>{
    res.render("listings/new.ejs");
}
//show route
module.exports.showListing = async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
            select: "username"
        }
    })
    .populate("owner");


    if(!listing){
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}

//create route
module.exports.createListing = async (req, res) => {

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()

    const newListing = new Listing(req.body.listing);
    // ✅ Attach uploaded images
    if (req.files && req.files.length > 0) {
        newListing.images = req.files.map(file => ({
            url: file.path,
            filename: file.filename
        }));
    }

    newListing.owner = req.user._id;
    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New listing created successfully");
    res.redirect("/listings");
};

//edit route
module.exports.renderEditForm = async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    // Create thumbnail URLs for all images
    let originalImageUrls = [];
    if (listing.images && listing.images.length > 0) {
        originalImageUrls = listing.images.map(img => ({
            url: img.url.replace("/upload", "/upload/w_200"),
            filename: img.filename
        }));
    }
    res.render("listings/edit.ejs", {listing, originalImageUrls});

}

//update route
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    // Prepare update data
    const listingData = { ...req.body.listing };

    // Find the current listing from DB
    let listing = await Listing.findById(id);

    // Check if location has changed
    if (listing.location !== listingData.location) {
        // If location changed, geocode the new location to get new coordinates
        // (geometry is used for the map)
        let response = await geocodingClient.forwardGeocode({
            query: listingData.location,
            limit: 1
        }).send();
        // Update geometry with new coordinates
        listing.geometry = response.body.features[0].geometry;
    }

    // Update other fields
    for (let key in listingData) {
        listing[key] = listingData[key];
    }

    // Handle image removal
    if (req.body.imagesToRemove && Array.isArray(req.body.imagesToRemove)) {
        const imagesToRemove = req.body.imagesToRemove.filter(filename => filename !== '');
        
        if (imagesToRemove.length > 0 && listing.images) {
            // Find images to remove and delete from Cloudinary
            const imagesToDelete = listing.images.filter(img => imagesToRemove.includes(img.filename));
            
            // Delete images from Cloudinary
            for (let img of imagesToDelete) {
                try {
                    // Extract public_id from the URL
                    const publicId = img.filename.split('.')[0]; // Remove file extension
                    await cloudinary.uploader.destroy(publicId);
                    console.log(`Deleted image from Cloudinary: ${publicId}`);
                } catch (error) {
                    console.error(`Error deleting image from Cloudinary: ${error.message}`);
                }
            }
            
            // Filter out images that are marked for removal
            listing.images = listing.images.filter(img => !imagesToRemove.includes(img.filename));
        }
    }

    // Handle new images if uploaded
    if (req.files && req.files.length > 0) {
        // Add new images to existing ones
        const newImages = req.files.map(file => ({
            url: file.path,
            filename: file.filename
        }));
        
        if (listing.images) {
            listing.images = [...listing.images, ...newImages];
        } else {
            listing.images = newImages;
        }
    }

    await listing.save();

    req.flash("success", "Listing updated successfully");
    res.redirect(`/listings/${id}`);
};


//delete route
module.exports.destroyListing = async(req, res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully");
    res.redirect("/listings");
}