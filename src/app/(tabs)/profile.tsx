import { MenuItem } from '@/components/ui/menu-item';
import { PROFILE_MENU_ITEMS } from '@/constants/profile-menu';
import { useLogoutMutation } from '@/redux/features/auth/authApi';
import { logout, selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const dispatch = useAppDispatch();
  const [logoutApi] = useLogoutMutation();

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
          <TouchableOpacity
            className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 border border-gray-200"
            onPress={() => router.push('/edit-profile')}
            accessibilityLabel="Edit profile picture"
          >
            <Ionicons name="pencil" size={14} color="#374151" />
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
