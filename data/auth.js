import { db } from "../db/database.js";
import { config } from "../config.js";

export async function checkPassword(req) {
  const { login_id, password } = req.body;
  return db
    .execute(
      ` SELECT
        * 
        FROM 
          tjc_login_table 
        WHERE 
          pass = PASSWORD(?) 
          AND id = ?`,
      [password, login_id]
    )
    .then((result) => result[0][0]);
}
