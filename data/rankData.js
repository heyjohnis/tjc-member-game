import { db } from "../db/database.js";

export async function registRank(req, res) {
  const { time, score, login_id, level, correct } = req.body;
  const INSERT_RANK = `
	INSERT INTO tjckr.tjc_member_game (
		user_id
		, score
		, level
		, correct
		, game_time
	) VALUES (
	  ?
	  , ?
	  , ?
	  , ?
	  , ?
	)
  `;
  return db
    .execute(INSERT_RANK, [login_id, score, level, correct, time])
    .then((res) => res[0]);
}

export async function getRank(req, res) {
  const SELECT_RANK = `
	SELECT a.* FROM (
		SELECT 
			user_id
			, MAX(score) AS score
			, MAX(level) AS level
		FROM
			tjckr.tjc_member_game
		GROUP BY user_id
	) a
	ORDER BY score DESC
	LIMIT 10
  `;
  return db.execute(SELECT_RANK).then((res) => res[0]);
}
