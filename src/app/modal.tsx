import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function ModalScreen() {
  return (
    <View className="flex-1 items-center justify-center p-5 bg-white dark:bg-slate-900">
      <Text className="text-2xl font-bold text-gray-900 dark:text-white">
        This is a modal
      </Text>
      <Link href="/" dismissTo className="mt-4 py-4">
        <Text className="text-orange-500 font-semibold">Go to home screen</Text>
      </Link>
    </View>
  );
}
