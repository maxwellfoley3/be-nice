import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || '';

export const uploadToS3 = async (fileBuffer: Buffer, fileName: string): Promise<string> => {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: 'image/jpeg'
    });

    await s3Client.send(command);
    return `https://${BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Failed to upload file to S3');
  }
};

export const deleteFromS3 = async (fileUrl: string): Promise<void> => {
  try {
    const fileName = fileUrl.split('/').pop();
    if (!fileName) {
      throw new Error('Invalid file URL');
    }

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName
    });

    await s3Client.send(command);
  } catch (error) {
    console.error('Error deleting from S3:', error);
    throw new Error('Failed to delete file from S3');
  }
};
