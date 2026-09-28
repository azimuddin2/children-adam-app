import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import PagerView from 'react-native-pager-view';

const slides = [
  {
    image: require('@/assets/images/icon.png'),
    title: 'Connect & Spread',
    highlight: 'Kindness',
    afterHighlight: 'Together',
    subtitle: 'Give Hope, Change Lives',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    image: require('@/assets/images/icon.png'),
    title: 'One Community, Endless',
    highlight: 'Kindness',
    afterHighlight: '',
    subtitle: 'Give Hope, Change Lives',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    image: require('@/assets/images/icon.png'),
    title: 'Connecting Hearts Through',
    highlight: 'Kindness',
    afterHighlight: '',
    subtitle: 'Give Hope, Change Lives',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
];

export default function Onboarding() {
  const pagerRef = useRef<PagerView>(null);
  const [page, setPage] = useState(0);
  const isLast = page === slides.length - 1;

  const finishOnboarding = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    router.replace('/(tabs)');
  };

  return (
    <View className="flex-1 bg-white">
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={(e) => setPage(e.nativeEvent.position)}
      >
        {slides.map((slide, index) => (
          <View key={index} className="flex-1">
            <Image
              source={slide.image}
              className="w-full h-[55%]"
              resizeMode="cover"
            />

            <View className="flex-1 px-6 pt-6">
              {/* Pagination dots */}
              <View className="flex-row gap-1.5 mb-4">
                {slides.map((_, i) => (
                  <View
                    key={i}
                    className={`h-2 rounded-full ${
                      i === page ? 'w-6 bg-orange-500' : 'w-2 bg-gray-200'
                    }`}
                  />
                ))}
              </View>

              <Text className="text-2xl font-bold text-gray-900 leading-8">
                {slide.title}{' '}
                <Text className="text-orange-500 font-bold">
                  {slide.highlight}
                </Text>{' '}
                {slide.afterHighlight}
              </Text>

              <Text className="text-base font-bold text-orange-500 mt-2">
                {slide.subtitle}
              </Text>

              <Text className="text-xs text-gray-500 mt-2 leading-5">
                {slide.description}
              </Text>
            </View>

            <TouchableOpacity
              className="absolute bottom-10 left-6 right-6 bg-orange-500 rounded-full py-4 items-center"
              onPress={() => {
                if (isLast) {
                  finishOnboarding();
                } else {
                  pagerRef.current?.setPage(page + 1);
                }
              }}
            >
              <Text className="text-white font-bold text-base">
                {isLast ? 'Get Started Now' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </PagerView>
    </View>
  );
}
