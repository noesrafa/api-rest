import fs from "fs";
import User from "../models/user.model.js";
import Thread from "../models/thread.model.js";
import dotenv from "dotenv";
dotenv.config();

const saveToDatabase = (data) =>
  fs.writeFileSync("./src/database/db.json", JSON.stringify(data, null, 2), {
    encoding: "utf8",
  });

async function createUser(email) {
  try {
    const user = new User({
      email,
      currentAssistantId: process.env.OPENAI_ASSISTANT_SUPPORT_ID,
    });
    await user.save();
    return user;
  } catch (err) {
    console.error("Error al crear usuario:", err);
  }
}

const saveThread = async (email, threadContent) => {
  let user = await User.findOne({ email });

  if (!user) {
    user = await createUser(email);
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

const threadsByUser = async (email) => {
  let user = await User.findOne({ email });
  if (!user) return null;

  const threads = await Thread.find({ userId: user._id });
  return threads;
};

const handleRequiresAction = async (run, thread, client) => {
  // Check if there are tools that require outputs
  if (
    run.required_action &&
    run.required_action.submit_tool_outputs &&
    run.required_action.submit_tool_outputs.tool_calls
  ) {
    // Loop through each tool in the required action section
    const toolOutputs = run.required_action.submit_tool_outputs.tool_calls.map(
      (tool) => {
        if (tool.function.name === "send_to_sales") {
          return {
            tool_call_id: tool.id,
            output: "HUBO UN ERROR 123 AL ENVIAR A VENTAS",
          };
        }
      }
    );

    // Submit all tool outputs at once after collecting them in a list
    if (toolOutputs.length > 0) {
      run = await client.beta.threads.runs.submitToolOutputsAndPoll(
        thread.id,
        run.id,
        { tool_outputs: toolOutputs }
      );
      console.log("Tool outputs submitted successfully.");
    } else {
      console.log("No tool outputs to submit.");
    }

    // Check status after submitting tool outputs
    return handleRunStatus(run, thread, client);
  }
};

const handleRunStatus = async (run, thread, client) => {
  if (run.status === "completed") {
    let messages = await client.beta.threads.messages.list(thread.id);
    return messages.data;
  } else if (run.status === "requires_action") {
    return await handleRequiresAction(run);
  } else {
    console.error("Run did not complete:", run);
  }
};

export {
  saveToDatabase,
  saveThread,
  threadsByUser,
  handleRequiresAction,
  handleRunStatus,
};
