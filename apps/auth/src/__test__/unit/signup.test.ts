import { signupSchema } from '../../schemas/user';

describe('signupSchema', () => {
  describe('customValidation', () => {
    it('should return an error if passwords do not match', () => {
      const invalidData = {
        email: 'test@example.com',
        fullName: 'John Doe',
        password: 'password',
        passwordConfirmation: 'differentpassword',
        countryCode: 'US',
        phoneNumber: '6204978718',
      };
      const result = signupSchema.safeParse({ body: invalidData });
      expect(result.success).toBe(false);
      if (result.success === false) {
        expect(result.error.issues[0].message).toBe('Passwords do not match');
      }
    });

    it('should return an error if country code is invalid', () => {
      const invalidData = {
        email: 'test@example.com',
        fullName: 'John Doe',
        password: 'password',
        passwordConfirmation: 'password',
        countryCode: '12',
        phoneNumber: '6204978718',
      };
      const result = signupSchema.safeParse({ body: invalidData });
      expect(result.success).toBe(false);
      if (result.success === false) {
        expect(result.error.issues[0].message).toBe('Invalid country code');
      }
    });

    it('should return an error if phone number is invalid', () => {
      const invalidData = {
        email: 'test@example.com',
        fullName: 'John Doe',
        password: 'password',
        passwordConfirmation: 'password',
        countryCode: 'US',
        phoneNumber: 'invalid',
      };
      const result = signupSchema.safeParse({ body: invalidData });
      expect(result.success).toBe(false);
      if (result.success === false) {
        expect(result.error.issues[0].message).toBe('Invalid phone number');
      }
    });

    it('should return an error if phone number is invalid for country code', () => {
      const invalidData = {
        email: 'test@example.com',
        fullName: 'John Doe',
        password: 'password',
        passwordConfirmation: 'password',
        countryCode: 'TR',
        phoneNumber: '6204978718',
      };
      const result = signupSchema.safeParse({ body: invalidData });
      expect(result.success).toBe(false);
      if (result.success === false) {
        expect(result.error.issues[0].message).toBe('Invalid phone number');
      }
    });

    it('should return success if all data is valid', () => {
      const validData = {
        email: 'test@example.com',
        fullName: 'John Doe',
        password: 'password',
        passwordConfirmation: 'password',
        countryCode: 'US',
        phoneNumber: '6204978718',
      };
      const result = signupSchema.safeParse({ body: validData });
      if (result.success === false) {
        console.log(result.error.issues);
      }
      expect(result.success).toBe(true);
    });
  });
});
