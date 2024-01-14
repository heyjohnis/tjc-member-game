import { google } from 'googleapis';
import { authError } from '../util/auth.js';
import { getMovie, insertMovie, updateMovie } from '../data/sample.js';

const service = google.youtube('v3');

export function videos(req) {
  //console.log("req: ", req.body);
  return new Promise((resolve, reject) => {
    service.videos.list({
        auth: req.auth,
        part: 'snippet',
        id: req.query.youtu_id || req.youtu_id || req.body.youtu_id,
      }).then(res => {
        resolve(res.data.items[0]);
      }).catch(err => authError(err, req));
    });
}

export function search(req) {
  return new Promise((resolve, reject) => {
    service.search.list({
        auth: req.auth,
        part: 'snippet',
        forMine: true,
        type: 'video',
        maxResults: req.body.max_results,
        pageToken: req.body.nextPageToken,
      })
      .then(res => {
        resolve(res.data);
      }).catch(err => {
        console.log("인증에러: ", authError(err, req));
        resolve(authError(err, req))
      });
    });
}

export function movieUpdate(req) {

  const {youtu_id, category_id, title, description, tags} = req.body;
  console.log("description1 : ", description);
  console.log("body: ", req.body);

  return new Promise((resolve, reject) => {
    service.videos.update({
        auth: req.auth,
        part: 'snippet',
        resource: {
          id: youtu_id,
          snippet: {
            title,
            description,
            tags: tags ? tags.split(','): [],
            categoryId: category_id,
          }
        }
      }).then(res => {
        resolve(res);
      }).catch(err => authError(err, req));
    });
}

export async function syncMovies(req) {
  const ch_id = req.query.ch_id
  const {nextPageToken, items} = await search(req);
  let cnt = 0;
  for( const movie of items) {
    const youtu_id = movie.id.videoId;
    const isMov = await getMovie(youtu_id); // DB에서 조회
    if(isMov.length < 1) {
      console.log("미등록 영상: ", youtu_id);
      req.youtu_id = youtu_id;
      const detail = await videos(req);
      const inserted = await insertMovie( await setMoveData(detail) );
      console.log("등록완료: ", youtu_id, inserted);
      cnt ++;
    }
  }
  return cnt;
}

export async function insertMovies(req, movies) {
  let cnt = 0;
  for( const movie of movies) {
    const youtu_id = movie.id.videoId;
    const isMov = await getMovie(youtu_id); // DB에서 조회
    if(isMov.length < 1) {
      console.log("미등록 영상: ", youtu_id);
      req.youtu_id = youtu_id;
      const detail = await videos(req);
      const inserted = await insertMovie( await setMoveData(detail) );
      console.log("등록완료: ", youtu_id, inserted);
      cnt ++;
    }
  }
  return {updated: cnt};
}


export async function synContent(req) {
  const snippet = req.snippet;
  const vals = {
    title: snippet.title,
    description: snippet.description,
    tags: snippet.tags ? snippet.tags.join(','): '',
    etag: req.etag,
    youtu_id: req.id,
  };
  await updateMovie(vals).then(async data => {
    console.log("updated: ", data);
    return data;
  });
}



async function setMoveData(detail) {
  
  console.log("=========== set movie data ==========");

  const snippet = detail.snippet;
  const {title, bible_verse, 
    make_date, tch_name, tch_id} = await inpYoutuTitle(snippet.title);
  const tags = snippet.tags ? snippet.tags.join(','): '';
  const data = {
    youtu_id: detail.id
    ,youtu_title: snippet.title
    ,youtu_publish_at: snippet.publishedAt
    ,youtu_channel_id: snippet.channelId
    ,youtu_description: snippet.description
    ,youtu_tags: tags
    ,ch_id: null
    ,tch_id: tch_id || null
    ,tch_name: tch_name || null
    ,title: title || null
    ,bible_verse: bible_verse || null
    ,etag: detail.etag
    ,category_id: snippet.categoryId
    ,make_date: make_date ? make_date : snippet.publishedAt
    ,hash_tags: getHashTag(snippet.description)
    ,reg_id: 0
  }

  console.log("data : ", data);
  return data;
}



async function inpYoutuTitle(text) {

  console.log("==== title : ", text);

  const REG_SERIES = /\[.*\]/gi;
  const REG_VERSE = /\(([가-힣])[\S ](\d{0,2})((:\d{0,2})||(:\d{0,2}-\d{0,3}))\)/gi;
  const REG_DATE =  /(\d{4})[\.-](\d{2})[\.-](\d{2})/gi;
  
  const series_name = text.match(REG_SERIES) ? text.match(REG_SERIES) + '' : '';
  const bible_verse = text.match(REG_VERSE) ? text.match(REG_VERSE) + '' : ''; 
  const make_date = text.match(REG_DATE) ? text.match(REG_DATE) + '' : '';
  
  const title_tch = text.replace(series_name, '').replace(bible_verse, '').replace(make_date, '').replace(/[0-9.]/g, '');
  const title = title_tch.split('-')[0].trim();
  
  const tch_name_appellation = title_tch.split('-')[1] ? title_tch.split('-')[1].trim() : '';
  let tch_name = '';
  if(tch_name_appellation) {
    const tch_name_appellation_s = tch_name_appellation.split(' ');
    tch_name = tch_name_appellation_s[0];
  }
  const tch_id = await getTeacherName(tch_name);
  const result = {title, tch_name
    ,make_date: make_date ? new Date(make_date).toISOString() : null
    ,bible_verse: bible_verse.replace('(','').replace(')','')
    ,tch_id: tch_id.length ? tch_id[0].tch_id: null };
  console.log("result: ", result);
  return result
}

function getHashTag(text) {
  const regExp = /#[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z_0-9]*/g;
  const hashs = text.match(regExp);
  return hashs ? hashs.join(' ') : '';
}