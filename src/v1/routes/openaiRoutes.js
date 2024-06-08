import express from "express";
import {
  createOpenai,
  deleteOpenai,
  getAllOpenai,
  getOneOpenai,
  updateOpenai,
} from "../../controllers/openaiControllers.js";
const router = express.Router();

router
  .get("/", getAllOpenai)
  .get("/:id", getOneOpenai)
  .post("/", createOpenai)
  .put("/:id", updateOpenai)
  .delete("/:id", deleteOpenai);

export default router;
