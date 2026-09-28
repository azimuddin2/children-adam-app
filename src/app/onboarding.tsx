import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { session } from '@/utils/session';

const slides = [
  {
    image: require('@/assets/images/onboarding-screen1.png'),
    title: 'Connect & Spread',
    highlight: 'Kindness',
    afterHighlight: 'Together',
    subtitle: 'Give Hope, Change Lives',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    image: require('@/assets/images/onboarding-screen2.png'),
    title: 'One Community, Endless',
    highlight: 'Kindness',
    afterHighlight: '',
    subtitle: 'Give Hope, Change Lives',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    image: require('@/assets/images/onboarding-screen3.png'),
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
  const insets = useSafeAreaInsets();
  const isLast = page === slides.length - 1;

  const finishOnboarding = () => {
    session.onboardingDone = true;
    router.replace('/(tabs)');
  };

  const handleNext = () => {
    if (isLast) {
      finishOnboarding();
    } else {
      pagerRef.current?.setPage(page + 1);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={(e) => setPage(e.nativeEvent.position)}
      >
        {slides.map((slide) => (
          <View key={slide.title} className="flex-1">
            {/* Image with a white fade at the bottom */}
            <View className="h-[58%]">
              <Image
                source={slide.image}
                className="w-full h-full"
                resizeMode="cover"
              />
              <LinearGradient
                colors={['rgba(255,255,255,0)', '#FFFFFF']}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: 180,
                }}
              />

              {/* Pagination dots */}
              <View className="absolute bottom-3 left-6 flex-row gap-1.5">
                {slides.map((_, i) => (
                  <View
                    key={i}
                    className={`h-3 rounded-full ${
                      i === page ? 'w-6 bg-orange-500' : 'w-3 bg-gray-400'
                    }`}
                  />
                ))}
              </View>
            </View>

            {/* Text content */}
            <View className="flex-1 px-6 pt-2">
              <Text className="text-3xl font-medium text-gray-900 leading-9">
                {slide.title}{' '}
                <Text className="text-orange-500">{slide.highlight}</Text>{' '}
                {slide.afterHighlight}
              </Text>

              <Text className="text-base font-bold text-orange-500 mt-3">
                {slide.subtitle}
              </Text>

              <Text className="text-xs text-gray-500 mt-2 leading-5">
                {slide.description}
              </Text>
            </View>
          </View>
        ))}
      </PagerView>

      {/* Logo (top left, same on every slide) */}
      <Image
        source={require('@/assets/images/logo.png')}
        className="absolute left-6 w-24 h-9"
        style={{ top: insets.top + 12 }}
        resizeMode="contain"
      />

      {/* Skip (top right, hidden on the last slide) */}
      {!isLast && (
        <TouchableOpacity
          onPress={finishOnboarding}
          className="absolute right-6 bg-black/30 px-4 py-1.5 rounded-full"
          style={{ top: insets.top + 12 }}
        >
          <Text className="text-white font-semibold text-sm">Skip</Text>
        </TouchableOpacity>
      )}

      {/* Bottom button */}
      <TouchableOpacity
        onPress={handleNext}
        className="absolute left-6 right-6 bg-orange-500 rounded-full py-4 items-center"
        style={{ bottom: insets.bottom + 24 }}
      >
        <Text className="text-white font-bold text-base">
          {isLast ? 'Get Started Now' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
