import { preSignedUrlSchema } from '../schemas/product';

type PreSignedUrl = z.infer<typeof preSignedUrlSchema>['body'];

type PreSignedUrlImage = PreSignedUrl['images'][number];

export { PreSignedUrl, PreSignedUrlImage };
