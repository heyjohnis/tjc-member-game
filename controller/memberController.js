import * as data from "../data/memberData.js";

export function getDaebangPic(req, res) {
  data.getDaebangPic(req, res).then((data) => {
    res.status(200).json(data);
  });
}
