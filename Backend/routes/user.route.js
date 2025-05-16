import express from "express";
import { 
  login, 
  logout, 
  register, 
  updateProfile, 
  sendEmailNotification, 
  addNotification, 
  markNotificationsAsRead,
  getCurrentUser,
  getCandidateById
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import multipleUpload from "../middlewares/multer.js"

const router = express.Router();

router.route("/register").post(multipleUpload,register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/update-profile").post(isAuthenticated, multipleUpload, updateProfile);

// Get current user with notifications
router.route("/me").get(isAuthenticated, getCurrentUser);

// Email and notification routes
router.route("/send-email").post(isAuthenticated, sendEmailNotification);
router.route("/add-notification").post(isAuthenticated, addNotification);
router.route("/mark-notifications-read").post(isAuthenticated, markNotificationsAsRead);

// New route to get candidate by ID
router.route("/candidate/:candidateId").get(isAuthenticated, getCandidateById);

export default router;
