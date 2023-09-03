import { z } from 'zod';
import { addProductSchema, preSignedUrlSchema } from '../schemas/product';

type PreSignedUrl = z.infer<typeof preSignedUrlSchema>['body'];
type AddProduct = z.infer<typeof addProductSchema>['body'];

type PreSignedUrlImage = PreSignedUrl['images'][number];

export { PreSignedUrl, PreSignedUrlImage, AddProduct };
