const {S3Client} = require("@aws-sdk/client-s3");
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

const s3 = new S3Client({
    region: process.env.AWS_BUCKET_REGION,
    credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
  }
})
const BUCKET_NAME = process.env.AWS_BUCKET_NAME

module.exports = { s3, BUCKET_NAME }
