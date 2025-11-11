import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import globalRoutes from "./routes/globalRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./utils/database.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";

const app = express();
const port = 3000;

dotenv.config();

connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello BE");
});

app.use("/api", globalRoutes);
app.use('/api', paymentRoutes);
app.use('/api', authRoutes);
app.use('/api', courseRoutes);

app.listen(port, () => {
  console.log(`BE server running at http://localhost:${port}`);
});
