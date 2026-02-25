import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { createRequire } from "module";
import { connectDB } from "./db/mongodb.js";
import authRoutes from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import projectRouter from "./routes/project.routes.js";

const require = createRequire(import.meta.url);
const cookieParser = require("cookie-parser");

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

const port = process.env.PORT || 3000;

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Server is Live!");
});

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true, message: "Backend is up" });
});

// Debug middleware to log all API requests
app.use("/api", (req: Request, res: Response, next: NextFunction) => {
  console.log(`[API REQUEST] ${req.method} ${req.originalUrl}`);
  next();
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRouter);
app.use("/api/project", projectRouter);

// Direct test route to verify Express is working
app.post("/api/user/project-test", (req: Request, res: Response) => {
  console.log("[TEST ROUTE] POST /api/user/project-test hit");
  res.json({ success: true, message: "Direct route works", body: req.body });
});

// 404 for unmatched API routes (must be last)
app.use("/api", (req: Request, res: Response) => {
  console.warn("[404]", req.method, req.originalUrl);
  res.status(404).json({ 
    success: false, 
    message: "API route not found", 
    path: req.originalUrl 
  });
});

// MongoDB Connection
// Start Server only after DB connects
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Server is running at http://localhost:${port}`);
      console.log('\n📋 Registered API Routes:');
      console.log('  POST   /api/user/project');
      console.log('  GET    /api/user/project/:projectId');
      console.log('  GET    /api/user/projects');
      console.log('  GET    /api/user/credits');
      console.log('  POST   /api/user/publish-toggle/:projectId');
      console.log('  POST   /api/user/purchase-credits');
    });
  })
  .catch((error) => {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  });
