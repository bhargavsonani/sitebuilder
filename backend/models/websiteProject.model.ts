// import mongoose, { Schema, Document } from "mongoose";

// export interface IWebsiteProject extends Document {
//   name: string;
//   initial_prompt: string;
//   current_code?: string;
//   current_version_index: string;
//   isPublished: boolean;
//   userId: mongoose.Types.ObjectId;
// }

// const WebsiteProjectSchema = new Schema<IWebsiteProject>(
//   {
//     name: { type: String, required: true },
//     initial_prompt: { type: String, required: true },
//     current_code: { type: String },
//     current_version_index: { type: String, default: "" },
//     isPublished: { type: Boolean, default: false },
//     userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
//   },
//   { timestamps: true }
// );

// export default mongoose.model<IWebsiteProject>(
//   "WebsiteProject",
//   WebsiteProjectSchema
// );


import { Schema, model, Types } from "mongoose";

export interface IWebsiteProject {
  _id: Types.ObjectId;
  name: string;
  initial_prompt: string;
  current_code?: string;
  current_version_index?: string;
  isPublished: boolean;
  userId: Types.ObjectId;
}

const WebsiteProjectSchema = new Schema<IWebsiteProject>(
  {
    name: { type: String, required: true },
    initial_prompt: { type: String, required: true },
    current_code: String,
    current_version_index: String,
    isPublished: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default model<IWebsiteProject>("WebsiteProject", WebsiteProjectSchema);