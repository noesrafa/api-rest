import User from "../models/user.model.js";
import Thread from "../models/thread.model.js";
import { saveThread } from "../database/utils.js";

const threadsByUser = async (req, res) => {
  try {
    let user = await User.findOne({ phoneNumber: req.params.id });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const threads = await Thread.find({ userId: user._id });
    return res.status(200).json(threads);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching conversations" });
  }
};

const createThread = async (req, res) => {
  const { body } = req;

  if (!body.phoneNumber || !body.thread) {
    return res.status(400).json({ thread: "Thread is required" });
  }

  try {
    const thread = await saveThread(body.phoneNumber, body.thread);
    return res.status(201).json(thread);
  } catch (error) {
    return res.status(500).json({ message: "Error creating user" });
  }
};

export { threadsByUser, createThread };
