import { db } from "../db/database.js";

export async function getDaebangPic(req, res) {
  const { cnt } = req.query;
  const SELECT_DAE_BANG_PIC = `
  SELECT 
  	g.* 
	FROM (
		SELECT
			f.idx 
			, f.name
			, f.photo
      		, nickname
			, COUNT(f.idx) AS cnt
		FROM 
			tjc_family_table f 
			LEFT OUTER JOIN tjc_present_table p
			ON f.idx = p.familyidx
		WHERE  
			f.registchurch = 6
			AND p.churchidx = 6
			AND f.status != 6
			AND f.photo != ''
		GROUP BY f.idx ) g
		WHERE cnt > ?
		ORDER BY cnt DESC
	`;
  return db.execute(SELECT_DAE_BANG_PIC, [cnt || 0]).then((res) => res[0]);
}
