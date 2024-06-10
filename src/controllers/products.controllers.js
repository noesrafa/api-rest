import dotenv from "dotenv";
import Product from "../models/product.model.js";
dotenv.config();

const getAllProducts = async (_, res) => {
  try {
    const products = await Product.find();
    res.status(200).send({
      message: "All products",
      products,
    });
  } catch (error) {
    res.status(500).send({
      error: "Error getting products",
    });
  }
};

const getOneProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send({
        message: "Product not found",
      });
    }
    res.status(200).send({
      message: "Product found",
      product,
    });
  } catch (error) {
    res.status(500).send({
      error: "Error getting product",
    });
  }
};

const createProduct = async (req, res) => {
  const { body } = req;

  try {
    const product = await Product.create(body);
    res.status(201).send({
      message: "Product created",
      product,
    });
  } catch (error) {
    res.status(500).send({
      error: "Error creating product",
    });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  try {
    const product = await Product.findByIdAndUpdate(id, body);

    if (!product) {
      return res.status(404).send({
        message: "Product not found",
      });
    }
    const updateProduct = await Product.findById(id);
    res.status(200).send({
      message: "Product updated",
      updateProduct,
    });
  } catch (error) {
    res.status(500).send({
      error: "Error updating product",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).send({
        message: "Product not found",
      });
    }
    res.status(200).send({
      message: "Product deleted",
    });
  } catch (error) {
    res.status(500).send({
      error: "Error deleting product",
    });
  }
};

export {
  getAllProducts,
  getOneProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
