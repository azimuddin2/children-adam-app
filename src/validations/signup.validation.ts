import { z } from 'zod';

export const signupSchema = z.object({
  fullName: z.string().min(1, 'Full Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type SignupFormValues = z.infer<typeof signupSchema>;
