import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import mealRoutes from "./routes/mealRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import logger from "./config/logger.js";

dotenv.config();

const app = express();

connectDB();

app.use(express.json());

app.use("/api/meals", mealRoutes);
app.use("/api/users", userRoutes);
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
