import {
  PutObjectCommand,
  S3Client,
  HeadObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import config from '../config/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getSignedUrl as cloudfrontGetSignedUrl } from '@aws-sdk/cloudfront-signer';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '@e-commerce-monorepo/configs';

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
): Promise<{ url: string; key: string }> => {
  const ex = imageType.split('/')[1];
  const key = uuidv4();
  const command = new PutObjectCommand({
    Bucket: config.s3.bucket,
    Key: `${imageName}-${key}.${ex}`,
    ContentType: `image/${ex}`,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 120 });
  return {
    url,
    key: `${imageName}-${key}.${ex}`,
  };
};

const checkImageExists = async (key: string) => {
  const command = new HeadObjectCommand({
    Bucket: config.s3.bucket,
    Key: key,
  });
  try {
    const response = await s3.send(command);
    logger.info(response);
    if (response.$metadata.httpStatusCode === 200) return true;
  } catch (e) {
    logger.error(e);
    return false;
  }
};

const deleteImageFromS3 = async (key: string) => {
  const command = new DeleteObjectCommand({
    Bucket: config.s3.bucket,
    Key: key,
  });
  try {
    await s3.send(command);
    return true;
  } catch (e) {
    logger.error(e);
    return false;
  }
};

const createImageUrl = (key: string) => {
  return cloudfrontGetSignedUrl({
    url: `https://${config.cdn.url}/${key}`,
    dateLessThan: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    keyPairId: config.cdn.keyPairId,
    privateKey:
      config.env === 'test'
        ? Buffer.from(config.cdn.privateKey, 'base64').toString('ascii')
        : config.cdn.privateKey,
  });
};

export {
  s3,
  createPresignedUrl,
  checkImageExists,
  deleteImageFromS3,
  createImageUrl,
};
