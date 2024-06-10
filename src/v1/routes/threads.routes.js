import express from "express";
import {
  createThread,
  threadsByUser,
} from "../../controllers/threads.controller.js";
const router = express.Router();

router.get("/:id", threadsByUser).post("/", createThread);

export default router;
