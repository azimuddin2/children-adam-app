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
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

import { useResetPasswordMutation } from '@/redux/features/auth/authApi';
import { logout, selectCurrentToken } from '@/redux/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { verifyToken } from '@/utils/verifyToken';
import {
  ResetPasswordFormValues,
  resetPasswordSchema,
} from '@/validations/reset-password.validation';

export default function ResetPasswordScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectCurrentToken);
  const email = token ? verifyToken(token)?.email : undefined;

  const [resetPassword] = useResetPasswordMutation();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!email) {
      toast.error('Session expired. Please start the reset process again.');
      router.replace('/forgot-password');
      return;
    }

    try {
      const response = await resetPassword({
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      }).unwrap();

      console.log(response.message);

      dispatch(logout());
      toast.success(response.message || 'Password reset successfully');
      router.replace('/login');
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

        <Text className="text-center text-3xl font-bold text-white">
          Reset Password
        </Text>
        <Text className="mt-2 text-center text-sm text-white/90">
          Please enter your new password below.
        </Text>
      </View>

      {/* White form card */}
      <KeyboardAvoidingView
        className="-mt-8 flex-1 rounded-t-[32px] bg-white"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-6 pt-10 pb-20"
        >
          <View className="items-center">
            <Image
              source={require('@/assets/images/reset-password.png')}
              className="h-32 w-32"
              resizeMode="contain"
            />
          </View>

          {/* New Password */}
          <Text className="mb-2 mt-6 text-base font-medium text-gray-900">
            New Password
          </Text>
          <View>
            <Controller
              control={control}
              name="newPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter new password"
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
          {errors.newPassword && (
            <Text className="mt-1 text-sm text-red-500">
              {errors.newPassword.message}
            </Text>
          )}

          {/* Confirm Password */}
          <Text className="mb-2 mt-5 text-base font-medium text-gray-900">
            Confirm Password
          </Text>
          <View>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Re-enter new password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="rounded-xl border border-gray-200 py-4 pl-4 pr-12 text-sm text-gray-900"
                />
              )}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-4 top-0 h-full justify-center"
              accessibilityLabel={
                showConfirmPassword ? 'Hide password' : 'Show password'
              }
            >
              <Ionicons
                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && (
            <Text className="mt-1 text-sm text-red-500">
              {errors.confirmPassword.message}
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
                Reset Password
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
