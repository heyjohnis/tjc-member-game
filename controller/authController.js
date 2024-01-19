import jwt from "jsonwebtoken";
// import bcrypt from 'bcrypt';

import axios from "axios";
import {} from "express-async-errors";
import { config } from "../config.js";

export async function login(req, res) {
  const { login_id, password } = req.body;
  if (password === config.password.key) {
    const token = createJwtToken(login_id);
    res.status(200).json({
      success: true,
      login_id,
      token,
    });
  } else {
    res.status(401).json({ error: "패스워드가 틀립니다." });
  }
}

function createJwtToken(id) {
  return jwt.sign({ id }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInSec,
  });
}
