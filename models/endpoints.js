const fs = require("fs");

exports.fetchEndpoints = cb => {
  fs.readFile("./endpoints.json", "utf8", (err, res) => {
    cb(null, JSON.parse(res));
  });
};
