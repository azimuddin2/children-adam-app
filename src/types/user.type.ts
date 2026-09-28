export type TRole = 'user' | 'admin';

export type TStatus = 'ongoing' | 'confirmed' | 'blocked';

export type TGender = 'male' | 'female' | 'other';

export interface IUser {
  _id: string;
  conversationId?: string | null;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  image: string | null;
  gender: TGender;
  country: string;

  password: string;
  needsPasswordChange: boolean;
  passwordChangeAt?: Date;

  role: TRole;
  status: TStatus;

  isVerified: boolean;
  verification: {
    otp: string | number | null;
    expiresAt: Date;
    status: boolean;
  };

  loginWith: 'google' | 'apple' | 'credentials';

  fcmToken?: string;
  notifications: boolean;
  isDeleted: boolean;

  stripeCustomerId?: string;
}
