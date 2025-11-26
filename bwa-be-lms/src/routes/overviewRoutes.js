import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getOverviewController } from "../controller/overviewController.js";

const overviewRouter = express.Router();

overviewRouter.get("/overview", verifyToken, getOverviewController);

export default overviewRouter;
