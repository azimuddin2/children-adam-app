import { router } from 'expo-router';
import { Image, Text, TouchableOpacity } from 'react-native';
import { toast } from 'sonner-native';

import { setUser, TUser } from '@/redux/features/auth/authSlice';
import { useAppDispatch } from '@/redux/hooks';
import { verifyToken } from '@/utils/verifyToken';

type Provider = 'google' | 'apple';

const PROVIDER_CONFIG: Record<Provider, { icon: number; label: string }> = {
  google: {
    icon: require('@/assets/images/google.png'),
    label: 'Login with Google',
  },
  apple: {
    icon: require('@/assets/images/apple.png'),
    label: 'Login with apple',
  },
};

type SocialLoginButtonProps = {
  provider: Provider;
};

export function SocialLoginButton({ provider }: SocialLoginButtonProps) {
  const dispatch = useAppDispatch();
  const { icon, label } = PROVIDER_CONFIG[provider];

  const handleAuthSuccess = (response: any) => {
    const accessToken = response?.data?.accessToken;
    if (!accessToken) {
      toast.error('Access token missing from server response.');
      return;
    }

    const user = verifyToken(accessToken) as TUser;
    dispatch(setUser({ user, token: accessToken }));
    toast.success(response.message || 'Login successful');
    router.replace('/(tabs)');
  };

  const handlePress = async () => {
    try {
      if (provider === 'google') {
        // TODO: Google Sign-In SDK দিয়ে idToken আনো
        // const { idToken } = await GoogleSignin.signIn();
        // const response = await googleAuth({ idToken }).unwrap();
        // handleAuthSuccess(response);
      }

      if (provider === 'apple') {
        // TODO: expo-apple-authentication দিয়ে credential আনো
        // const credential = await AppleAuthentication.signInAsync({...});
        // const response = await appleAuth({ identityToken: credential.identityToken }).unwrap();
        // handleAuthSuccess(response);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || `${label} failed. Please try again.`);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="mb-3 flex-row items-center justify-center gap-2 rounded-full border border-gray-200 py-4"
    >
      <Image source={icon} className="h-5 w-5" resizeMode="contain" />
      <Text className="text-sm text-gray-900">{label}</Text>
    </TouchableOpacity>
  );
}
