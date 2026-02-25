import { Router } from "express";
import {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  sendVerificationEmail,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  updateProfile,
  changePasswordAuthenticated,
  deleteAccount
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";


const router = Router();

// Public routes
router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);
router.post("/verify-email", verifyEmail);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

// Protected routes
router.get("/me", authenticate, getCurrentUser);
router.put("/me", authenticate, updateProfile);
router.post(
  "/change-password",
  authenticate,
  changePasswordAuthenticated
);
router.post("/send-verification-email", authenticate, sendVerificationEmail);
router.delete("/delete-account", authenticate, deleteAccount);

export default router;
