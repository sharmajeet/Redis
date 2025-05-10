// s3-helpers.js
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
require('dotenv').config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadToS3 = async (file) => {
  const { PutObjectCommand } = require('@aws-sdk/client-s3');
  const fileName = `${Date.now()}_${file.originalname}`;
  const bucket = process.env.AWS_BUCKET_NAME;

  const uploadParams = {
    Bucket: bucket,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(uploadParams);
  await s3.send(command);

  const url = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  return { url, publicId: fileName, bucket, key: fileName };
};

const generateGetSignedUrl = async ({ Bucket, Key, Expires }) => {
  const command = new GetObjectCommand({ Bucket, Key });
  return getSignedUrl(s3, command, { expiresIn: Expires }); 
};

module.exports = { uploadToS3, generateGetSignedUrl };