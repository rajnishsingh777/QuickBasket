// server.js
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebhooks } from './controllers/orderController.js';

const app = express();

// ✅ connect services before starting server
await connectDB();
await connectCloudinary();

app.use(express.json());
app.use(cookieParser());

// ✅ Allow frontend on Vercel
app.use(cors({
  origin: [
    "http://localhost:5173",  // local dev
    "https://quick-basket-cyan.vercel.app", // Vercel frontend
    "https://quickbasket-1-097t.onrender.com" // Render frontend
  ],
  credentials: true
}));

// ✅ Stripe webhook needs raw body
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// ✅ Routers
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

// Health check
app.get('/', (req, res) => res.send("✅ API is Working and DB connected"));

export default app;
