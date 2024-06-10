import fs from "fs";
import { User } from "../models/user.model.js";
import Thread from "../models/thread.model.js";

const saveToDatabase = (data) =>
  fs.writeFileSync("./src/database/db.json", JSON.stringify(data, null, 2), {
    encoding: "utf8",
  });

async function createUser(phoneNumber) {
  try {
    const user = new User({ phoneNumber });
    await user.save();
    return user;
  } catch (err) {
    console.error("Error al crear usuario:", err);
  }
}

const createThread = async (phoneNumber, threadContent) => {
  let user = await User.findOne({ phoneNumber: phoneNumber });
  if (!user) {
    user = await createUser(phoneNumber);
  }

  const thread = new Thread({
    userId: user._id,
    id: threadContent.id,
    object: threadContent.object,
    created_at: threadContent.created_at,
    metadata: threadContent.metadata,
    tool_resources: threadContent.tool_resources,
  });
  await thread.save();
  return thread;
};

const threadsByUser = async (phoneNumber) => {
  let user = await User.findOne({ phoneNumber });
  if (!user) {
    console.log("ENTRO")
    return null;
  }

  const threads = await Thread.find({ userId: user._id });
  return threads;
};

export { saveToDatabase, createThread, threadsByUser };
