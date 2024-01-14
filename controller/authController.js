import jwt from "jsonwebtoken";
// import bcrypt from 'bcrypt';

import axios from "axios";
import {} from "express-async-errors";
import { config } from "../config.js";
import * as userRepository from "../data/auth.js";

export async function signup(req, res) {
  const { username, password, name, email, url } = req.body;
  const found = await userRepository.findByUsername(username);
  if (found) {
    return res
      .status(409)
      .json({ message: `'${username}' 아이디는 이미 존재합니다.` });
  }

  const userId = await userRepository.createUser({
    username,
    password,
    name,
    email,
    url,
  });

  const token = createJwtToken(userId);
  res.status(200).json({ token, username });
}

export async function login(req, res) {
  console.log("req: ", req.body);

  const { logn_id, logn_pwd } = req.body;
  const user = await userRepository.findByUsername(logn_id);
  if (!user) {
    return res
      .status(401)
      .json({ message: "사용자 아이디나 패스워드가 틀렸습니다." });
  }

  const isValidPassword =
    user.logn_pwd == logn_pwd || user.tmp_pswd == logn_pwd;
  if (!isValidPassword) {
    return res
      .status(401)
      .json({ message: "사용자 아이디나 패스워드가 틀렸습니다." });
  }
  responseData(user, res);
}

async function responseData(user, res) {
  const token = createJwtToken(user.logn_id);

  const myInfo = await service.selectMyInfo(user.cust_no);

  // 딜러의 경우 고객정보 sync
  const registedCustomers = [];
  if (user.user_kind == "DLR") {
    const customer = await service.syncCustomers(user.logn_id, user.cust_no);
    registedCustomers.push(...customer);
  }

  res.status(200).json({
    token,
    logn_id: user.logn_id,
    cust_no: user.cust_no,
    user_kind: user.user_kind,
    my_fortune_info: myInfo,
    reg_custs: registedCustomers,
  });
}

export async function myInfo(req, res, next) {
  const userInfo = await userRepository.getMyInfo(req.logn_id);
  if (!userInfo) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({ token: req.token, my_info: userInfo });
}

function createJwtToken(id) {
  return jwt.sign({ id }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInSec,
  });
}

export async function setTempPasswordByEmail(req, res, next) {
  const data = await service.setTempPasswordByEmail(req);
  return res.status(200).json(data);
}

export function firebaseCheckToken(req) {
  verificationToken(req.body.token);
}

export async function snsLogin(req, res) {
  const isRegisted = await service.checkRegistedUser(req);
  if (!isRegisted)
    return res
      .status(203)
      .json({ err: "회원가입하지 않은 계정입니다.", err_code: 1 });

  const uid = req.body.fb_uid;
  const fbToken = await verificationToken(req.body.fb_token).then(
    (fbToken) => fbToken
  );

  if (uid === fbToken.uid) {
    const user = await userRepository.findUserInfoByUid(uid);
    console.log("user: ", user);
    if (!user) {
      return res
        .status(401)
        .json({ err: "사용자 아이디나 패스워드가 틀렸습니다." });
    }

    responseData(user, res);
  } else {
    res.status(401).json({ err: "", err_code: 2 });
  }
}

