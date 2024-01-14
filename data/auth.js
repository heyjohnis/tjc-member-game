import { db } from "../db/database.js";
import { config } from "../config.js";

const dbKey = config.db.key;

const SELECT_LOGIN = `
  SELECT 
    logn_id
    , CONVERT(AES_DECRYPT(UNHEX(logn_pswd),?), CHAR(50)) AS logn_pwd
    , tmp_pswd
    , cust_no
    , (SELECT home_id_kind FROM tb_cust c WHERE c.cust_no = l.cust_no) AS user_kind
  FROM 
    tb_logn l
  WHERE
    logn_id = ?
    AND mobl_use_yn != 'n'
`;

export async function findByUsername(loginId) {
  return db
    .execute(SELECT_LOGIN, [dbKey, loginId]) //
    .then((result) => result[0][0]);
}

const SELECT_MY_INFO = `
SELECT 
  a.cust_no
  , a.home_id_kind
  , a.cust_cd
  , a.cust_nm_kr
  , a.cust_nm_eng
  , a.nick_nm
  , a.cust_gndn
  , a.cust_bank_cd
  , a.cust_bank_acnt
  , a.cust_bank_achr
  , a.prsn_info_agrm_yn
  , a.prsn_info_agrm_dt
  , a.remark
  , b.addr_nm
  , b.pscd
  , b.addr1
  , b.addr2
  , CONVERT(AES_DECRYPT(UNHEX(a.cust_tlno), ?), CHAR(50)) AS tlno
  , CONVERT(AES_DECRYPT(UNHEX(a.cust_mobl), ?), CHAR(50)) AS mobl
  , CONVERT(AES_DECRYPT(UNHEX(a.cust_mail), ?), CHAR(50)) AS mail
FROM 
  tb_cust a 
  LEFT OUTER JOIN tb_addr b ON a.cust_no = b.cust_no
WHERE 
  a.cust_no = (SELECT cust_no FROM tb_logn WHERE logn_id = ? LIMIT 1)
LIMIT 1
`;

export async function findByloginId(loginId) {
  return db
    .execute(`SELECT logn_id, cust_no FROM tb_logn WHERE logn_id = ?`, [
      loginId,
    ])
    .then((result) => result[0][0]);
}

export async function getMyInfo(loginId) {
  return db
    .execute(SELECT_MY_INFO, [dbKey, dbKey, dbKey, loginId])
    .then((result) => result[0][0]);
}

export async function createUser(user) {
  const { username, password, name, email, url } = user;
  return db
    .execute(
      "INSERT INTO users (username, password, name, email, url) VALUES (?,?,?,?,?)",
      [username, password, name, email, url]
    )
    .then((result) => result[0].insertId);
}

export async function getFortCustNo(req) {
  const GET_FORT_CUST_NO = `
    SELECT 
      c.fort_cust_no 
    FROM 
      tb_logn l 
      INNER JOIN tb_fortune_cust c
      ON l.cust_no = c.key_cust_no 
    WHERE 
      logn_id = ? 
      AND c.fort_cust_type = '01' 
    LIMIT 1
  `;

  const lognId = req.logn_id;
  return db
    .execute(GET_FORT_CUST_NO, [lognId])
    .then((result) => result[0][0].fort_cust_no);
}

export async function findUserInfoByUid(uid) {
  const SELECT_USER_INFO = `
    SELECT 
      logn_id
      , CONVERT(AES_DECRYPT(UNHEX(logn_pswd),?), CHAR(50)) AS logn_pwd
      , tmp_pswd
      , cust_no
      , (SELECT home_id_kind FROM tb_cust c WHERE c.cust_no = l.cust_no) AS user_kind
    FROM 
      tb_logn l
    WHERE
      fb_uid = ?
      AND mobl_use_yn != 'n'
  `;

  return db
    .execute(SELECT_USER_INFO, [dbKey, uid]) //
    .then((result) => result[0][0]);
}

export async function updatePassword(req) {
  const password = req.body.new_pwd;
  const lognId = req.body.logn_id;
  const UPDATE_PASSWORD = `
    UPDATE tb_logn
    SET 
      logn_pswd = HEX(AES_ENCRYPT(?, ?))
      , tmp_pswd = '' 
    WHERE logn_id = ?
  `;
  return db
    .execute(UPDATE_PASSWORD, [password, dbKey, lognId])
    .then((result) => result[0][0]);
}
