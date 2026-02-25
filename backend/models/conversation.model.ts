// import mongoose, { Schema, Document } from "mongoose";

// export enum Role {
//   user = "user",
//   assistant = "assistant",
// }

// export interface IConversation extends Document {
//   role: Role;
//   content: string;
//   projectId: mongoose.Types.ObjectId;
//   timestamp: Date;
// }

// const ConversationSchema = new Schema<IConversation>({
//   role: { type: String, enum: Object.values(Role), required: true },
//   content: { type: String, required: true },
//   projectId: {
//     type: Schema.Types.ObjectId,
//     ref: "WebsiteProject",
//     required: true,
//   },
//   timestamp: { type: Date, default: Date.now },
// });

// export default mongoose.model<IConversation>(
//   "Conversation",
//   ConversationSchema
// );


import { Schema, model, Types } from "mongoose";

export enum Role {
  user = "user",
  assistant = "assistant",
}

export interface IConversation {
  role: Role;
  content: string;
  projectId: Types.ObjectId;
  timestamp: Date;
}

const ConversationSchema = new Schema<IConversation>({
  role: { type: String, enum: Object.values(Role), required: true },
  content: { type: String, required: true },
  projectId: { type: Schema.Types.ObjectId, ref: "WebsiteProject", required: true },
  timestamp: { type: Date, default: Date.now },
});

export default model<IConversation>("Conversation", ConversationSchema);