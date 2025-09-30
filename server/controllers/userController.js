import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register User : /api/user/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.json({ success: false, message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true, // Prevent JavaScript to access cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Cross-site cookie support
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time (7 days)
    });
    
    // For Render subdomains, also send token in response body
    // This works around Render's subdomain cookie limitations
    return res.json({
      success: true,
      user: { email: user.email, name: user.name },
      token: token // Send token for localStorage storage
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.json({
        success: false,
        message: "Email and password are required",
      });
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.json({ success: false, message: "Invalid email or password" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true, // Prevent JavaScript to access cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Cross-site cookie support
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time (7 days)
    });
    
    // For Render subdomains, also send token in response body
    // This works around Render's subdomain cookie limitations
    return res.json({
      success: true,
      user: { email: user.email, name: user.name },
      token: token // Send token for localStorage storage
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Check Auth : /api/user/is-auth
export const isAuth = async (req, res) => {
  try {
    console.log('isAuth - Request body:', req.body);
    console.log('isAuth - Request cookies:', req.cookies);
    
    const { userId } = req.body;
    
    if (!userId) {
      console.log('isAuth - No userId in request body');
      return res.json({ success: false, message: 'No user ID provided' });
    }
    
    const user = await User.findById(userId).select("-password");
    
    if (!user) {
      console.log('isAuth - User not found');
      return res.json({ success: false, message: 'User not found' });
    }
    
    console.log('isAuth - User found:', user.email);
    return res.json({ success: true, user });
  } catch (error) {
    console.log('isAuth - Error:', error.message);
    res.json({ success: false, message: error.message });
  }
};
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      domain: process.env.NODE_ENV === "production" ? ".vercel.app" : undefined,
    });
    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
