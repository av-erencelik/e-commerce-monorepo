import { z } from 'zod';
import { addProductSchema, preSignedUrlSchema } from '../schemas/product';
import { InferModel } from 'drizzle-orm';
import { category } from '../models/schema';

type PreSignedUrl = z.infer<typeof preSignedUrlSchema>['body'];
type AddProduct = z.infer<typeof addProductSchema>['body'];

type PreSignedUrlImage = PreSignedUrl['images'][number];

type AddCategory = InferModel<typeof category, 'insert'>;

export { PreSignedUrl, PreSignedUrlImage, AddProduct, AddCategory };
