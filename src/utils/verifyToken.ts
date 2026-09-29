import { jwtDecode } from 'jwt-decode';

type TokenPayload = {
  userId: string;
  name: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwtDecode<TokenPayload>(token);
  } catch {
    return null;
  }
};
