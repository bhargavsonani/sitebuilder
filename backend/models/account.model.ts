import mongoose, { Schema, Document } from "mongoose";

export interface IAccount extends Document {
  accountId: string;
  providerId: string;
  userId: mongoose.Types.ObjectId;
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  scope?: string;
  password?: string;
}

const AccountSchema = new Schema<IAccount>(
  {
    accountId: { type: String, required: true },
    providerId: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    accessToken: String,
    refreshToken: String,
    idToken: String,
    scope: String,
    password: String,
  },
  { timestamps: true }
);

AccountSchema.index({ userId: 1 });

export default mongoose.model<IAccount>("Account", AccountSchema);
