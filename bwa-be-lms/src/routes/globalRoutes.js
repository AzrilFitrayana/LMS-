import express from "express";
import { helloWorld } from "../controller/globalController.js";

const globalRoutes = express.Router();

globalRoutes.get("/hello-world", helloWorld);

export default globalRoutes;
