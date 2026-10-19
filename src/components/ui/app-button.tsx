import { ActivityIndicator, Pressable, Text } from 'react-native';

type AppButtonProps = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};

export function AppButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  className = '',
}: AppButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      className={`items-center rounded-full py-4 bg-orange-500 ${className}`}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text className="text-base font-medium text-white">{label}</Text>
      )}
    </Pressable>
  );
}
