const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");
const { isLoggedIn } = require("../middleware.js");

// Show booking form
router.get("/listings/:id/book", isLoggedIn, async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("bookings/book.ejs", { listing });
});

// Handle booking submission
router.post("/listings/:id/book", isLoggedIn, async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  const { checkIn, checkOut, guests } = req.body;
  // Simple price calculation (price * nights)
  const nights = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
  if (nights < 1) {
    req.flash("error", "Check-out must be after check-in.");
    return res.redirect(`/listings/${listing._id}/book`);
  }
  const totalPrice = listing.price * nights;

  const overlapping = await Booking.findOne({
    listing: listing._id,
    $or: [
      {
        checkIn: { $lt: checkOut },
        checkOut: { $gt: checkIn }
      }
    ]
  });
  if (overlapping) {
    req.flash("error", "These dates are already booked. Please choose different dates.");
    return res.redirect(`/listings/${listing._id}/book`);
  }

  const booking = new Booking({
    listing: listing._id,
    user: req.user._id,
    checkIn,
    checkOut,
    guests,
    totalPrice,
    status: "confirmed"
  });

  await booking.save();
  req.flash("success", "Booking confirmed!");
  res.redirect(`/bookings/${booking._id}/confirmation`);
});

// Show booking confirmation
router.get("/bookings/:bookingId/confirmation", isLoggedIn, async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId).populate("listing").populate("user");
  if (!booking) {
    req.flash("error", "Booking not found");
    return res.redirect("/listings");
  }
  res.render("bookings/confirmation.ejs", { booking });
});

// Show all bookings for the logged-in user
router.get("/my-bookings", isLoggedIn, async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("listing")
    .sort({ checkIn: 1 });
  res.render("bookings/myBookings.ejs", { bookings });
});

// Show all bookings for listings owned by the current user (host)
router.get("/host/bookings", isLoggedIn, async (req, res) => {
  // Find all listings owned by the current user
  const listings = await Listing.find({ owner: req.user._id });
  const listingIds = listings.map(listing => listing._id);

  // Find all bookings for those listings
  const bookings = await Booking.find({ listing: { $in: listingIds } })
    .populate("listing user")
    .sort({ checkIn: 1 });

  res.render("bookings/hostBookings.ejs", { bookings });
});

// Cancel a booking (guest)
router.post("/bookings/:bookingId/cancel", isLoggedIn, async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId);
  if (!booking) {
    req.flash("error", "Booking not found");
    return res.redirect("/my-bookings");
  }
  // Only the user who made the booking can cancel
  if (!booking.user.equals(req.user._id)) {
    req.flash("error", "You are not authorized to cancel this booking");
    return res.redirect("/my-bookings");
  }
  // Only allow cancellation if not already cancelled and check-in is in the future
  if (booking.status === "cancelled" || new Date(booking.checkIn) <= new Date()) {
    req.flash("error", "This booking cannot be cancelled");
    return res.redirect("/my-bookings");
  }
  booking.status = "cancelled";
  await booking.save();
  req.flash("success", "Booking cancelled successfully");
  res.redirect("/my-bookings");
});

// Delete a booking (guest)
router.post("/bookings/:bookingId/delete", isLoggedIn, async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId);
  if (!booking) {
    req.flash("error", "Booking not found");
    return res.redirect("/my-bookings");
  }
  // Only the user who made the booking can delete
  if (!booking.user.equals(req.user._id)) {
    req.flash("error", "You are not authorized to delete this booking");
    return res.redirect("/my-bookings");
  }
  // Only allow deletion if booking is cancelled or check-out is in the past
  if (booking.status !== "cancelled" && new Date(booking.checkOut) > new Date()) {
    req.flash("error", "You can only delete cancelled or completed bookings");
    return res.redirect("/my-bookings");
  }
  await booking.deleteOne();
  req.flash("success", "Booking deleted successfully");
  res.redirect("/my-bookings");
});

// Host cancels a booking for their listing
router.post("/host/bookings/:bookingId/cancel", isLoggedIn, async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId).populate("listing");
  if (!booking) {
    req.flash("error", "Booking not found");
    return res.redirect("/host/bookings");
  }
  // Only the owner of the listing can cancel
  if (!booking.listing.owner.equals(req.user._id)) {
    req.flash("error", "You are not authorized to cancel this booking");
    return res.redirect("/host/bookings");
  }
  if (booking.status === "cancelled" || new Date(booking.checkIn) <= new Date()) {
    req.flash("error", "This booking cannot be cancelled");
    return res.redirect("/host/bookings");
  }
  booking.status = "cancelled";
  await booking.save();
  req.flash("success", "Booking cancelled successfully");
  res.redirect("/host/bookings");
});

// Host deletes a booking for their listing
router.post("/host/bookings/:bookingId/delete", isLoggedIn, async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId).populate("listing");
  if (!booking) {
    req.flash("error", "Booking not found");
    return res.redirect("/host/bookings");
  }
  // Only the owner of the listing can delete
  if (!booking.listing.owner.equals(req.user._id)) {
    req.flash("error", "You are not authorized to delete this booking");
    return res.redirect("/host/bookings");
  }
  if (booking.status !== "cancelled" && new Date(booking.checkOut) > new Date()) {
    req.flash("error", "You can only delete cancelled or completed bookings");
    return res.redirect("/host/bookings");
  }
  await booking.deleteOne();
  req.flash("success", "Booking deleted successfully");
  res.redirect("/host/bookings");
});

module.exports = router;