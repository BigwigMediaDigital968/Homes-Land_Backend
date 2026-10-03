const jwt = require("jsonwebtoken");

// Single admin, credentials live in .env (no DB user)
const login = (req, res) => {
  try {
    const { ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET } = process.env;
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !JWT_SECRET) {
      console.error("Admin login: ADMIN_EMAIL, ADMIN_PASSWORD or JWT_SECRET missing in .env");
      return res.status(500).json({ message: "Login is not configured on the server" });
    }

    // req.body is undefined when the request has no JSON body
    const { email, password } = req.body || {};
    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase() || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ email: ADMIN_EMAIL }, JWT_SECRET, { expiresIn: "1d" });
    return res.status(200).json({ token });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

module.exports = { login };
