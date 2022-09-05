const multer = require("multer");
const util = require("util");

const excelFilter = (req, file, cb) => {
  if (
    file.mimetype.includes("excel") ||
    file.mimetype.includes("spreadsheetml")
  ) {
    cb(null, true);
  } else {
    cb("Please upload only excel file.", false);
  }
};

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "./public/resources/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

let memory = multer.memoryStorage({
  Buffer: (req, cb) => {
    cb(null, '');
  }
});

let uploadFile = multer({ storage: memory, fileFilter: excelFilter });

module.exports = uploadFile;