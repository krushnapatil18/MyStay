const User = require('../models/user');
const Listing = require('../models/listing');

module.exports.addToWishlist = async (req, res) => {
    const userId = req.user._id;
    const { listingId } = req.params;
    await User.findByIdAndUpdate(userId, { $addToSet: { wishlist: listingId } });
    const listing = await Listing.findByIdAndUpdate(listingId, { $inc: { wishlistCount: 1 } }, { new: true });
    req.flash('success', 'Added to your wishlist!');
    if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
        return res.json({ wishlistCount: listing.wishlistCount });
    }
    res.redirect(`/listings/${listingId}`);
};

module.exports.removeFromWishlist = async (req, res) => {
    const userId = req.user._id;
    const { listingId } = req.params;
    await User.findByIdAndUpdate(userId, { $pull: { wishlist: listingId } });
    const listing = await Listing.findByIdAndUpdate(listingId, { $inc: { wishlistCount: -1 } }, { new: true });
    req.flash('success', 'Removed from your wishlist.');
    if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
        return res.json({ wishlistCount: listing.wishlistCount });
    }
    res.redirect(`/listings/${listingId}`);
};

module.exports.getWishlist = async (req, res) => {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.render('users/wishlist', { wishlist: user.wishlist });
}; 