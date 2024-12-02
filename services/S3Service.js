const AWS = require("aws-sdk");
const dotenv = require("dotenv");
dotenv.config();

async function uploadFileToS3(data, filename) {
  try {
    const bucketName = process.env.AWS_BUCKET_NAME;
    const accessKey = process.env.AWS_ACCESS_KEY;
    const secretKey = process.env.AWS_SECRET_ACCESS_KEY;

    const s3bucket = new AWS.S3({
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    });

    const params = {
      Bucket: bucketName,
      Key: filename,
      Body: data,
      ACL: "public-read",
    };

    // Wrap the upload function in a Promise
    const s3Response = await new Promise((resolve, reject) => {
      s3bucket.upload(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    return s3Response.Location;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

module.exports = {
  uploadFileToS3,
};
