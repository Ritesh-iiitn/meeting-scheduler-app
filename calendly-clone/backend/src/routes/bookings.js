const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Admin routes
router.get('/bookings', bookingController.getAllBookings);
router.get('/bookings/upcoming', bookingController.getUpcomingBookings);
router.get('/bookings/past', bookingController.getPastBookings);

// Public routes
router.post('/bookings', bookingController.createBooking);
router.patch('/bookings/:id/cancel', bookingController.cancelBooking);
router.get('/slots/:eventSlug/:date', bookingController.getAvailableSlots);

module.exports = router;
