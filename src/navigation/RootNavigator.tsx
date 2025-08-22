import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Onboarding from '../components/Onboarding';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { RootStackParamList } from '../types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

interface RootNavigatorProps {
  isSignedIn: boolean;
  showOnboarding: boolean;
  onOnboardingDone: () => void;
}

/**
 * The RootNavigator is the main router for the app. It decides which major
 * part of the app to show based on the user's status (onboarding, signed out, or signed in).
 */
const RootNavigator: React.FC<RootNavigatorProps> = ({ isSignedIn, showOnboarding, onOnboardingDone }) => {
  if (showOnboarding) {
    return <Onboarding onDone={onOnboardingDone} />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isSignedIn ? (
        <Stack.Screen name="App" component={AppNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
