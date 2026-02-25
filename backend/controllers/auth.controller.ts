import { Request, Response } from "express";
import {
  createUser,
  authenticateUser,
  createSession,
  deleteSession,
  deleteAllUserSessions,
  createVerificationToken,
  verifyToken,
  verifyUserEmail,
  updatePassword,
  getUserByEmail,
  updateUserProfile,
  changePassword,
  verifyPassword,
} from "../services/auth.service.js";
import {
  AuthRequest,
  SignUpRequest,
  SignInRequest,
  AuthResponse,
  VerifyEmailRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
  ChangePasswordAuthenticatedRequest,
} from "../types/auth.types.js";

import { deleteUserAccount } from "../services/auth.service.js";
import Account from "../models/account.model.js";

// Delete account (authenticated)
export const deleteAccount = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
        error: "User ID not found",
      });
    }

    const { password } = req.body as { password: string };

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required to delete account",
        error: "Missing password",
      });
    }

    // Verify password before deleting
    const user = await getUserByEmail(req.user?.email || "");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: "User does not exist",
      });
    }

    // Verify password
    const account = await Account.findOne({
      userId: user._id,
      providerId: "credential",
    });

    if (!account || !account.password) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
        error: "Account credentials not found",
      });
    }

    const isValidPassword = await verifyPassword(password, account.password);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
        error: "Password is incorrect",
      });
    }

    // Delete the account
    await deleteUserAccount(req.userId);

    // Clear auth cookie
    res.clearCookie("auth_session", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete account error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete account",
      error: error.message || "Unknown error",
    });
  }
};

// Sign up
export const signUp = async (
  req: Request<{}, AuthResponse, SignUpRequest>,
  res: Response<AuthResponse>
) => {
  try {
    const { email, name, password } = req.body;

    // Validation
    if (!email || !name || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
        error: "Missing required fields",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
        error: "Invalid password",
      });
    }

    // Create user
    const user = await createUser(email, name, password);

    // Create verification token
    const verificationToken = await createVerificationToken(
      user._id.toString()
    );

    // Create session
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const { token, expiresAt } = await createSession(
      user._id.toString(),
      ipAddress,
      userAgent
    );

    // Set session cookie
    res.cookie("auth_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      expires: expiresAt,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
          credits: user.credits,
          totalCreation: user.totalCreation,
        },
        session: {
          token,
          expiresAt,
        },
      },
    });
  } catch (error: any) {
    console.error("Sign up error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create user",
      error: error.message || "Unknown error",
    });
  }
};

// Sign in
export const signIn = async (
  req: Request<{}, AuthResponse, SignInRequest>,
  res: Response<AuthResponse>
) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
        error: "Missing required fields",
      });
    }

    // Authenticate user
    const user = await authenticateUser(email, password);

    // Create session
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const { token, expiresAt } = await createSession(
      user._id.toString(),
      ipAddress,
      userAgent
    );

    // Set session cookie
    res.cookie("auth_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      expires: expiresAt,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    });

    return res.status(200).json({
      success: true,
      message: "Signed in successfully",
      data: {
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
          credits: user.credits,
          totalCreation: user.totalCreation,
        },
        session: {
          token,
          expiresAt,
        },
      },
    });
  } catch (error: any) {
    console.error("Sign in error:", error);
    return res.status(401).json({
      success: false,
      message: error.message || "Invalid credentials",
      error: error.message || "Authentication failed",
    });
  }
};

// Sign out
export const signOut = async (req: AuthRequest, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      authHeader?.startsWith("Bearer ")
        ? authHeader.substring(7)
        : req.cookies?.auth_session || req.cookies?.session_token;

    if (token) {
      await deleteSession(token);
    }

    // Clear cookie
    res.clearCookie("auth_session", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Signed out successfully",
    });
  } catch (error: any) {
    console.error("Sign out error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to sign out",
      error: error.message || "Unknown error",
    });
  }
};

