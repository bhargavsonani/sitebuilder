// import mongoose, { Schema, Document } from "mongoose";

// export interface IVersion extends Document {
//   code: string;
//   description?: string;
//   projectId: mongoose.Types.ObjectId;
//   timestamp: Date;
// }

// const VersionSchema = new Schema<IVersion>({
//   code: { type: String, required: true },
//   description: { type: String },
//   projectId: {
//     type: Schema.Types.ObjectId,
//     ref: "WebsiteProject",
//     required: true,
//   },
//   timestamp: { type: Date, default: Date.now },
// });

// export default mongoose.model<IVersion>("Version", VersionSchema);


import { Schema, model, Types } from "mongoose";

export interface IVersion {
  code: string;
  description?: string;
  projectId: Types.ObjectId;
  timestamp: Date;
}

const VersionSchema = new Schema<IVersion>({
  code: { type: String, required: true },
  description: String,
  projectId: { type: Schema.Types.ObjectId, ref: "WebsiteProject", required: true },
  timestamp: { type: Date, default: Date.now },
});

export default model<IVersion>("Version", VersionSchema);