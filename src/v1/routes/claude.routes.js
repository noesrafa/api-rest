import express from "express";
import {
  sendClaude,
  sendClaudeStream,
} from "../../controllers/claude.controllers.js";
const router = express.Router();

router.post("/", sendClaude);
router.post("/stream", sendClaudeStream);

export default router;
