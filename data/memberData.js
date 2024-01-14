import { db } from "../db/database.js";

export async function getDaebangPic(req, res) {
  const SELECT_DAE_BANG_PIC = `
  SELECT 
		name
		, photo 
	FROM 
		kjmin_db.tjc_family_table 
	WHERE
	  registchurch = 6
		AND photo IS NOT NULL
		AND photo != ''
	`;
  return db.execute(SELECT_DAE_BANG_PIC).then((res) => res[0]);
}
