import express from "express";
const router = express.Router();
import {
  generateMessage,
  generateMessageTreble,
} from "../../controllers/webhook.controllers.js";

router.post("/", generateMessage);
router.post("/treble", generateMessageTreble);

export default router;
