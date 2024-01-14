import { videos, search, movieUpdate, insertMovies, synContent } from '../service/sampleService.js';

export function sample(req, res) {
  console.log("req", req.query);
}

export function getVideos(req, res) {
  videos(req).then( data => {
    res.status(200).json(data);
  });
}

export function getSearch(req, res) {
  search(req).then( data => {
    res.status(200).json(data);
  });
}

export function updateYoutubeMovie(req, res) {
  movieUpdate(req).then( syncRes => {
    synContent(syncRes.data).then(async (result) => {
      res.status(200).json(syncRes.data);
    });
  });
}

export function syncAllMovies(req, res) {
  search(req).then( data => {
    if(data.google_auth) res.status(200).json(data);
    else {
      const {nextPageToken, items} = data;
      insertMovies(req, items).then(data => {
        console.log("업데이트 결과: ", data);
        res.status(200).json(data);
      });
    }
  });
}

export function syncContent(req, res) {
  videos(req).then( data => {
    console.log("getMovieInfo: ", data);
    synContent(data).then((result) => {
      res.status(200).json(data);
    });
  })
}


