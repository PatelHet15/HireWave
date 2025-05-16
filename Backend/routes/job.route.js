import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { 
  getAdminJobs, 
  getAllJobs, 
  getJobById, 
  postJob, 
  updateJob,
  updateCandidateStatus // Add this new import
} from "../controllers/job.controller.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get(isAuthenticated, getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get(isAuthenticated, getJobById);
router.route("/update/:id").put(isAuthenticated, updateJob);

// Add the new route for updating candidate status
router.route("/:jobId/candidates/:candidateId/update-status").post(isAuthenticated, updateCandidateStatus);

export default router;
