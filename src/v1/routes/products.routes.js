import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getOneProduct,
  updateProduct,
} from "../../controllers/products.controllers.js";
const router = express.Router();

router
  .get("/", getAllProducts)
  .get("/:id", getOneProduct)
  .post("/", createProduct)
  .put("/:id", updateProduct)
  .delete("/:id", deleteProduct);

export default router;
