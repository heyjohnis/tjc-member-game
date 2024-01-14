import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import * as userRepository from '../data/auth.js';

const AUTH_ERROR = { message: 'Authentication Error' };

export const isAuth = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!(authHeader && authHeader.startsWith('Bearer '))) {
    return res.status(401).json(AUTH_ERROR);
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, config.jwt.secretKey, async (error, decoded) => {
    console.log("decode: ", decoded);
    if (error) {
      return res.status(401).json(AUTH_ERROR);
    }
    const user = await userRepository.findByloginId(decoded.id);
    if (!user) {
      return res.status(401).json(AUTH_ERROR);
    }
    req.logn_id = decoded.id; // req.customData
    req.cust_no = user.cust_no;
    next();
  });
};

export async function authError(err, req) {
  console.log("err: ", err);
  const errReason = err.response.data || '';
  let ch_id = '';
  if(req)
    ch_id = req.query.ch_id || req.params.ch_id || req.body.ch_id;

  console.log("인증 errReason : ", errReason);
  if(errReason.error) 
    return {google_auth: await getNewTokenURL(ch_id)};
  else 
    return err;
}
