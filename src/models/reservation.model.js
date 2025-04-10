import mongoose, {Schema} from "mongoose";

const reservationSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  date: {
    type: Date, // "YYYY-MM-DD"
    required: true,
  },
  time: {
    type: String, // "HH:MM"
    required: true,
  },
  guests: {
    type: Number,
    required: true, 
  },
  status: {
    type: String,
    enum: ['Booked', 'Cancelled'],
    default: 'Booked',
  },
}, { timestamps: true });

export const Reservation = mongoose.model('Reservation', reservationSchema);
