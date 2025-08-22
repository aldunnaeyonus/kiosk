import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthStackParamList } from '../types/navigation';

// --- Screen Imports ---
import SignIn from '../screens/Signin/Signin';
import Register from '../screens/Signin/Register';

const Stack = createStackNavigator<AuthStackParamList>();

/**
 * AuthNavigator handles the sign-in and registration flow for users who are not authenticated.
 */
const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTintColor: '#000',
          headerBackTitleVisible: false,
          title: "Register an Account"
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
