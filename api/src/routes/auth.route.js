import express from "express";
import { checkAuth, login, logout, signup, updateProfile, getLastSeen } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import updateLastSeen from "../middleware/updateLastSeen.js";


const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);
router.get("/:userId/lastseen", protectRoute, updateLastSeen, getLastSeen);

export default router;