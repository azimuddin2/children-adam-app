import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

import { useForgotPasswordMutation } from '@/redux/features/auth/authApi';
import { setUser } from '@/redux/features/auth/authSlice';
import { useAppDispatch } from '@/redux/hooks';
import {
  ForgotPasswordFormValues,
  forgotPasswordSchema,
} from '@/validations/forgot-password.validation';

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const [forgotPassword] = useForgotPasswordMutation();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      const response = await forgotPassword(values).unwrap();

      const { accessToken } = response?.data ?? {};

      if (!accessToken) {
        toast.error('Invalid response from server.');
        return;
      }

      dispatch(setUser({ user: null, token: accessToken }));

      toast.success(response.message || 'Reset code sent to your email');
      router.push('/reset-verify-otp');
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        'An unexpected error occurred. Please try again.';
      toast.error(message);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Orange header */}
      <View
        className="h-[30%] justify-center px-6 pb-8"
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

        <Text className="text-center justify-center text-3xl font-bold text-white">
          Forgot Password
        </Text>
        <Text className="mt-2 justify-center text-center text-sm text-white/90">
          Enter your email address, we will send you a code to reset your
          password.
        </Text>
      </View>

      {/* White form card */}
      <KeyboardAvoidingView
        className="-mt-8 flex-1 rounded-t-[32px] bg-white"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="items-center mt-10">
          <Image
            source={require('@/assets/images/forgot-password.png')}
            className="h-32 w-32"
            resizeMode="contain"
          />
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-6 pt-6 pb-20"
        >
          <Text className="mb-2 text-base font-medium text-gray-900">
            E-mail
          </Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter your e-mail"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                className="rounded-xl border border-gray-200 px-4 py-4 text-sm text-gray-900"
              />
            )}
          />
          {errors.email && (
            <Text className="mt-1 text-sm text-red-500">
              {errors.email.message}
            </Text>
          )}

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="mt-8 items-center rounded-full bg-orange-500 py-4"
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-base font-medium text-white">
                Send Reset Code
              </Text>
            )}
          </TouchableOpacity>

          <View className="mt-6 flex-row items-center justify-center gap-1">
            <Text className="text-sm text-gray-700">
              Remember your password?
            </Text>
            <TouchableOpacity onPress={() => router.replace('/login')}>
              <Text className="text-sm font-semibold text-sky-500">Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