// Get current user
export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
        error: "User not found in request",
      });
    }

    const user = await getUserByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: "User does not exist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: {
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
          credits: user.credits,
          totalCreation: user.totalCreation,
        },
      },
    });
  } catch (error: any) {
    console.error("Get current user error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get user",
      error: error.message || "Unknown error",
    });
  }
};

// Send verification email
export const sendVerificationEmail = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
        error: "User ID not found",
      });
    }

    const verificationToken = await createVerificationToken(req.userId);

    // TODO: Send email with verification token
    // For now, just return the token (in production, send via email)
    return res.status(200).json({
      success: true,
      message: "Verification email sent",
      data: {
        // In production, don't return the token
        token: verificationToken,
      },
    } as AuthResponse);
  } catch (error: any) {
    console.error("Send verification email error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send verification email",
      error: error.message || "Unknown error",
    });
  }
};

// Verify email
export const verifyEmail = async (
  req: Request<{}, AuthResponse, VerifyEmailRequest>,
  res: Response<AuthResponse>
) => {
  try {
    const { token, identifier } = req.body;

    if (!token || !identifier) {
      return res.status(400).json({
        success: false,
        message: "Token and identifier are required",
        error: "Missing required fields",
      });
    }

    // Verify token
    await verifyToken(identifier, token);

    // Verify user email
    await verifyUserEmail(identifier);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error: any) {
    console.error("Verify email error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to verify email",
      error: error.message || "Unknown error",
    });
  }
};

// Request password reset
export const requestPasswordReset = async (
  req: Request<{}, AuthResponse, ResetPasswordRequest>,
  res: Response<AuthResponse>
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
        error: "Missing email",
      });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      // Don't reveal if user exists or not
      return res.status(200).json({
        success: true,
        message: "If the email exists, a password reset link has been sent",
      });
    }

    const verificationToken = await createVerificationToken(
      user._id.toString(),
      1
    ); // 1 hour expiry

    // TODO: Send email with reset token
    // For now, just return success
    return res.status(200).json({
      success: true,
      message: "If the email exists, a password reset link has been sent",
      data: {
        // In production, don't return the token
        token: verificationToken,
      },
    } as AuthResponse);
  } catch (error: any) {
    console.error("Request password reset error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process password reset request",
      error: error.message || "Unknown error",
    });
  }
};

// Reset password
export const resetPassword = async (
  req: Request<{}, AuthResponse, ChangePasswordRequest>,
  res: Response<AuthResponse>
) => {
  try {
    const { token, identifier, newPassword } = req.body;

    if (!token || !identifier || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token, identifier, and new password are required",
        error: "Missing required fields",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
        error: "Invalid password",
      });
    }

    // Verify token
    await verifyToken(identifier, token);

    // Update password
    await updatePassword(identifier, newPassword);

    // Delete all user sessions for security
    await deleteAllUserSessions(identifier);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error: any) {
    console.error("Reset password error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to reset password",
      error: error.message || "Unknown error",
    });
  }
};

// Update profile (authenticated)
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
        error: "User ID not found",
      });
    }

    const { name } = req.body as UpdateProfileRequest;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
        error: "Missing name",
      });
    }

    const user = await updateUserProfile(req.userId, name.trim());

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: "User does not exist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
          credits: user.credits,
          totalCreation: user.totalCreation,
        },
      },
    });
  } catch (error: any) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message || "Unknown error",
    });
  }
};

// Change password (authenticated)
export const changePasswordAuthenticated = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
        error: "User ID not found",
      });
    }

    const { currentPassword, newPassword } =
      req.body as ChangePasswordAuthenticatedRequest;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
        error: "Missing required fields",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
        error: "Invalid password",
      });
    }

    await changePassword(req.userId, currentPassword, newPassword);

    // Delete all user sessions for security (including current one)
    await deleteAllUserSessions(req.userId);

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error: any) {
    console.error("Change password error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to change password",
      error: error.message || "Unknown error",
    });
  }
};