export async function kakaoLogin(req, res) {
  const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${config.kakao.apiKey}&redirect_uri=${config.kakao.rediretUri}&response_type=code&scope=account_email`;
  res.redirect(kakaoAuthURL);
}

export async function naverLogin(req, res) {
  const api_url =
    "https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=" +
    config.naver.apiKey +
    "&redirect_uri=" +
    config.naver.rediretUri +
    "&state=" +
    new Date().getTime();
  console.log("api_url: ", api_url);
  res.redirect(api_url);
}

export async function kakaoLoginCallback(req, res) {
  const token = await axios({
    method: "POST",
    url: "https://kauth.kakao.com/oauth/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: {
      grant_type: "authorization_code",
      client_id: config.kakao.apiKey,
      redirect_uri: config.kakao.rediretUri,
      code: req.query.code,
      client_secret: config.kakao.secretKey,
    },
  });
  const kakaoUserInfo = await axios({
    method: "get",
    url: "https://kapi.kakao.com/v2/user/me",
    headers: {
      Authorization: `Bearer ${token.data.access_token}`,
    },
  });
  console.log("kakaoUserInfo: ", kakaoUserInfo.data.kakao_account.email);
  const email = kakaoUserInfo.data.kakao_account.email;
  const custNo = await service.checkRegistedUser({
    body: { email: email },
  });
  console.log("isRegisted: ", custNo);

  if (!custNo) {
    var queryString = Object.entries({
      message: "회원가입하지 않은 계정입니다.",
      email: email,
    })
      .map(([key, value]) => value && key + "=" + value)
      .filter((v) => v)
      .join("&");

    res.redirect("/callback.html?" + queryString);
    res.end();

    // res.status(203).json({
    //   data: { message: "회원가입하지 않은 계정입니다.", email: email },
    // });
  } else {
    const userInfo = await service.getUserInfoByCustNo(custNo);
    snsLoginResponseData(userInfo, res);
  }
}

export async function naverLoginCallback(req, res) {
  const code = req.query.code;
  const state = req.query.state;
  console.log("query: ", req.query);
  const url = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${config.naver.apiKey}&client_secret=${config.naver.secretKey}&redirect_uri=${config.naver.rediretUri}&code=${code}&state=${state}`;
  console.log("url: ", url);
  const token = await axios({
    method: "GET",
    url,
    headers: {
      "X-Naver-Client-Id": config.naver.apiKey,
      "X-Naver-Client-Secret": config.naver.secretKey,
    },
  });

  console.log("naver token: ", token.data);

  const naverUserInfo = await axios({
    method: "get",
    url: "https://openapi.naver.com/v1/nid/me",
    headers: {
      Authorization: `Bearer ${token.data.access_token}`,
    },
  });
  const email = naverUserInfo.data.response.email;
  const custNo = await service.checkRegistedUser({ body: { email: email } });
  console.log("custNo: ", custNo);
  if (!custNo) {
    const queryString = Object.entries({
      message: "회원가입하지 않은 계정입니다.",
      email: email,
    })
      .map(([key, value]) => value && key + "=" + value)
      .filter((v) => v)
      .join("&");

    res.redirect("/callback.html?" + queryString);
    res.end();

    // res.status(203).json({
    //   data: { message: "회원가입하지 않은 계정입니다.", email: email },
    // });
  } else {
    const userInfo = await service.getUserInfoByCustNo(custNo);
    snsLoginResponseData(userInfo, res);
  }
}

async function snsLoginResponseData(user, res) {
  const token = createJwtToken(user.logn_id);

  const myInfo = await service.selectMyInfo(user.cust_no);

  // 딜러의 경우 고객정보 sync
  const registedCustomers = [];
  if (user.user_kind == "DLR") {
    const customer = await service.syncCustomers(user.logn_id, user.cust_no);
    registedCustomers.push(...customer);
  }

  const queryString = Object.entries({
    token,
    logn_id: user.logn_id,
    cust_no: user.cust_no,
    user_kind: user.user_kind,
    my_fortune_info: myInfo,
    reg_custs: registedCustomers,
  })
    .map(([key, value]) => value && key + "=" + value)
    .filter((v) => v)
    .join("&");

  res.redirect("/callback.html?" + queryString);
  res.end();
}

export async function changePassword(req, res) {
  const { logn_id, logn_pwd } = req.body;
  const user = await userRepository.findByUsername(logn_id);

  const isValidPassword =
    user.logn_pwd == logn_pwd || user.tmp_pswd == logn_pwd;
  if (!isValidPassword) {
    res.status(401).json({ message: "사용자 아이디나 패스워드가 틀렸습니다." });
  }
  const token = createJwtToken(user.logn_id);

  userRepository
    .updatePassword(req)
    .then((data) => {
      res.status(200).json({
        data,
        token,
        logn_id: user.logn_id,
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
}
