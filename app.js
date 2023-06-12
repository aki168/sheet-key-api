// GoogleSheetToJson.js
const fs = require("fs-extra");
const unflatten = require("flat").unflatten;
const { extractSheets } = require("spreadsheet-to-json");
const path = require("path");

extractSheets(
  {
    spreadsheetKey: "1bSVEg07Qrx3w85Qg2uLEAJWzMD7PJeb70TkzzqhMBw0", // target sheet url key
    credentials: require("./token.json"),
    sheetsToExtract: ["登入", "常用"],
  },
  (err, data) => {
    if (err) throw err;
    const read = [...data["登入"], ...data["常用"]];
    const result = {};
    const files = [];

    for (const key in read[0]) {
      if (key !== "key") {
        files.push(key);
        result[key] = {};
      }
    }
    read.forEach((el) => {
      for (const file of files) {
        result[file][el["key"]] = el[file] ? el[file] : "";
      }
    });
    for (const fileName of files) {
      fs.ensureDirSync(
        path.dirname(path.resolve(__dirname, "./language", `${fileName}.json`))
      );
      fs.writeJSONSync(
        path.resolve(__dirname, "./language", `${fileName}.json`),
        unflatten(result[fileName], { object: true }),
        { spaces: 2 }
      );
    }
  }
);
