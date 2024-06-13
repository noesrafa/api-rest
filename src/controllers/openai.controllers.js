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

const getAllOpenai = async (_, res) => {
  try {
    res.send("GET all");
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
};

const getOneOpenai = async (req, res) => {
  res.send(`GET ${req.params.id}`);
};

const createOpenai = async (req, res) => {
  const { body } = req;

  console.log("body", body);

  res.status(200).send(body);
  return

  if (!body.message) {
    res.status(400).send({
      error: "Message is required",
    });
  }
  try {
    const previousThreads = await threadsByUser(body.phoneNumber);
    const haveThreads = previousThreads && previousThreads?.length > 0;

    const thread = haveThreads
      ? previousThreads[0]
      : await openai.beta.threads.create();

    if (!haveThreads) await saveThread(body.phoneNumber, thread);

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: body.message,
    });

    let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: assistants.support,
      instructions: "Be kind",
    });

    if (run.status === "completed") {
      const messagesList = await openai.beta.threads.messages.list(
        run.thread_id
      );
      const messages = messagesList.data.map((msg) => msg.content)[0][0].text
        .value;

      res.status(200).send({
        status: "success",
        message: messages,
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

const updateOpenai = async (req, res) => {
  res.send(`PUT ${req.params.id}`);
};

const deleteOpenai = async (req, res) => {
  res.send(`DEL ${req.params.id}`);
};

export { getAllOpenai, getOneOpenai, createOpenai, updateOpenai, deleteOpenai };
