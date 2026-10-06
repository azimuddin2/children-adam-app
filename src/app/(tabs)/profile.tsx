import { MenuItem } from '@/components/ui/menu-item';
import { PROFILE_MENU_ITEMS } from '@/constants/profile-menu';
import { useLogoutMutation } from '@/redux/features/auth/authApi';
import { logout, selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useUpdateUserPictureMutation } from '@/redux/features/user/userApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { toast } from 'sonner-native';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const dispatch = useAppDispatch();
  const [logoutApi] = useLogoutMutation();
  const [updateUserPicture, { isLoading: isUploadingPicture }] =
    useUpdateUserPictureMutation();

  const user = useAppSelector(selectCurrentUser);

  const handleSignOut = async () => {
    try {
      await logoutApi().unwrap();
    } catch (error) {
      console.log('Logout API call failed:', error);
    } finally {
      dispatch(logout());
      router.replace('/login');
    }
  };

  const handleChangePicture = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (result.canceled || !result.assets?.[0]) {
        return;
      }

      const asset = result.assets[0];

      const fileName =
        asset.fileName || asset.uri.split('/').pop() || 'profile.jpg';

      // File type detection handle
      const match = /\.(\w+)$/.exec(fileName);
      const type = match ? `image/${match[1]}` : asset.mimeType || 'image/jpeg';

      const formData = new FormData();

      // React Native-এ File Upload এর জন্য object টি সঠিক Format-এ থাকতে হবে
      formData.append('profile', {
        uri: asset.uri,
        name: fileName,
        type: type,
      } as any);

      // Mutation call (সরাসরি formData পাস করুন)
      const response = await updateUserPicture(formData).unwrap();

      console.log('UPLOAD SUCCESS:', response);

      toast.success(
        response.message || 'Profile picture updated successfully.'
      );
    } catch (error: any) {
      console.log('UPLOAD ERROR:', error);
      toast.error(error?.data?.message || 'Failed to update profile picture.');
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <Text className="text-center text-lg font-semibold mt-20 mb-5">
        Profile
      </Text>

      <View className="items-center mb-6">
        <View className="relative">
          <Image
            source={{
              uri: user?.image || 'https://i.pravatar.cc/150?img=12',
            }}
            className="w-24 h-24 rounded-full"
          />

          {isUploadingPicture && (
            <View className="absolute inset-0 items-center justify-center rounded-full bg-black/40">
              <ActivityIndicator color="#FFFFFF" />
            </View>
          )}

          <TouchableOpacity
            className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 border border-gray-200"
            onPress={handleChangePicture}
            disabled={isUploadingPicture}
            accessibilityLabel="Change profile picture"
          >
            <Ionicons name="camera" size={14} color="#374151" />
          </TouchableOpacity>
        </View>
        <Text className="text-lg font-semibold mt-3">
          {user?.fullName || 'Guest'}
        </Text>
      </View>

      <View className="px-5">
        {PROFILE_MENU_ITEMS.map((item) => (
          <MenuItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            onPress={
              item.route ? () => router.push(item.route as any) : undefined
            }
          />
        ))}

        <MenuItem
          icon="notifications-outline"
          label="Notifications"
          rightElement={
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#D1D5DB', true: '#0D9488' }}
              thumbColor="#FFFFFF"
            />
          }
        />

        <MenuItem
          icon="log-out-outline"
          label="Sign Out"
          iconColor="#EF4444"
          labelColor="#EF4444"
          onPress={handleSignOut}
        />
      </View>
    </ScrollView>
  );
}