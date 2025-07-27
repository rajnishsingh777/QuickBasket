import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Stripe from "stripe";
import User from "../models/User.js";

// ✅ Place Order - COD
export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    amount += Math.floor(amount * 0.02); // Tax or charge

    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
    });

    return res.json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    console.error("Error placing COD order:", error);
    return res.json({ success: false, message: error.message });
  }
};

// ✅ Place Order - Stripe
export const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    const origin = req.headers.origin;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    const productData = [];

    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    amount += Math.floor(amount * 0.02); // Tax or charge

    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
    });

    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = productData.map((item) => ({
      price_data: {
        currency: "INR",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.floor((item.price + item.price * 0.02) * 100), // in cents
      },
      quantity: item.quantity,
    }));

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    return res.json({ success: true, url: session.url });
  } catch (error) {
    console.error("Error placing Stripe order:", error);
    return res.json({ success: false, message: error.message });
  }
};
import Stripe from 'stripe';

export const stripeWebhooks = async (request, response) => {
  // Stripe Gateway Initialize
  const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = request.headers['stripe-signature'];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return response.status(400).send(`Webhook Error: ${error.message}`);
  }

  // You can handle the event here (e.g. payment_intent.succeeded)
  switch (event.type) {
  case "payment_intent.succeeded": {
    const paymentIntent = event.data.object;
    const paymentIntentId = paymentIntent.id;

    // Getting Session Metadata
    const sessionList = await stripeInstance.checkout.sessions.list({
      payment_intent: paymentIntentId,
    });

    const session = sessionList.data[0];
    const { orderId, userId } = session.metadata;

    // Mark Payment as Paid
    await Order.findByIdAndUpdate(orderId, { isPaid: true });

    // Clear user cart
    await User.findByIdAndUpdate(userId, { cartItems: {} });

    break;
  }

  // You can add more cases for other Stripe events if needed
  case "payment_intent.payment_failed": {
  const paymentIntent = event.data.object;
  const paymentIntentId = paymentIntent.id;

  // Getting Session Metadata
  const sessionList = await stripeInstance.checkout.sessions.list({
    payment_intent: paymentIntentId,
  });

  const session = sessionList.data[0];
  const { orderId } = session.metadata;

  // Delete the order since payment failed
  await Order.findByIdAndDelete(orderId);

  break;
}


  default:
    console.log(`Unhandled event type: ${event.type}`);
}
response.json({recieved:true});

};


// ✅ Get User Orders
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get All Orders (Admin/Seller)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.json({ success: false, message: error.message });
  }
};
