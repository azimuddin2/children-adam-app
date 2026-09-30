export type TLoginUser = {
  email: string;
  password: string;
  fcmToken?: string;
};

export type TChangePassword = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type TResetPassword = {
  newPassword: string;
  confirmPassword: string;
};
