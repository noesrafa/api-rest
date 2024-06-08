import express from "express";
import V1Router from "./v1/routes/openaiRoutes.js";

const app = express();
const PORT = process.env.PORT || 1234;

app.use(express.json());
app.use("/api/v1/openai", V1Router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
