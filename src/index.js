import express from "express";
import mongoose from "mongoose";
import V1RouterSupport from "./v1/routes/openai.routes.js";
import V1RouterProducts from "./v1/routes/products.routes.js";
import V1RouterUsers from "./v1/routes/users.routes.js";
import V1ThreadsRouter from "./v1/routes/threads.routes.js";
import V1WebhookRouter from "./v1/routes/webhook.routes.js";

const app = express();
const PORT = process.env.PORT || 1234;

const ACCEPTED_ORIGINS = ["http://localhost:3000", "*"];

app.options("*", (req, res) => {
  const origin = req.headers("origin");

  if (
    ACCEPTED_ORIGINS.includes(origin) ||
    ACCEPTED_ORIGINS.includes("*") ||
    !origin
  ) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  }

  res.send(200);
});

app.use(express.json());
app.use("/api/v1/support", V1RouterSupport);
app.use("/api/v1/products", V1RouterProducts);
app.use("/api/v1/users", V1RouterUsers);
app.use("/api/v1/threads", V1ThreadsRouter);
app.use("/api/v1/webhook", V1WebhookRouter);

mongoose
  .connect(
    `mongodb+srv://noesrafa:${process.env.MONGO_PASSWORD}@cluster.5ol0syh.mongodb.net/${process.env.MONGO_COLLECTION}?retryWrites=true&w=majority&appName=cluster`
  )
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error: ", error);
  });
