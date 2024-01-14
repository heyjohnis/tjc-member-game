import * as data from "../data/memberData.js";

export function getDaebangPic(req, res) {
  data.getDaebangPic(req, res).then((data) => {
    console.log("getDaebangPic: ", data);
    res.status(200).json(data);
  });
}
