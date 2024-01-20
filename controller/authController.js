import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { checkPassword } from "../data/auth.js";

export async function login(req, res) {
  const { login_id, password } = req.body;
  const hasUser = await checkPassword(req);
  console.log("hasUser: ", hasUser);

  if (hasUser || isGuestUser(req)) {
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

function isGuestUser(req) {
  const { login_id, password } = req.body;
  console.log(
    "login_id: ",
    login_id,
    password,
    login_id === "tjcdb" && password === config.password.key
  );
  return login_id === "tjcdb" && password === config.password.key;
}
