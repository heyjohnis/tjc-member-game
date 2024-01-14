import express from "express";
import "express-async-errors";
import { body } from "express-validator";
import { validate } from "../util/validator.js";
import * as authController from "../controller/authController.js";
import { isAuth } from "../util/auth.js";

const router = express.Router();

const validateCredential = [
  body("logn_id")
    .trim()
    .notEmpty()
    .withMessage("아이디를 최소 5자 이상 입력하세요."),
  body("logn_pwd")
    .trim()
    .isLength({ min: 4 })
    .withMessage("패스워드를 최소 4자 이상 입력하세요."),
  validate,
];

const validateSignup = [
  ...validateCredential,
  body("name").notEmpty().withMessage("이름을 입력 안했습니다."),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("유효하지 않은 이메일입니다."),
  body("url")
    .isURL()
    .withMessage("유효하지 않은 URL 입니다.")
    .optional({ nullable: true, checkFalsy: true }),
];

router.post("/signup", validateSignup, authController.signup);

router.post("/login", validateCredential, authController.login);

export default router;
