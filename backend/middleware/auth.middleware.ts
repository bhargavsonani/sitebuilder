import { Request,Response, NextFunction } from "express";
import { AuthRequest } from "../types/auth.types.js";
import { getSessionByToken, getUserById } from "../services/auth.service.js";

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header or cookie
    const authHeader = req.headers.authorization;
    // Try multiple cookie names and locations
    const cookieToken = req.cookies?.auth_session || 
                        req.cookies?.session_token ||
                        req.cookies?.auth_session_token;
    
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : cookieToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
        error: "No token provided",
      });
    }

    // Get session by token
    const session = await getSessionByToken(token);
    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired session",
        error: "Session not found or expired",
      });
    }

    // Get user
    const user = await getUserById(session.userId.toString());
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
        error: "User associated with session not found",
      });
    }

    // Attach user info to request
    req.userId = user._id.toString();
    req.user = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
      error: "Internal server error",
    });
  }
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      authHeader?.startsWith("Bearer ")
        ? authHeader.substring(7)
        : req.cookies?.auth_session || req.cookies?.session_token;

    if (token) {
      const session = await getSessionByToken(token);
      if (session) {
        const user = await getUserById(session.userId.toString());
        if (user) {
          req.userId = user._id.toString();
          req.user = {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            emailVerified: user.emailVerified,
          };
        }
      }
    }

    next();
  } catch (error) {
    // Continue even if authentication fails
    next();
  }
};

export const protect = async (req:Request, res:Response, next:NextFunction) => {

  try {
    const session = await getSessionByToken(req.cookies.auth_session || req.cookies.session_token);
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const user = await getUserById(session.userId.toString());
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    next();
  } catch (error) {
    console.error("Error protecting route:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

