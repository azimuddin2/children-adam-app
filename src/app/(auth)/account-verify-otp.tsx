import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

import { logout, selectCurrentToken } from '@/redux/features/auth/authSlice';
import {
  useResendOtpMutation,
  useVerifyOtpMutation,
} from '@/redux/features/otp/otpApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { verifyToken } from '@/utils/verifyToken';

const OTP_LENGTH = 6;
const EMPTY_OTP = Array(OTP_LENGTH).fill('');

export default function AccountVerifyOtpScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectCurrentToken);
  const email = token ? verifyToken(token)?.email : undefined;

  const [digits, setDigits] = useState<string[]>(EMPTY_OTP);
  const inputsRef = useRef<Array<TextInput | null>>([]);

  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  const otp = digits.join('');
  const isComplete = otp.length === OTP_LENGTH;

  const resetOtpInput = () => {
    setDigits(EMPTY_OTP);
    inputsRef.current[0]?.focus();
  };

  const handleChangeDigit = (value: string, index: number) => {
    const clean = value.replace(/[^0-9]/g, '');

    const next = [...digits];
    next[index] = clean.slice(-1);
    setDigits(next);

    if (clean && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    try {
      const response = await verifyOtp({ otp }).unwrap();
      toast.success(response.message || 'Verified successfully');

      dispatch(logout());
      router.replace('/login');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Invalid or expired OTP.');
      resetOtpInput();
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error('Unable to find your email. Please login again.');
      return;
    }

    try {
      await resendOtp(email).unwrap();
      resetOtpInput();
      toast.success('OTP resent to your email');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to resend OTP');
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Orange header */}
      <View
        className="h-[34%] px-6 pb-8 justify-center"
        style={{ paddingTop: insets.top }}
      >
        <LinearGradient
          colors={['#F9A62B', '#F26A1B']}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}
        />

        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute left-6 h-9 w-9 items-center justify-center rounded-full bg-white"
          style={{ top: insets.top + 16 }}
        >
          <Ionicons name="chevron-back" size={20} color="#111827" />
        </TouchableOpacity>

        <Text className="text-center text-3xl font-bold text-white">
          Email Verification
        </Text>
        <Text className="mt-2 text-center text-sm text-white/90">
          Please enter the 6-digit code sent to your phone number.
        </Text>
      </View>

      {/* White card */}
      <View className="-mt-8 flex-1 items-center rounded-t-[32px] bg-white px-6 pt-10">
        <Image
          source={require('@/assets/images/otp-illustration.png')}
          className="h-32 w-32"
          resizeMode="contain"
        />

        {/* OTP boxes */}
        <View className="mt-8 flex-row gap-2">
          {digits.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputsRef.current[index] = ref;
              }}
              value={digit}
              onChangeText={(value) => handleChangeDigit(value, index)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(nativeEvent.key, index)
              }
              keyboardType="number-pad"
              maxLength={1}
              className="h-12 w-12 rounded-full border border-gray-300 text-center text-lg text-gray-900"
            />
          ))}
        </View>

        {/* Resend */}
        <TouchableOpacity
          onPress={handleResend}
          disabled={isResending}
          className="mt-4"
        >
          <Text className="text-base text-gray-500 mt-2">
            If you didn&apos;t receive a code,{' '}
            <Text className="text-orange-500 font-medium">
              {isResending ? 'Sending...' : 'Resend'}
            </Text>
          </Text>
        </TouchableOpacity>

        {/* Continue button */}
        <TouchableOpacity
          onPress={handleVerify}
          disabled={!isComplete || isVerifying}
          className={`mt-8 w-full items-center rounded-full py-4 ${
            isComplete ? 'bg-orange-500' : 'bg-orange-200'
          }`}
        >
          {isVerifying ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-base font-medium text-white">Verify</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
