import { z } from 'zod';

export const editProfileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  gender: z.enum(['male', 'female', 'other']),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().min(10, 'Enter a valid phone number'),
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;
