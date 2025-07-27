import express from 'express';
import authUser from '../middlewares/authUser.js';
import authSeller from '../middlewares/authSeller.js';
import {
  getAllOrders,
  getUserOrders,
  placeOrderCOD,
  placeOrderStripe,
} from '../controllers/orderController.js';

const orderRouter = express.Router();

// Buyer: Place a COD order
  orderRouter.post('/cod', authUser, placeOrderCOD);

// Buyer: Get user's orders (use POST so body can carry userId)
orderRouter.post('/user', authUser, getUserOrders);

// Seller: Get all orders
orderRouter.get('/seller', authSeller, getAllOrders);
orderRouter.post('/stripe', authUser, placeOrderStripe);

export default orderRouter;
