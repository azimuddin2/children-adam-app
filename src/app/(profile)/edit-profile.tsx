import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
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

import PhoneInput from '@/components/ui/phone-input';
import { GENDER_OPTIONS } from '@/constants/gender';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from '@/redux/features/user/userApi';
import { useAppSelector } from '@/redux/hooks';
import {
  EditProfileFormValues,
  editProfileSchema,
} from '@/validations/edit-profile.validation';

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const currentUser = useAppSelector(selectCurrentUser);
  const email = currentUser?.email ?? '';

  const [genderModalVisible, setGenderModalVisible] = useState(false);

  const { data, refetch } = useGetUserProfileQuery();
  const userData = data?.data;

  const [updateUserProfile] = useUpdateUserProfileMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: '',
      gender: 'male',
      address: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (userData) {
      reset({
        fullName: userData.fullName || '',
        gender: (userData.gender as EditProfileFormValues['gender']) || 'male',
        address: userData.address || '',
        phone: userData.phone || '',
      });
    }
  }, [userData, reset]);

  const onSubmit = async (values: EditProfileFormValues) => {
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify(values));

      const response = await updateUserProfile({
        body: formData,
      }).unwrap();

      toast.success(response.message || 'Profile updated successfully');
      refetch();
    } catch (error: any) {
      const message =
        error?.data?.message || error?.message || 'Failed to update profile.';
      toast.error(message);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View
        className="flex-row items-center justify-center px-6 pb-10"
        style={{ paddingTop: insets.top + 12 }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute left-6 h-9 w-9 items-center justify-center rounded-full bg-gray-100"
          style={{ top: insets.top + 12 }}
        >
          <Ionicons name="chevron-back" size={20} color="#111827" />
        </TouchableOpacity>

        <Text className="text-xl font-semibold text-gray-900">
          Edit Profile
        </Text>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-6 pt-4 pb-20"
        >
          {/* Full Name */}
          <Text className="mb-2 text-base font-semibold text-gray-900">
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
                className="rounded-xl border border-gray-200 px-4 py-4 text-sm text-gray-900"
              />
            )}
          />
          {errors.fullName && (
            <Text className="mt-1 text-sm text-red-500">
              {errors.fullName.message}
            </Text>
          )}

          {/* Gender */}
          <Text className="mb-2 mt-5 text-base font-semibold text-gray-900">
            Gender
          </Text>

          <Controller
            control={control}
            name="gender"
            render={({ field: { onChange, value } }) => (
              <View>
                <TouchableOpacity
                  onPress={() => setGenderModalVisible(!genderModalVisible)}
                  className="flex-row items-center justify-between rounded-xl border border-gray-200 px-4 py-4"
                >
                  <Text className="text-sm text-gray-900">
                    {GENDER_OPTIONS.find((g) => g.value === value)?.label ||
                      'Select gender'}
                  </Text>

                  <Ionicons
                    name={genderModalVisible ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color="#6B7280"
                  />
                </TouchableOpacity>

                {genderModalVisible && (
                  <View className="mt-2 rounded-xl border border-gray-200 bg-white">
                    {GENDER_OPTIONS.map((option) => {
                      const isSelected = value === option.value;

                      return (
                        <TouchableOpacity
                          key={option.value}
                          onPress={() => {
                            onChange(option.value);
                            setGenderModalVisible(false);
                          }}
                          className="flex-row items-center justify-between px-4 py-4"
                        >
                          <Text className="text-sm text-gray-900">
                            {option.label}
                          </Text>

                          {isSelected && (
                            <Ionicons
                              name="checkmark"
                              size={20}
                              color="#111827"
                            />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            )}
          />

          {errors.gender && (
            <Text className="mt-1 text-sm text-red-500">
              {errors.gender.message}
            </Text>
          )}

          {/* Address */}
          <Text className="mb-2 mt-5 text-base font-semibold text-gray-900">
            Address
          </Text>
          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter your address"
                placeholderTextColor="#9CA3AF"
                className="rounded-xl border border-gray-200 px-4 py-4 text-sm text-gray-900"
              />
            )}
          />
          {errors.address && (
            <Text className="mt-1 text-sm text-red-500">
              {errors.address.message}
            </Text>
          )}

          {/* Email (read-only) */}
          <Text className="mb-2 mt-5 text-base font-semibold text-gray-900">
            Email
          </Text>
          <TextInput
            value={email}
            editable={false}
            className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-400"
          />

          {/* Phone Number */}
          <Text className="mb-2 mt-5 text-base font-semibold text-gray-900">
            Phone Number
          </Text>

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <PhoneInput
                value={value || ''}
                onChange={onChange}
                onBlur={onBlur}
                placeholder="Enter your phone number"
              />
            )}
          />

          {errors.phone && (
            <Text className="mt-1 text-sm text-red-500">
              {errors.phone.message}
            </Text>
          )}

          {/* Save button */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="mt-10 items-center rounded-full bg-orange-500 py-4"
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-base font-medium text-white">
                Save & Update
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}