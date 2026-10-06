import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
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
import { useCreateSupportMutation } from '@/redux/features/contact/contactApi';
import {
  ContactUsFormValues,
  contactUsSchema,
} from '@/validations/contact-us.validation';

export default function ContactUsScreen() {
  const insets = useSafeAreaInsets();

  const [createSupport] = useCreateSupportMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactUsFormValues>({
    resolver: zodResolver(contactUsSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  const onSubmit = async (values: ContactUsFormValues) => {
    try {
      const response = await createSupport(values).unwrap();

      toast.success(response.message || 'Message sent successfully');
      reset();
    } catch (error: any) {
      const message =
        error?.data?.message || error?.message || 'Failed to send message.';
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

        <Text className="text-xl font-semibold text-gray-900">Contact Us</Text>
      </View>

      {/* Contact Card */}
      <View className="px-6 pb-6">
        {/* Title */}
        <Text className="text-2xl font-semibold text-orange-600">
          Let's Talk
        </Text>

        {/* Description */}
        <Text className="text-gray-700 text-base leading-6 mb-3 mt-2">
          If you wish to contact us regarding any of our Appeals or donation
          matters then feel free to drop us an email using the form or give us a
          call at our head office.
        </Text>

        {/* Organization & Address */}
        <View className="space-y-1 mb-3">
          <Text className="text-lg font-semibold text-orange-600">
            Children of Adam
          </Text>
          <Text className="text-sm text-gray-600">
            Peterborough - 228 Cromwell Road, Peterborough, PE1 2HG
          </Text>
          <Text className="text-sm text-gray-600">
            Leicester - 13 Francis Street, Leicester, LE2 2BE
          </Text>
        </View>

        {/* Phone & Email Row */}
        <View className="flex-row justify-between pt-2">
          <View className="flex-1">
            <Text className="text-base font-semibold text-orange-600">
              Phone
            </Text>
            <Text className="text-sm text-gray-600 mt-1">0300 321 0032</Text>
          </View>

          <View className="flex-1">
            <Text className="text-base font-semibold text-orange-600">
              Email
            </Text>
            <Text className="text-sm text-gray-600 mt-1">
              info@childrenofadam.net
            </Text>
          </View>
        </View>
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
          <View className="flex-row items-center gap-3">
            {/* First Name */}
            <View className="flex-1">
              <Text className="mb-2 text-base font-semibold text-gray-900">
                First Name
              </Text>
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter your first name"
                    placeholderTextColor="#9CA3AF"
                    className="rounded-xl border border-gray-200 px-4 py-4 text-sm text-gray-900"
                  />
                )}
              />
              {errors.firstName && (
                <Text className="mt-1 text-sm text-red-500">
                  {errors.firstName.message}
                </Text>
              )}
            </View>

            {/* Last Name */}
            <View className="flex-1">
              <Text className="mb-2 text-base font-semibold text-gray-900">
                Last Name
              </Text>
              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter your last name"
                    placeholderTextColor="#9CA3AF"
                    className="rounded-xl border border-gray-200 px-4 py-4 text-sm text-gray-900"
                  />
                )}
              />
              {errors.lastName && (
                <Text className="mt-1 text-sm text-red-500">
                  {errors.lastName.message}
                </Text>
              )}
            </View>
          </View>

          {/* Email */}
          <View className="mt-4">
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
          </View>

          {/* Phone Number */}
          <View>
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
          </View>

          {/* Message */}
          <View className="mt-4">
            <Text className="mb-2 text-base font-semibold text-gray-900">
              Message
            </Text>
            <Controller
              control={control}
              name="message"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter your message"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                  className="min-h-[120px] rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900"
                />
              )}
            />

            {errors.message && (
              <Text className="mt-1 text-sm text-red-500">
                {errors.message.message}
              </Text>
            )}
          </View>

          {/* Save button */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="mt-6 items-center rounded-full bg-orange-500 py-4"
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-base font-medium text-white">Submit</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
