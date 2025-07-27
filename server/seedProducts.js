import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js"; // adjust path as needed
import dummyProducts from "./assets/assets.js"; // adjust path as needed

dotenv.config();

const seedProducts = async () => {
  try {
    console.log("⚙️ Running Seeder...");
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB!");

    await Product.deleteMany();
    console.log("🧹 Cleared old products");

    await Product.insertMany(dummyProducts);
    console.log("✅ Dummy products inserted!");

    process.exit();
  } catch (error) {
    console.error("❌ Error while seeding products:", error.message);
    process.exit(1);
  }
};

seedProducts();
