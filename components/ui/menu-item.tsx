import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type MenuItemProps = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    iconColor?: string;
    labelColor?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    testID?: string;
};

export function MenuItem({
    icon,
    label,
    iconColor = '#374151',
    labelColor = '#111827',
    onPress,
    rightElement,
    testID,
}: MenuItemProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={!onPress && !rightElement}
            testID={testID}
            accessibilityRole="button"
            accessibilityLabel={label}
            className="flex-row items-center justify-between py-4 border-b border-gray-100"
        >
            <View className="flex-row items-center gap-3">
                <Ionicons name={icon} size={20} color={iconColor} />
                <Text className="text-base" style={{ color: labelColor }}>
                    {label}
                </Text>
            </View>
            {rightElement ?? <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />}
        </TouchableOpacity>
    );
}