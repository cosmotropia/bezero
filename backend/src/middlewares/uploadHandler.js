const multer = require("multer");
const path = require("path");
const { s3, BUCKET_NAME } = require("../config/s3");
const multerS3 = require("multer-s3");

const isProduction = process.env.NODE_ENV === "production"

let storage;

if (isProduction) {
  storage = multerS3({
    s3: s3,
    bucket: BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, `uploads/${fileName}`);
    },
  });
} else {
  const uploadPath = path.join(__dirname, "../public/uploads");

  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
}
const upload = multer({ storage });

module.exports = upload;
