import express from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);

// 🔍 Temporary debug route to check cookies from client
router.get("/check-cookie", (req, res) => {
  console.log("Cookies from client:", req.cookies);
  if (req.cookies.jwt) {
    res.json({ message: "JWT cookie found. Authenticated." });
  } else {
    res.status(401).json({ message: "JWT cookie not found. Unauthorized." });
  }
});

export default router;