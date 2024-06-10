import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  id: {
    type: String,
    required: true,
    unique: true,
  },
  object: {
    type: String,
    required: true,
    default: "thread",
  },
  created_at: {
    type: Number,
    required: true,
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {},
  },
  tool_resources: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {},
  },
});

const Thread = mongoose.model("Thread", threadSchema);

export default Thread;
