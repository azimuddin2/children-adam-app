import { persistor, store } from '@/redux/store';
import * as SplashScreen from 'expo-splash-screen';
import { ReactNode, useEffect } from 'react';
import { Provider } from 'react-redux';

SplashScreen.preventAutoHideAsync();

function HideSplashWhenReady() {
  useEffect(() => {
    if (persistor.getState().bootstrapped) {
      SplashScreen.hideAsync();
      return;
    }

    const unsubscribe = persistor.subscribe(() => {
      if (persistor.getState().bootstrapped) {
        SplashScreen.hideAsync();
        unsubscribe();
      }
    });

    return unsubscribe;
  }, []);

  return null;
}

export default function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <HideSplashWhenReady />
      {children}
    </Provider>
  );
}
