// import mongoose, { Schema, Document } from "mongoose";

// export interface IUser extends Document {
//   email: string;
//   name: string;
//   totalCreation: number;
//   credits: number;
//   emailVerified: boolean;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const UserSchema = new Schema<IUser>(
//   {
//     email: { type: String, required: true },
//     name: { type: String, required: true },
//     totalCreation: { type: Number, default: 0 },
//     credits: { type: Number, default: 20 },
//     emailVerified: { type: Boolean, default: false },
//   },
//   { timestamps: true }
// );

// export default mongoose.model<IUser>("User", UserSchema);


import { Schema, model, Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  name: string;
  totalCreation: number;
  credits: number;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    totalCreation: { type: Number, default: 0 },
    credits: { type: Number, default: 20 },
    emailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<IUser>("User", UserSchema);