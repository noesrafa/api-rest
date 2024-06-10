import { User } from "../models/user.model.js";
import Thread from "../models/thread.model.js";
import { createThread as createThreadUtil } from "../database/utils.js";

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

async function createUser(phoneNumber) {
  try {
    const user = new User({ phoneNumber });
    await user.save();
    return user;
  } catch (err) {
    console.error("Error al crear usuario:", err);
  }
}

const createThread = async (req, res) => {
  const { body } = req;

  if (!body.phoneNumber || !body.thread) {
    return res.status(400).json({ thread: "Thread is required" });
  }

  try {
    // let user = await User.findOne({ phoneNumber: body.phoneNumber });
    // if (!user) {
    //   user = await createUser(body.phoneNumber);
    // }

    // const conversation = new Thread({
    //   userId: user._id,
    //   id: body.thread.id,
    //   object: body.thread.object,
    //   created_at: body.thread.created_at,
    //   metadata: body.thread.metadata,
    //   tool_resources: body.thread.tool_resources,
    // });
    // await conversation.save();
    const thread = await createThreadUtil(body.phoneNumber, body.thread);
    return res.status(201).json(thread);
  } catch (error) {
    return res.status(500).json({ message: "Error creating user" });
  }
};

export { threadsByUser, createThread };
