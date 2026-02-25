import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  isPaid: boolean;
  planId: string;
  amount: number;
  credits: number;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    isPaid: { type: Boolean, default: false },
    planId: { type: String, required: true },
    amount: { type: Number, required: true },
    credits: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ITransaction>(
  "Transaction",
  TransactionSchema
);
