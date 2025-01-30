import mongoose from "mongoose";
import Product from "../models/product.js";
import products from "./data.js";
import User from "../models/user.js";

const seedProducts = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/The-Wellness-Pantry");
    await Product.deleteMany();
    console.log("Products are deleted");

    // ดึง user จากฐานข้อมูล (สมมติว่าใช้ user คนแรกในฐานข้อมูล)
    const adminUser = await User.findOne(); // ตรวจสอบว่ามี user หรือไม่
    if (!adminUser) {
      console.log("No user found in the database!");
      process.exit(1);
    }
    // เติมค่า user ให้กับสินค้าแต่ละตัว
    const productsWithUser = products.map((product) => ({
      ...product,
      user: adminUser._id, // เพิ่ม user._id ในสินค้าแต่ละตัว
    }));

    await Product.insertMany(productsWithUser);
    console.log("Products are added");

    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

seedProducts();
