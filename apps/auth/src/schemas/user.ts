import { z } from 'zod';
import parsePhoneNumber, {
  CountryCode,
  isSupportedCountry,
} from 'libphonenumber-js';
const signupSchema = z.object({
  body: z
    .object({
      email: z.string().trim().email(),
      fullName: z.string().trim().min(2).max(256),
      password: z.string().trim().min(8).max(64),
      passwordConfirmation: z.string().min(8).max(64),
      countryCode: z.string().trim().min(2).max(2),
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
        const number = parsePhoneNumber(
          phoneNumber,
          countryCode as CountryCode
        );
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
    ),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email(),
    password: z.string().trim().min(8).max(64),
  }),
});

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().trim().email(),
  }),
});

const resetPasswordSchema = z.object({
  body: z
    .object({
      password: z.string().trim().min(8).max(64),
      passwordConfirmation: z.string().trim().min(8).max(64),
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
    }),
  query: z.object({
    token: z.string().uuid(),
  }),
});

export { signupSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema };
