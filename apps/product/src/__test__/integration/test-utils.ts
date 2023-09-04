import { AccessTokenPayload, createTokens } from '@e-commerce-monorepo/utils';

const signin = () => {
  const validData = {
    email: 'test@example.com',
    fullName: 'John Doe',
    isAdmin: true,
    userId: '1234567890',
    verificated: true,
  } as AccessTokenPayload;

  const { accessToken } = createTokens(validData);

  return accessToken;
};

export { signin };
