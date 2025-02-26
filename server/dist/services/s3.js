"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromS3 = exports.uploadToS3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3Client = new client_s3_1.S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    }
});
const BUCKET_NAME = process.env.AWS_BUCKET_NAME || '';
const uploadToS3 = async (fileBuffer, fileName) => {
    console.log('uploading to s3', fileName);
    try {
        const command = new client_s3_1.PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fileName,
            Body: fileBuffer,
            ContentType: 'image/jpeg'
        });
        await s3Client.send(command);
        return `https://${BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
    }
    catch (error) {
        console.error('Error uploading to S3:', error);
        throw new Error('Failed to upload file to S3');
    }
};
exports.uploadToS3 = uploadToS3;
const deleteFromS3 = async (fileUrl) => {
    try {
        const fileName = fileUrl.split('/').pop();
        if (!fileName) {
            throw new Error('Invalid file URL');
        }
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fileName
        });
        await s3Client.send(command);
    }
    catch (error) {
        console.error('Error deleting from S3:', error);
        throw new Error('Failed to delete file from S3');
    }
};
exports.deleteFromS3 = deleteFromS3;
