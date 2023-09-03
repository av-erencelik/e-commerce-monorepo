import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import config from '../config/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

const s3 = new S3Client({
  credentials: {
    accessKeyId: config.s3.accessKey,
    secretAccessKey: config.s3.secretKey,
  },
  region: config.s3.region,
});

const createPresignedUrl = async (
  imageType: string,
  imageName: string
): Promise<string> => {
  const ex = imageType.split('/')[1];
  const key = uuidv4();
  const command = new PutObjectCommand({
    Bucket: config.s3.bucket,
    Key: `${imageName}-${key}.${ex}`,
    ContentType: `image/${ex}`,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 120 });
  return url;
};

export { s3, createPresignedUrl };
