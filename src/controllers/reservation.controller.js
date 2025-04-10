import {validationResult} from "express-validator"
import {Restaurant} from "../models/restaurant.model.js"
import {Reservation} from "../models/reservation.model.js"
import {User} from "../models/user.model.js"
import notificationQueue from "../queue/notificationQueue.js"
import mongoose, { isValidObjectId } from "mongoose";



// POST /api/reserve
const createReservation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  let { restaurantId, bookingDate, bookingTime, numberOfGuests } = req.body;
  const userId = req.user._id;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Convert bookingDate string to Date object
    const parsedBookingDate = new Date(bookingDate);

    const restaurant = await Restaurant.findById(restaurantId).session(session);
    if (!restaurant) {
      await session.abortTransaction();
      return res.status(404).json({ msg: 'Restaurant not found' });
    }

    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ msg: 'User not found' });
    }

    // Find existing reservations with matching date & time
    const existingReservations = await Reservation.find({
      restaurant: restaurantId,
      date: parsedBookingDate,
      time: bookingTime,
      status: 'Booked',
    }).session(session);

    const bookedSeats = existingReservations.reduce((total, r) => total + r.guests, 0);
    const seatsLeft = restaurant.totalCapacity - bookedSeats;

    if (numberOfGuests > seatsLeft) {
      await session.abortTransaction();
      return res.status(400).json({
        msg: `Only ${seatsLeft} seats available at this time`,
      });
    }

    // Save the reservation
    const reservation = new Reservation({
      user: userId,
      restaurant: restaurantId,
      date: parsedBookingDate,
      time: bookingTime,
      guests: numberOfGuests,
      status: "Booked"
    });

    await reservation.save({ session });

    await session.commitTransaction();
    session.endSession();

    // Send async email (outside transaction), Push into Queue
    await notificationQueue.add('send-email', {
      to: user.email,
      subject: 'Reservation Confirmed',
      body: `Hi ${user.username}, your reservation at ${restaurant.name} on ${bookingDate} at ${bookingTime} is confirmed for ${numberOfGuests} guests.`,
    });

    // UPDATE: Remove this later, i am pushing the 
    // request in Queue, Worker will take the Request and send EMAIL.
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: user.email,
      subject:'Reservation Confirmed',
      html: `<p>Hi ${user.username}, your reservation at ${restaurant.name} on ${bookingDate} at ${bookingTime} is confirmed for ${numberOfGuests} guests.</p>`,    });

    res.status(201).json({
      msg: 'Reservation confirmed',
      reservation,
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// GET /api/reserve?userId=...
const getUserReservations = async (req, res) => {
  const userId = req.user?._id;

  if (!isValidObjectId(userId)) {
    return res
    .status(400)
    .json("Invalid UserID.");
  } 

  if (!userId) return res.status(400).json({ msg: "User ID is required" });

  try {
    const reservations = await Reservation.find({ user: userId }).populate('restaurant');
    res.json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// DELETE /api/reserve/:reservationId
const cancelReservation = async (req, res) => {
  const { reservationId } = req.params;

  try {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) return res.status(404).json({ msg: "Reservation not found" });

    // Already cancelled?
    if (reservation.status === 'cancelled') {
      return res.status(400).json({ msg: "Reservation already cancelled" });
    }

    // Mark as cancelled
    reservation.status = 'cancelled';
    await reservation.save();

    res.json({ msg: "Reservation cancelled successfully", reservation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


export {
  createReservation,
  getUserReservations,
  cancelReservation,
};
