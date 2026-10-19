import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Terms = () => {
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

        <Text className="text-xl font-semibold text-gray-900">
          Terms of Services
        </Text>
      </View>
      {/* View Content */}
      <View className="px-6 pb-6">
        <Text>This is Terms of Services!</Text>
      </View>
    </View>
  );
};

export default Terms;
