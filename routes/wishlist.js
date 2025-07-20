const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const wishlistController = require('../contollers/wishlist');

// Add to wishlist
router.post('/:listingId/add', isLoggedIn, wishlistController.addToWishlist);
// Remove from wishlist
router.post('/:listingId/remove', isLoggedIn, wishlistController.removeFromWishlist);
// Get user's wishlist
router.get('/', isLoggedIn, wishlistController.getWishlist);

module.exports = router; 