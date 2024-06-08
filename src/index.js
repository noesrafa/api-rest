import express from "express";
import V1Router from "./v1/routes/index.js";

const app = express();
const PORT = process.env.PORT || 1234;

app.use("/api/v1", V1Router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
