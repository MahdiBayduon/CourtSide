const router = require('express').Router();
const Reservation = require('../models/Reservation');
const Field = require('../models/Field');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get all reservations (admin only)
router.get('/', [auth, admin], async (req, res) => {
  try {
    const reservations = await Reservation.find().populate('user', 'name').populate('field', 'name type');
    res.json(reservations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get reservations for the logged-in user
router.get('/my-reservations', auth, async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id }).populate('field', 'name type');
    res.json(reservations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create a new reservation
router.post('/', auth, async (req, res) => {
  try {
    const { fieldId, startTime, endTime } = req.body;
    const userId = req.user.id;

    const field = await Field.findById(fieldId);
    if (!field) {
      return res.status(404).json({ msg: 'Field not found' });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    // Check for overlapping reservations
    const overlapping = await Reservation.findOne({
      field: fieldId,
      $or: [
        { startTime: { $lt: end, $gte: start } },
        { endTime: { $gt: start, $lte: end } },
      ],
    });

    if (overlapping) {
      return res.status(400).json({ msg: 'Field is already booked for this time' });
    }

    if (start >= end) {
      return res.status(400).json({ msg: 'End time must be after start time' });
    }

    const durationInHours = (end - start) / (1000 * 60 * 60);
    const totalPrice = durationInHours * field.pricePerHour;

    const newReservation = new Reservation({
      user: userId,
      field: fieldId,
      startTime: start,
      endTime: end,
      totalPrice,
    });

    const reservation = await newReservation.save();
    res.json(reservation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Cancel a reservation
router.delete('/:id', auth, async (req, res) => {
  try {
    let reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ msg: 'Reservation not found' });
    }

    // Check if the user owns the reservation or is an admin
    if (reservation.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await reservation.remove();
    res.json({ msg: 'Reservation cancelled' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;