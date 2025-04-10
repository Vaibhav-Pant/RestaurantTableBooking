import {validationResult} from "express-validator"
import {Restaurant} from "../models/restaurant.model.js"

// GET /api/restaurants
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// POST /api/restaurants
const addRestaurant = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, location, cuisine, totalCapacity } = req.body;

  try {
    const newRestaurant = new Restaurant({
      name,
      location,
      cuisine,
      totalCapacity,
      availableSeats: totalCapacity,
    });

    await newRestaurant.save();
    res.status(201).json(newRestaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export {
  getAllRestaurants,
  addRestaurant,
};
