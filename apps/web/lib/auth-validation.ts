import { z } from 'zod';

// Password validation schema: minimum 8 chars, uppercase, number, special char
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .refine(
    (pwd) => /[A-Z]/.test(pwd),
    'Password must contain at least one uppercase letter'
  )
  .refine(
    (pwd) => /[0-9]/.test(pwd),
    'Password must contain at least one number'
  )
  .refine(
    (pwd) => /[!@#$%^&*()_+\-=\[\]{};:'",.<>?/\\|`~]/.test(pwd),
    'Password must contain at least one special character (!@#$%^&* etc.)'
  );

// Email validation schema
export const emailSchema = z
  .string()
  .email('Invalid email format')
  .max(254, 'Email must be less than 254 characters')
  .toLowerCase();

// Name validation schema: allow letters, spaces, hyphens, apostrophes
export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(50, 'Name must be less than 50 characters')
  .refine(
    (name) => /^[a-zA-Z\s'-]+$/.test(name),
    'Name can only contain letters, spaces, hyphens, and apostrophes'
  );

// server-side validation for all info except client-side confirmPassword validation
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  address: z.string().min(5, 'Address must be at least 5 characters').max(255),
  city: z.string().min(2, 'City must be at least 2 characters').max(50),
  state: z.string().min(2, 'State must be at least 2 characters').max(50),
  country: z.string().min(2, 'Country must be at least 2 characters').max(50),
});

export type SignupInput = z.infer<typeof signupSchema>;

// validate signup
export function validateSignupInput(data: unknown) {
  try {
    const validated = signupSchema.parse(data);
    return { valid: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { valid: false, errors };
    }
    return { valid: false, errors: { general: 'Validation failed' } };
  }
}

// check if email in use
export async function validateEmailUnique(email: string, prisma: any) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  return !existingUser;
}

// sanitise
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .slice(0, 255); // Limit length
}
