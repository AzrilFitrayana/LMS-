import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import globalRoutes from "./routes/globalRoutes.js";

const app = express();
const port = 3000;

dotenv.config();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello BE");
});

app.use("/api", globalRoutes);

app.listen(port, () => {
  console.log(`BE server running at http://localhost:${port}`);
});
