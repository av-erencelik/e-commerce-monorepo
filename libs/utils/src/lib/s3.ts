import {
  PutObjectCommand,
  S3Client,
  HeadObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getSignedUrl as cloudfrontGetSignedUrl } from '@aws-sdk/cloudfront-signer';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '@e-commerce-monorepo/configs';

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.PUBLIC_ACCESS_KEY!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
  region: process.env.REGION,
});

const createPresignedUrl = async (
  imageType: string,
  imageName: string
): Promise<{ url: string; key: string }> => {
  const ex = imageType.split('/')[1];
  const key = uuidv4();
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET!,
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
    Bucket: process.env.BUCKET!,
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
    Bucket: process.env.BUCKET!,
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
    url: `https://${process.env.CLOUDFRONT_URL!}/${key}`,
    dateLessThan: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID!,
    privateKey:
      process.env.NODE_ENV === 'test'
        ? Buffer.from(process.env.CLOUDFRONT_PRIVATE_KEY!, 'base64').toString(
            'ascii'
          )
        : process.env.CLOUDFRONT_PRIVATE_KEY!,
  });
};

export {
  s3,
  createPresignedUrl,
  checkImageExists,
  deleteImageFromS3,
  createImageUrl,
};
