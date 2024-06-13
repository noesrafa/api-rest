import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

import {
  saveThread,
  threadsByUser,
  handleRequiresAction,
} from "../database/utils.js";

const openai = new OpenAI();

const assistants = {
  support: process.env.OPENAI_ASSISTANT_SUPPORT_ID,
  sales: process.env.OPENAI_ASSISTANT_SALES_ID,
};

const generateMessage = async (req, res) => {
  const { body } = req;

  console.log("bodyString", JSON.stringify(body));
  console.log("messages", body?.session?.parsedResponses?.["Welcome message"]);

  const email = body?.session?.properties?.CONTACT?.email?.value;
  const userMessage =
    body?.userMessage?.message === email
      ? body?.session?.parsedResponses?.["Welcome message"]?.parsedResponse
      : body?.userMessage?.message;

  // res.status(200).send({
  //   status: "success",
  //   message: email,
  //   userMessage: userMessage,
  // });
  // return;

  try {
    const previousThreads = await threadsByUser(email);
    const haveThreads = previousThreads && previousThreads?.length > 0;

    const thread = haveThreads
      ? previousThreads[0]
      : await openai.beta.threads.create();

    if (!haveThreads) await saveThread(email, thread);

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: userMessage,
    });

    let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: assistants.support,
      // instructions: "Be kind",
    });

    if (run.status === "completed") {
      const messagesList = await openai.beta.threads.messages.list(
        run.thread_id
      );
      const message = messagesList.data.map((msg) => msg.content)[0][0].text
        .value;

      res.status(200).send({
        botMessage: message,
        nextModuleNickname: "",
        responseExpected: true,
      });
    } else if (run.status === "requires_action") {
      const action = await handleRequiresAction(run, thread, openai);
      res.status(200).send({
        status: run.status,
        run: run,
        message: action,
      });
    } else {
      res.status(404).send({
        status: run.status,
        message: run,
      });
    }
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
};

export { generateMessage };