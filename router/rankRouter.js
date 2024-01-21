import express from "express";
import { isAuth } from "../util/auth.js";

const router = express.Router();
import * as controller from "../controller/rankController.js";

router.post("/regist", isAuth, controller.registRank);

router.get("/list", controller.getRank);

export default router;
