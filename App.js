
import Checkins from "./Data/Events/Checkins";
import ChangePass from "./Data/Settings/ChangePassword";
import ChangeData from "./Data/Settings/ChangeData";
import ViewEventList from "./Data/Events/ViewEventList";
import AddAttendee from "./Data/Events/AddAttendee";
import Bluetooth from "./Data/Settings/Bluetooth";
import SignIn from "./Data/Signin/SignIn";
import EventLists from "./Data/Events/EventLists";
import AddEvents from "./Data/Events/AddEvents";
import { createStackNavigator } from "@react-navigation/stack";
import React, {useState, useEffect} from "react";
import { NavigationContainer, } from "@react-navigation/native";
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform, Text, LogBox} from "react-native";
import WebViewer from "./Data/WebView/WebView";


export default function App() {
  const Stack = createStackNavigator();
  const [signIn, setSignIn] = useState(false);
  const [isReady, setIsReady] = useState(false);
  LogBox.ignoreAllLogs(true)

  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.allowFontScaling = false;


if (Platform.OS === 'ios' || Platform.OS === 'android') {
  //LogBox.ignoreLogs(['Setting a timer']);
}

  async function loadAssetsAsync() {
    try {
   const value = Platform.OS !== "web"  ? await AsyncStorage.getItem("logedIn")  : window.localStorage.getItem("logedIn");
    if (value !== null) {
      setSignIn(true);
    } else {
      setSignIn(false);
    }

  } catch (error) {
    setSignIn(false);
  }
}

useEffect(() => {
  async function prepare() {
    try {
      // Keep the splash screen visible while we fetch resources
      await SplashScreen.preventAutoHideAsync();
      // Pre-load fonts, make any API calls you need to do here
      loadAssetsAsync()
      // Artificially delay for two seconds to simulate a slow loading
      // experience. Please remove this if you copy and paste the code!
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (e) {
      console.warn(e);
    } finally {
      // Tell the application to render
      setIsReady(true);
      await SplashScreen.hideAsync();

    }
  }

  prepare();
}, []);

if (!isReady) {

  return null;
}

  if (signIn) {
    return (
      <NavigationContainer>
              <Stack.Navigator initialRouteName="EventLists">
              <Stack.Screen
                  name="Event List"
                  component={EventLists}
                  options={{
                    gestureEnabled: false,
                    headerShown: true,
                    headerLeft: () => <></>,
                  }}   
                />
            <Stack.Screen
                    name="Add New Event"
                    component={AddEvents}
                    options={{ headerShown: true, headerBackTitleVisible: false,headerTintColor: '#000000' }}
                  />
                <Stack.Screen
                  name="Check In Attendees"
                  options={({ route }) => ({ title: route.params.kiosk_event + " Attendee Check In",  headerShown: true, headerBackTitleVisible: false,headerTintColor: '#000000'}) } // what 
                  component={Checkins}
                />
            <Stack.Screen
                    name="Kiosk Settings"
                    component={Bluetooth}
                    options={{ headerShown: true, headerBackTitleVisible: false, headerTintColor: '#000000' }}
                  />
           <Stack.Screen
                    name="Add Attendee"
                    component={AddAttendee}
                    options={{ headerShown: true, headerBackTitleVisible: false,headerTintColor: '#000000' }}
                  />
                  <Stack.Screen
                  name="WebView"
                  component={WebViewer}
                  options={{ headerShown: true, headerBackTitleVisible: false, headerTintColor: '#000000' }}
                />
                                                  <Stack.Screen
                  name="Change Password"
                  component={ChangePass}
                  options={{ headerShown: true, headerBackTitleVisible: false, headerTintColor: '#000000' }}
                />
              <Stack.Screen
                  name="Change Account Details"
                  component={ChangeData}
                  options={{ headerShown: true, headerBackTitleVisible: false, headerTintColor: '#000000' }}
                />
                                <Stack.Screen
                  name="View Event Attendee List"
                  component={ViewEventList}
                  options={{ headerShown: true, headerBackTitleVisible: false, headerTintColor: '#000000' }}
                />
              </Stack.Navigator>
      </NavigationContainer>
    );
    }else{
      return (
      <NavigationContainer>
                <Stack.Navigator initialRouteName="SignIn">
                  <Stack.Screen
                    name="Kiosk Sign In"
                    component={SignIn}
                    options={{ headerShown: false }}

                  />
                <Stack.Screen
                  name="Event List"
                  options={{
                    gestureEnabled: false,
                    headerShown: true,
                    headerLeft: () => <></>,
                  }}
                  component={EventLists}
                />
                <Stack.Screen
                    name="Add New Event"
                    component={AddEvents}
                    options={{ headerShown: true, headerBackTitleVisible: false,headerTintColor: '#000000' }}
                  />
                <Stack.Screen
                  name="Check In Attendees"
                  options={{ headerShown: true, headerBackTitleVisible: false,headerTintColor: '#000000' }}
                  component={Checkins}
                />
                            <Stack.Screen
                    name="Kiosk Settings"
                    component={Bluetooth}
                    options={{ headerShown: true, headerBackTitleVisible: false, headerTintColor: '#000000' }}
                  />
               <Stack.Screen
                    name="Add Attendee"
                    component={AddAttendee}
                    options={{ headerShown: true, headerBackTitleVisible: false, headerTintColor: '#000000' }}
                  />
                  <Stack.Screen
                  name="WebView"
                  component={WebViewer}
                  options={{ headerShown: true, headerBackTitleVisible: false, headerTintColor: '#000000' }}
                />
                                  <Stack.Screen
                  name="Change Password"
                  component={ChangePass}
                  options={{ headerShown: true, headerBackTitleVisible: false, headerTintColor: '#000000' }}
                />
                <Stack.Screen
                  name="Change Account Details"
                  component={ChangeData}
                  options={{ headerShown: true, headerBackTitleVisible: false, headerTintColor: '#000000' }}
                />
                <Stack.Screen
                  name="View Event Attendee List"
                  component={ViewEventList}
                  options={{ headerShown: true, headerBackTitleVisible: false, headerTintColor: '#000000' }}
                />
                </Stack.Navigator>
        </NavigationContainer>
      );
    }
}
