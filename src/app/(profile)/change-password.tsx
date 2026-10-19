import { AppButton } from '@/components/ui/app-button';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner-native';
import {
  ChangePasswordFormValues,
  changePasswordSchema,
} from '@/validations/change-password';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useChangePasswordMutation } from '@/redux/features/auth/authApi';
import { TChangePassword, TResponse } from '@/types';

const ChangePassword = () => {
  const insets = useSafeAreaInsets();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const [changePassword] = useChangePasswordMutation();

  const onSubmit = async (values: ChangePasswordFormValues) => {
    try {
      const res = (await changePassword(values)) as TResponse<
        TChangePassword | any
      >;

      if (res.error) {
        toast.error(res?.error?.data?.message);
      } else {
        toast.success(res?.data?.message);
        reset();
      }
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        'An unexpected error occurred during login.';
      toast.error(message);
    }
  };

  return (
    <View className="bg-white flex-1">
      {/* Header */}
      <View
        className="flex-row items-center justify-center px-6 pb-10"
        style={{ paddingTop: insets.top + 12 }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={1}
          className="absolute left-6 h-9 w-9 items-center justify-center rounded-full bg-gray-100"
          style={{ top: insets.top + 12 }}
        >
          <Ionicons name="chevron-back" size={20} color="#111827" />
        </TouchableOpacity>

        <Text className="text-xl font-semibold text-gray-900">
          Change Password
        </Text>
      </View>

      <View className="flex-1">
        <View className="px-6 pb-8">
          <Text className="text-2xl">Change Old Password!</Text>
          <Text className="text-lg mt-1">
            Enter a different password with the previous.
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
            contentContainerClassName="px-6 pt-8 pb-20"
          >
            {/* Old Password */}
            <View>
              <Text className="mb-1 mt-5 text-base font-medium text-gray-900">
                Old Password
              </Text>
              <View>
                <Controller
                  control={control}
                  name="oldPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Enter Old password"
                      placeholderTextColor="#9CA3AF"
                      secureTextEntry={!showOldPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      className="rounded-lg border border-gray-200 py-4 pl-4 pr-12 text-sm text-gray-900"
                    />
                  )}
                />
                <TouchableOpacity
                  onPress={() => setShowOldPassword((prev) => !prev)}
                  activeOpacity={1}
                  className="absolute right-4 top-0 h-full justify-center"
                  accessibilityLabel={
                    showOldPassword ? 'Hide password' : 'Show password'
                  }
                >
                  <Ionicons
                    name={showOldPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
              {errors.oldPassword && (
                <Text className="mt-1 ml-1 text-sm text-red-500">
                  {errors.oldPassword.message}
                </Text>
              )}
            </View>

            {/* New Password */}
            <View>
              <Text className="mb-1 mt-5 text-base font-medium text-gray-900">
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
                      secureTextEntry={!showNewPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      className="rounded-lg border border-gray-200 py-4 pl-4 pr-12 text-sm text-gray-900"
                    />
                  )}
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword((prev) => !prev)}
                  activeOpacity={1}
                  className="absolute right-4 top-0 h-full justify-center"
                  accessibilityLabel={
                    showNewPassword ? 'Hide password' : 'Show password'
                  }
                >
                  <Ionicons
                    name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
              {errors.newPassword && (
                <Text className="mt-1 ml-1 text-sm text-red-500">
                  {errors.newPassword.message}
                </Text>
              )}
            </View>

            {/* Confirm Password */}
            <View>
              <Text className="mb-1 mt-5 text-base font-medium text-gray-900">
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
                      placeholder="Enter Confirm Password"
                      placeholderTextColor="#9CA3AF"
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      className="rounded-lg border border-gray-200 py-4 pl-4 pr-12 text-sm text-gray-900"
                    />
                  )}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword((prev) => !prev)}
                  activeOpacity={1}
                  className="absolute right-4 top-0 h-full justify-center"
                  accessibilityLabel={
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  }
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? 'eye-off-outline' : 'eye-outline'
                    }
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text className="mt-1 ml-1 text-sm text-red-500">
                  {errors.confirmPassword.message}
                </Text>
              )}
            </View>

            {/* Log in button */}
            <AppButton
              label="Update"
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
              className="mt-8"
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default ChangePassword;
