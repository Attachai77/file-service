import * as process from 'process';

export default () => ({
  PORT: parseInt(process.env.PORT, 10) || 3000,
  database: {
    AWS_S3_REGION: process.env.AWS_S3_REGION,
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
    AWS_S3_ACCESS_KEY_ID: process.env.AWS_S3_ACCESS_KEY_ID,
    AWS_S3_SECRET_ACCESS_KEY: process.env.AWS_S3_SECRET_ACCESS_KEY,
    UPLOAD_RATE_TTL: process.env.UPLOAD_RATE_TTL,
    UPLOAD_RATE_LIMIT: process.env.UPLOAD_RATE_LIMIT,
    UPLOAD_SIZE_LIMIT: process.env.UPLOAD_SIZE_LIMIT,
    UPLOAD_MIMETYPES: process.env.UPLOAD_MIMETYPES,
  }
});