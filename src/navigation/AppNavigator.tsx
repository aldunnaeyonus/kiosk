import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppStackParamList, AuthStackParamList } from '../types/navigation';

// --- Screen Imports ---
import EventLists from '../screens/ViewEventLists';
import AddEvents from '../screens/AddEvent';
import Checkins from '../screens/Checkins';
import Bluetooth from '../screens/Settings/Bluetooth';
import AddAttendee from '../screens/AddAttendee';
import WebViewer from '../screens/WebView';
import ChangePass from '../screens/Settings/ChangePassword';
import ChangeData from '../screens/Settings/ChangeData';
import ViewEventList from '../screens/ViewEventLists';
import EditEvents from '../screens/EditEvents';
import BrotherPrinters from '../screens/Settings/BrotherPrinters';
import ViewAttendees from '../screens/ViewAttendees';

const Stack = createStackNavigator<AppStackParamList>();

const defaultScreenOptions = {
  headerShown: true,
  headerBackTitleVisible: false,
  headerTintColor: '#000000',
};

/**
 * AppNavigator handles all the screens that are accessible after a user is signed in.
 */
const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="EventList" screenOptions={defaultScreenOptions}>
      <Stack.Screen name="EventList" component={EventLists} options={{ headerLeft: () => null, title: "Event List" }} />
      <Stack.Screen name="AddEvent" component={AddEvents} options={{ title: "Add New Event" }} />
      <Stack.Screen name="Checkins" component={Checkins} options={({ route }) => ({ title: `${route.params.kiosk_event} Check In` })} />
      <Stack.Screen name="KioskSettings" component={Bluetooth} options={{ title: "Kiosk Settings" }} />
      <Stack.Screen name="AddAttendee" component={AddAttendee} options={{ title: "Add Attendee" }} />
      <Stack.Screen name="WebView" component={WebViewer} options={({ route }) => ({ title: route.params.name })} />
      <Stack.Screen name="ChangePassword" component={ChangePass} options={{ title: "Change Password" }} />
      <Stack.Screen name="ChangeData" component={ChangeData} options={{ title: "Change Account Details" }} />
      <Stack.Screen name="ViewEventList" component={ViewEventList} options={({ route }) => ({ title: `${route.params.kiosk_event} Attendees` })} />
      <Stack.Screen name="EditEvent" component={EditEvents} options={{ title: "Edit Mode" }} />
      <Stack.Screen name="SelectPrinter" component={BrotherPrinters} options={{ title: "Select Printer" }} />
      <Stack.Screen name="ViewAttendees" component={ViewAttendees} options={({ route }) => ({ title: `${route.params.kiosk_event} Checked In` })} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
