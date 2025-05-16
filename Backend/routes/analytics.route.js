import { Router } from "express";
import { getRecruiterAnalytics, trackJobView, trackApplyClick, getTotalActiveJobs } from "../controllers/analytics.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(isAuthenticated);

// Analytics routes
router.get("/recruiter", getRecruiterAnalytics);
router.get("/jobs/active/count", getTotalActiveJobs);
router.post("/job/:jobId/view", trackJobView);
router.post("/job/:jobId/apply-click", trackApplyClick);

export default router;
