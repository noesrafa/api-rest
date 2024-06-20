import express from "express";
import { testingTool } from "../../controllers/testing.controllers.js";
const router = express.Router();

router.get("/", testingTool);

export default router;
