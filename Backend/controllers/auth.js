const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

/**
 * @desc  Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
const signUp = async (req, res) => {
  const { fullName, email, password, phone, address } = req.body;

  if (!fullName || !email || !password || !phone) {
    return res.status(400).json({
      success: false,
      message: "Please provide fullName, email, phone, and password",
    });
  }

  try {
    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "An account with this email or phone already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
      address: address || "",
      role: "user",
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully. Please log in.",
    });
  } catch (error) {
    console.error("signUp error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @desc  Authenticate user and return JWT
 * @route POST /api/auth/login
 * @access Public
 */
const login = async (req, res) => {
  const { loginId, password } = req.body;

  if (!loginId || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide your email/phone and password",
    });
  }

  try {
    const user = await User.findOne({
      $or: [{ email: loginId }, { phone: loginId }],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/phone or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/phone or password",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Never send the hashed password to the client
    const safeUser = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
    };

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error("login error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { signUp, login };