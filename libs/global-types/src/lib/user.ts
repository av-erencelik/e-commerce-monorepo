import { z } from 'zod';
import parsePhoneNumber, {
  CountryCode,
  isSupportedCountry,
} from 'libphonenumber-js';

export type UserPayload = {
  userId: string;
  email: string;
  verificated: boolean;
  fullName: string;
  isAdmin: boolean;
};

export const signupSchema = z
  .object({
    email: z.string().trim().email('Please enter a valid email address.'),
    fullName: z
      .string()
      .trim()
      .min(2, "Your full name can't be shorter than two letters")
      .max(256, "Your full name can't be longer than 256 letters"),
    password: z
      .string()
      .trim()
      .min(8, 'Password must contain at least 8 letters')
      .max(64, "Password can't be longer than 64 letters"),
    passwordConfirmation: z
      .string()
      .min(8, 'Password must contain at least 8 letters')
      .max(64, "Password can't be longer than 64 letters"),
    countryCode: z
      .string()
      .trim()
      .min(2, 'Please select valid country')
      .max(2, 'Please select valid country'),
    phoneNumber: z.string().trim(),
  })
  .superRefine(
    ({ password, passwordConfirmation, phoneNumber, countryCode }, ctx) => {
      if (password !== passwordConfirmation) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Passwords do not match',
          path: ['passwordConfirmation'],
        });
        return z.NEVER;
      }
      if (!isSupportedCountry(countryCode)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid country code',
          path: ['countryCode'],
        });
        return z.NEVER;
      }
      const number = parsePhoneNumber(phoneNumber, countryCode as CountryCode);
      if (number === undefined || !number.isValid()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid phone number',
          path: ['phoneNumber'],
        });
        return z.NEVER;
      }
    }
  )
  .transform(
    ({
      email,
      password,
      passwordConfirmation,
      phoneNumber,
      fullName,
      countryCode,
    }) => ({
      email,
      password,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      phoneNumber: parsePhoneNumber(
        phoneNumber,
        countryCode as CountryCode
      )!.formatNational(),
      countryCode,
      fullName,
      passwordConfirmation,
    })
  );

export const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address.'),
  password: z
    .string()
    .trim()
    .min(8, 'Password must contain at least 8 letters')
    .max(64, "Password can't be longer than 64 letters"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address.'),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .trim()
      .min(8, 'Password must contain at least 8 letters')
      .max(64, "Password can't be longer than 64 letters"),
    passwordConfirmation: z
      .string()
      .min(8, 'Password must contain at least 8 letters')
      .max(64, "Password can't be longer than 64 letters"),
  })
  .superRefine(({ password, passwordConfirmation }, ctx) => {
    if (password !== passwordConfirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['passwordConfirmation'],
      });
      return z.NEVER;
    }
  });

export const updateUserSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Your full name can't be shorter than two letters")
      .max(256, "Your full name can't be longer than 256 letters"),
    countryCode: z
      .string()
      .trim()
      .min(2, 'Please select valid country')
      .max(2, 'Please select valid country'),
    phoneNumber: z.string().trim(),
    email: z
      .string()
      .trim()
      .email('Please enter a valid email address.')
      .optional(),
  })
  .superRefine(({ phoneNumber, countryCode }, ctx) => {
    if (!isSupportedCountry(countryCode)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid country code',
        path: ['countryCode'],
      });
      return z.NEVER;
    }
    const number = parsePhoneNumber(phoneNumber, countryCode as CountryCode);
    if (number === undefined || !number.isValid()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid phone number',
        path: ['phoneNumber'],
      });
      return z.NEVER;
    }
  })
  .transform(({ phoneNumber, countryCode, fullName, email }) => ({
    fullName,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    phoneNumber: parsePhoneNumber(
      phoneNumber,
      countryCode as CountryCode
    )!.formatNational(),
    countryCode,
    email,
  }));
