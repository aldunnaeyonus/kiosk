import React, { useState, useEffect } from 'react';
import { LogBox, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import { requestLocalNetworkAccess } from 'react-native-local-network-permission';

import RootNavigator from './src/navigation/RootNavigator';
import { otaUpdateService } from './src/services/otaUpdateService';
import { stringToBoolean } from './src/utils/helpers';

// --- App Configuration ---
LogBox.ignoreAllLogs(!__DEV__);
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

// --- Main App Component ---
export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();

        // Run setup tasks in parallel for efficiency
        await Promise.all([
          requestLocalNetworkAccess().catch(e => console.warn('Could not request local network access:', e)),
          otaUpdateService.checkVersion(),
          setupDefaultSettings(),
        ]);

        const showRealAppValue = await AsyncStorage.getItem("showRealApp");
        const loggedInValue = await AsyncStorage.getItem("logedIn");

        setShowOnboarding(!showRealAppValue);
        setIsSignedIn(stringToBoolean(loggedInValue));

      } catch (e) {
        console.warn("App initialization error:", e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    };

    initializeApp();
  }, []);

  const setupDefaultSettings = async () => {
    const defaultSettings = {
      BrotherPrinterLabel: "10",
      useAirPrint: JSON.stringify(false),
      useBT: "0",
    };
    for (const [key, value] of Object.entries(defaultSettings)) {
      const existing = await AsyncStorage.getItem(key);
      if (existing === null) {
        await AsyncStorage.setItem(key, value);
      }
    }
  };

  const handleOnboardingDone = async () => {
    await AsyncStorage.setItem("showRealApp", "true");
    setShowOnboarding(false);
  };

  if (!isReady) {
    return null; // Render nothing while the splash screen is visible
  }

  return (
    <NavigationContainer>
      <AlertNotificationRoot>
        <RootNavigator
          isSignedIn={isSignedIn}
          showOnboarding={showOnboarding}
          onOnboardingDone={handleOnboardingDone}
        />
      </AlertNotificationRoot>
    </NavigationContainer>
  );
}
