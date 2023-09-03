import { PreSignedUrlImage } from '../interfaces/product';
import { createPresignedUrl } from '../lib/s3';

const getPreSignedUrl = async (images: PreSignedUrlImage[]) => {
  const urls: string[] = [];
  for (const image of images) {
    const url = await createPresignedUrl(image.type, image.name);
    urls.push(url);
  }
  return urls;
};

export default Object.freeze({
  getPreSignedUrl,
});
