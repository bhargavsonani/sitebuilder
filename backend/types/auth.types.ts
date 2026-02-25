import { Request } from "express";

export interface AuthRequest extends Request {
  userId?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
  };
}

export interface SignUpRequest {
  email: string;
  name: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user?: {
      id: string;
      email: string;
      name: string;
      emailVerified: boolean;
      credits: number;
      totalCreation: number;
    };
    session?: {
      token: string;
      expiresAt: Date;
    };
    token?: string; // For verification/reset tokens (development only)
    verificationToken?: string; // Alternative name for clarity
  };
  error?: string;
}

export interface VerifyEmailRequest {
  token: string;
  identifier: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  token: string;
  identifier: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  name: string;
}

export interface ChangePasswordAuthenticatedRequest {
  currentPassword: string;
  newPassword: string;
}
