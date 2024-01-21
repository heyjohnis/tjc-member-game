import * as data from "../data/rankData.js";

export function registRank(req, res) {
  data.registRank(req, res).then((data) => {
    res.status(200).json(data);
  });
}

export function getRank(req, res) {
  data.getRank(req, res).then((data) => {
    res.status(200).json(data);
  });
}
