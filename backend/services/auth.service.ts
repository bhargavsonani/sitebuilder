import bcrypt from "bcryptjs";
import crypto from "crypto";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import Account from "../models/account.model.js";
import Session from "../models/session.model.js";
import Verification from "../models/verification.model.js";

// Password hashing
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Password verification
export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// Generate session token
const generateSessionToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

// Generate verification token
const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

// Create user account
export const createUser = async (
  email: string,
  name: string,
  password: string
) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Create user
  const user = new User({
    email,
    name,
    totalCreation: 0,
    credits: 20,
    emailVerified: false,
  });
  await user.save();

  // Create account with hashed password
  const hashedPassword = await hashPassword(password);
  const account = new Account({
    accountId: user._id.toString(),
    providerId: "credential",
    userId: user._id,
    password: hashedPassword,
  });
  await account.save();

  return user;
};

// Authenticate user
export const authenticateUser = async (email: string, password: string) => {
  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Find account
  const account = await Account.findOne({
    userId: user._id,
    providerId: "credential",
  });
  if (!account || !account.password) {
    throw new Error("Invalid email or password");
  }

  // Verify password
  const isValidPassword = await verifyPassword(password, account.password);
  if (!isValidPassword) {
    throw new Error("Invalid email or password");
  }

  return user;
};

// Create session
export const createSession = async (
  userId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  const token = generateSessionToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

  // Convert userId string to ObjectId
  const userIdObjectId = new mongoose.Types.ObjectId(userId);

  const session = new Session({
    token,
    userId: userIdObjectId,
    expiresAt,
    ipAddress,
    userAgent,
  });
  await session.save();

  return { token, expiresAt };
};

// Get session by token
export const getSessionByToken = async (token: string) => {
  const session = await Session.findOne({ token }).exec();

  if (!session) {
    return null;
  }

  // Check if session is expired
  if (new Date() > session.expiresAt) {
    await Session.deleteOne({ _id: session._id });
    return null;
  }

  return session;
};

// Delete session
export const deleteSession = async (token: string) => {
  await Session.deleteOne({ token });
};

// Delete all user sessions
export const deleteAllUserSessions = async (userId: string) => {
  const userIdObjectId = new mongoose.Types.ObjectId(userId);
  await Session.deleteMany({ userId: userIdObjectId });
};

// Create verification token
export const createVerificationToken = async (
  identifier: string,
  expiresInHours: number = 24
) => {
  const value = generateVerificationToken();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expiresInHours);

  // Delete existing verification tokens for this identifier
  await Verification.deleteMany({ identifier });

  const verification = new Verification({
    identifier,
    value,
    expiresAt,
  });
  await verification.save();

  return value;
};

// Verify token
export const verifyToken = async (identifier: string, value: string) => {
  const verification = await Verification.findOne({ identifier, value });

  if (!verification) {
    throw new Error("Invalid verification token");
  }

  // Check if token is expired
  if (new Date() > verification.expiresAt) {
    await Verification.deleteOne({ _id: verification._id });
    throw new Error("Verification token has expired");
  }

  // Delete verification token after use
  await Verification.deleteOne({ _id: verification._id });

  return true;
};

// Verify user email
export const verifyUserEmail = async (userId: string) => {
  const userIdObjectId = new mongoose.Types.ObjectId(userId);
  await User.findByIdAndUpdate(userIdObjectId, { emailVerified: true });
};

// Update password
export const updatePassword = async (userId: string, newPassword: string) => {
  const hashedPassword = await hashPassword(newPassword);
  const userIdObjectId = new mongoose.Types.ObjectId(userId);
  await Account.findOneAndUpdate(
    { userId: userIdObjectId, providerId: "credential" },
    { password: hashedPassword }
  );
};

// Update user profile (currently only name)
export const updateUserProfile = async (userId: string, name: string) => {
  const userIdObjectId = new mongoose.Types.ObjectId(userId);
  const user = await User.findByIdAndUpdate(
    userIdObjectId,
    { name },
    { new: true }
  );
  return user;
};

// Change password for authenticated user
export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const userIdObjectId = new mongoose.Types.ObjectId(userId);

  const account = await Account.findOne({
    userId: userIdObjectId,
    providerId: "credential",
  });

  if (!account || !account.password) {
    throw new Error("Account not found for this user");
  }

  const isValid = await verifyPassword(currentPassword, account.password);

  if (!isValid) {
    throw new Error("Current password is incorrect");
  }

  await updatePassword(userId, newPassword);
};

// Get user by email
export const getUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

// Get user by ID
export const getUserById = async (userId: string) => {
  return await User.findById(userId);
};



// Delete user account completely
export const deleteUserAccount = async (userId: string) => {
  const userIdObjectId = new mongoose.Types.ObjectId(userId);

  // Delete all sessions
  await Session.deleteMany({ userId: userIdObjectId });

  // Delete verification tokens
  await Verification.deleteMany({ identifier: userId });

  // Delete account credentials
  await Account.deleteMany({ userId: userIdObjectId });

  // Delete user
  const user = await User.findByIdAndDelete(userIdObjectId);

  return user;
};

