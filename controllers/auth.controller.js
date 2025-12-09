const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

class AuthController {
  async login(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Provide username & password" });
    }

    const admin = await Admin.findOne({ username }).select("+password");
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    res.json({
      success: true,
      message: "Login successful",
      data: { token: signToken(admin._id), admin: { id: admin._id, username: admin.username, role: admin.role } },
    });
  }

  // Remove in production after first admin created!
  async register(req, res) {
    const { username, password } = req.body;
    const exists = await Admin.findOne({ username });
    if (exists) return res.status(400).json({ success: false, message: "Admin exists" });

    const admin = await Admin.create({ username, password });
    res.status(201).json({ success: true, message: "Admin created", data: { username: admin.username } });
  }
}

module.exports = new AuthController();