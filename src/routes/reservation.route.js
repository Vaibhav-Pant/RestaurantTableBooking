import { Router } from 'express';
import {
    getUserReservations,
    createReservation,
    cancelReservation
} from "../controllers/reservation.controller.js"
import { body } from 'express-validator';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/")
  .get(verifyJWT, getUserReservations) // ?userId=...
  .post([
    verifyJWT,
    body('restaurantId').notEmpty().withMessage('Restaurant ID is required'),
    body('bookingDate').notEmpty().withMessage('Booking date is required'),
    body('bookingTime').notEmpty().withMessage('Booking time is required'),
    body('numberOfGuests').isInt({ min: 1 }).withMessage('Guests must be at least 1'),
  ], createReservation);

router.route("/:reservationId")
  .delete(verifyJWT, cancelReservation); // Add auth later

export default router;
