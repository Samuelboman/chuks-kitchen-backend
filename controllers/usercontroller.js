import User from '../models/User.js';

export const signup = async (req, res) => {
  try {
    const { email, phone, referralCode } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ message: "Email or phone required" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = "1234";

    const user = await User.create({
      email,
      phone,
      referralCode,
      otp,
    });

    res.status(201).json({
      message: "User created. Verify OTP.",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};