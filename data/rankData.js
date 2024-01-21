import { db } from "../db/database.js";

export async function registRank(req, res) {
  const { time, score, login_id, nickname, level, correct } = req.body;
  const INSERT_RANK = `
	INSERT INTO tjckr.tjc_member_game (
		user_id
		, nickname
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
	  , ?
	)
  `;
  return db
    .execute(INSERT_RANK, [login_id, nickname, score, level, correct, time])
    .then((res) => res[0]);
}

export async function getRank(req, res) {
  const SELECT_RANK = `
		SELECT 
			user_id
			, nickname
			, score
			, level
			, correct
			, game_time
		FROM
			tjckr.tjc_member_game g
		WHERE
			g.score > 600
		ORDER BY g.score DESC
  `;
  return db.execute(SELECT_RANK).then((res) => res[0]);
}
