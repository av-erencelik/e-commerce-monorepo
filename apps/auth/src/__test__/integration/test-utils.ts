import request from 'supertest';
import app from '../../app';

const signIn = async () => {
  const validData = {
    email: 'test@example.com',
    fullName: 'John Doe',
    password: 'password',
    passwordConfirmation: 'password',
    countryCode: 'US',
    phoneNumber: '6204978718',
  };

  const response = await request(app).post('/auth/signup').send(validData);
  const cookies = response.get('Set-Cookie');
  let refreshToken: string | undefined;
  let accessToken: string | undefined;
  for (const cookie of cookies) {
    if (cookie.startsWith('refreshToken=')) {
      refreshToken = cookie.split(';')[0].split('=')[1];
    } else {
      accessToken = cookie.split(';')[0].split('=')[1];
    }
  }

  return {
    refreshToken,
    accessToken,
  };
};

export { signIn };
