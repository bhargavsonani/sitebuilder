// import { Router } from "express";
// import {
//   makeRevision,
//   rollbackToVersion,
//   deleteProject,
//   getProjectPreview,
//   getPublishedProject,
//   getProjectById,
//   saveProjectCode
// } from "../controllers/project.controller.js";
// import { authenticate } from "../middleware/auth.middleware.js";

// const projectRouter = Router();

// // Make a revision to a project (protected)
// projectRouter.post("/revision/:projectId", authenticate, makeRevision);

// // Rollback to a specific version of a project (protected)
// projectRouter.get("/rollback/:projectId/:versionId", authenticate, rollbackToVersion);

// // Delete a project (protected)
// projectRouter.delete("/:projectId", authenticate, deleteProject);

// // Get project preview (protected)
// projectRouter.get("/preview/:projectId", authenticate, getProjectPreview);

// // Get published projects (public)
// projectRouter.get("/published", getPublishedProject);

// // Get a project by ID and get its code (public view, only published and with code)
// projectRouter.get("/published/:projectId", getProjectById);

// // Save/update project code manually (protected)
// projectRouter.put("/save/:projectId", authenticate, saveProjectCode);

// export default projectRouter;

import { Router } from "express";
import {
  makeRevision,
  rollbackToVersion,
  deleteProject,
  getProjectPreview,
  getPublishedProject,
  getProjectById,
  saveProjectCode,
} from "../controllers/project.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const projectRouter = Router();

/**
 * Make a revision to a project (protected)
 */
projectRouter.post("/revision/:projectId", authenticate, makeRevision);

/**
 * Rollback to a specific version of a project (protected)
 */
projectRouter.get(
  "/rollback/:projectId/:versionId",
  authenticate,
  rollbackToVersion
);

/**
 * Delete a project (protected)
 */
projectRouter.delete("/:projectId", authenticate, deleteProject);

/**
 * Get project preview (protected)
 */
projectRouter.get("/preview/:projectId", authenticate, getProjectPreview);

/**
 * Get all published projects (public)
 */
projectRouter.get("/published", getPublishedProject);

/**
 * Get a published project by ID (public)
 */
projectRouter.get("/published/:projectId", getProjectById);

/**
 * Save/update project code manually (protected)
 */
projectRouter.put("/save/:projectId", authenticate, saveProjectCode);

export default projectRouter;