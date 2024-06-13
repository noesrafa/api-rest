import express from "express";
const router = express.Router();
import { generateMessage } from "../../controllers/webhook.controllers.js";

router.post("/", generateMessage);

export default router;
