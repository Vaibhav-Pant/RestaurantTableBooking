import { Router } from 'express';
import {
    getAllRestaurants,
    addRestaurant
} from "../controllers/restaurant.controller.js"
import { body } from 'express-validator';


const router = Router();


router.route("/")
  .get(getAllRestaurants)
  .post([
    body('name').notEmpty().withMessage('Name is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('cuisine').notEmpty().withMessage('Cuisine is required'),
    body('totalCapacity').isInt({ min: 1 }).withMessage('Total capacity must be a positive integer')
  ],addRestaurant);

export default router;