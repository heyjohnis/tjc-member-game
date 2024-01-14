import express from "express";

const router = express.Router();
import * as controller from "../controller/memberController.js";

router.get("/daebang/pic", controller.getDaebangPic);

export default router;
