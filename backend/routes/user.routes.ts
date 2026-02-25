// import { Router } from "express";
// import {
//   getUserProject,
//   getUserProjects,
//   togglePubish,
//   PurchasedCredit,
//   getUserCredits,
//   createUserProject,
// } from "../controllers/user.controller.js";
// import { authenticate } from "../middleware/auth.middleware.js";

// const userRouter = Router();

// // Test route to verify router is working
// userRouter.get("/test", (req, res) => {
//   res.json({ success: true, message: "User router is working" });
// });

// // Get user credits (protected)
// userRouter.get("/credits", authenticate, getUserCredits);

// // Create a new project (protected) - must be before /project/:projectId
// userRouter.post("/project", authenticate, createUserProject);

// // Get a specific user project by projectId (protected)
// userRouter.get("/project/:projectId", authenticate, getUserProject);

// // Get all projects for the authenticated user (protected)
// userRouter.get("/projects", authenticate, getUserProjects);

// // Toggle publish status for a project (protected)
// userRouter.post("/publish-toggle/:projectId", authenticate, togglePubish);

// // Purchase credits (protected)
// userRouter.post("/purchase-credits", authenticate, PurchasedCredit);

// export default userRouter;


import { Router } from "express";
import {
  getUserProject,
  getUserProjects,
  togglePubish,
  PurchasedCredit,
  getUserCredits,
  createUserProject,
} from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const userRouter = Router();

/**
 * Test route
 */
userRouter.get("/test", (_req, res) => {
  res.json({
    success: true,
    message: "User router is working",
  });
});

/**
 * Get user credits (protected)
 */
userRouter.get("/credits", authenticate, getUserCredits);

/**
 * Create a new project (protected)
 */
userRouter.post("/project", authenticate, createUserProject);

/**
 * Get a specific user project by projectId (protected)
 */
userRouter.get("/project/:projectId", authenticate, getUserProject);

/**
 * Get all projects for the authenticated user (protected)
 */
userRouter.get("/projects", authenticate, getUserProjects);

/**
 * Toggle publish/unpublish project (protected)
 */
userRouter.post(
  "/publish-toggle/:projectId",
  authenticate,
  togglePubish
);

/**
 * Purchase credits (protected)
 */
userRouter.post(
  "/purchase-credits",
  authenticate,
  PurchasedCredit
);

export default userRouter;