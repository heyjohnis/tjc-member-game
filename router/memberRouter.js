import express from "express";
import { isAuth } from "../util/auth.js";

const router = express.Router();
import * as controller from "../controller/memberController.js";

router.get("/daebang/pic", isAuth, controller.getDaebangPic);

export default router;
