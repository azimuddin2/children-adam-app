import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

import { SocialLoginButton } from '@/components/ui/social-login-button';
import { setUser } from '@/redux/features/auth/authSlice';
import { useSignUpMutation } from '@/redux/features/user/userApi';
import { useAppDispatch } from '@/redux/hooks';
import {
  SignupFormValues,
  signupSchema,
} from '@/validations/signup.validation';

export default function SignUpScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const [signUp] = useSignUpMutation();

  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    try {
      const response = await signUp(values).unwrap();

      const { accessToken } = response?.data ?? {};

      if (!accessToken) {
        toast.error('Invalid response from server.');
        return;
      }

      // user এখনও verify হয়নি, শুধু token সেভ করছি
      dispatch(setUser({ user: null, token: accessToken }));

      toast.success(response.message || 'Signup successful');
      router.push('/verify-otp');
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        'An unexpected error occurred during signup.';
      toast.error(message);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Orange header */}
      <View
        className="h-[32%] items-center justify-center"
        style={{ paddingTop: insets.top }}
      >
        <LinearGradient
          colors={['#F9A62B', '#F26A1B']}
          style={StyleSheet.absoluteFill}
        />
        <Image
          source={require('@/assets/images/logo.png')}
          className="absolute w-24 h-9"
          style={{ top: insets.top + 12 }}
          resizeMode="contain"
        />
        <Text className="text-4xl font-bold text-white">Sign Up</Text>
      </View>

      {/* White form card */}
      <KeyboardAvoidingView
        className="-mt-8 flex-1 rounded-t-[32px] bg-white"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-6 pt-8 pb-20"
        >
          {/* Full Name */}
          <Text className="mb-2 text-base font-medium text-gray-900">
            Full Name
          </Text>
          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
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

          {/* Email */}
          <Text className="mb-2 mt-3 text-base font-medium text-gray-900">
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

          {/* Password */}
          <Text className="mb-2 mt-3 text-base font-medium text-gray-900">
            Password
          </Text>
          <View>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="rounded-xl border border-gray-200 py-4 pl-4 pr-12 text-sm text-gray-900"
                />
              )}
            />
            <TouchableOpacity
              onPress={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-0 h-full justify-center"
              accessibilityLabel={
                showPassword ? 'Hide password' : 'Show password'
              }
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </Text>
          )}

          {/* Log in button */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="mt-6 items-center rounded-full bg-orange-500 py-4"
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-base font-medium text-white">Sign Up</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View className="my-6 flex-row items-center gap-3">
            <View className="h-px flex-1 bg-gray-300" />
            <Text className="text-sm text-gray-700">Or</Text>
            <View className="h-px flex-1 bg-gray-300" />
          </View>

          {/* Social buttons */}
          <SocialLoginButton provider="apple" />
          <SocialLoginButton provider="google" />

          {/* Bottom text */}
          <View className="mt-3 flex-row items-center justify-center gap-1">
            <Text className="text-sm text-gray-700">
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text className="text-sm font-semibold text-sky-500">Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
