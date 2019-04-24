const { readFile } = require("fs");
exports.readFileAsArray = (file, cb = () => {}) => {
  return new Promise((resolve, reject) => {
    readFile(file, (err, data) => {
      if (err) {
        reject(err);
        return cb(err);
      }
      const lines = data
        .toString()
        .trim()
        .split("\n");
      resolve(lines);
      cb(null, lines);
    });
  });
};
