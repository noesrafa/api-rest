import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, unique: true },
  currentAssistantId: { type: String, required: true },
  token: { type: String },
  heruId: { type: String },
});

const User = mongoose.model("User", userSchema);

export default User;
