import { MenuItem } from '@/components/ui/menu-item';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type MenuItem = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  route?: string;
  variant?: 'default' | 'danger';
};

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'change-password',
    icon: 'lock-closed-outline',
    label: 'Change Password',
    route: '/change-password',
  },
];

const Settings = () => {
  const insets = useSafeAreaInsets();

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

        <Text className="text-xl font-semibold text-gray-900">Settings</Text>
      </View>
      {/* View Content */}
      <View className="px-6 pb-6">
        {MENU_ITEMS.map((item) => (
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
          icon="trash-outline"
          label="Delete Account"
          iconColor="#EF4444"
          labelColor="#EF4444"
          // onPress={confirmDeleteAccount}
        />
      </View>
    </View>
  );
};

export default Settings;
