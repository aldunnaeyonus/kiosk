import Checkins from "./Data/Events/Checkins";
import ChangePass from "./Data/Settings/ChangePassword";
import ChangeData from "./Data/Settings/ChangeData";
import ViewEventList from "./Data/Events/ViewEventList";
import AddAttendee from "./Data/Events/AddAttendee";
import Bluetooth from "./Data/Settings/Bluetooth";
import SignIn from "./Data/Signin/SignIn";
import Register from "./Data/Signin/Register";
import EventLists from "./Data/Events/EventLists";
import AddEvents from "./Data/Events/AddEvents";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform, Text, LogBox, StyleSheet } from "react-native";
import WebViewer from "./Data/WebView/WebView";
import { AlertNotificationRoot } from "react-native-alert-notification";
import AppIntroSlider from 'react-native-app-intro-slider';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Print from 'expo-print';


export default function App() {
  const Stack = createStackNavigator();
  const [showRealApp, setshowRealApp] = useState(false);
  const [signIn, setSignIn] = useState(false);
  const [isReady, setIsReady] = useState(false);
  LogBox.ignoreAllLogs(true);
  const stringToBoolean = (stringValue) => {
    switch(stringValue?.toLowerCase()?.trim()){
        case "true": 
        case "yes": 
        case "1": 
          return true;

        case "false": 
        case "no": 
        case "0": 
        case null: 
        case undefined:
          return false;

        default: 
          return JSON.parse(stringValue);
    }
}
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.allowFontScaling = false;
  const slides = [
    {
      key: '1',
      title: 'Set Thermal Printer',
      text: 'Description.\nSay something cool',
      image: require('./assets/pos-printer.png'),
      backgroundColor: '#0E86D4',
    },
    {
      key: '2',
      title: 'Infusionsoft and Sql Database Intergrations',
      text: 'Other cool stuff',
      image: require('./assets/data-processing.png'),
      backgroundColor: '#055C9D',
    }
  ];

  useEffect(() => {
    async function prepare() {
      try {
        const showSlide = await AsyncStorage.getItem("showRealApp", false);
        setshowRealApp(showSlide)
        const value = Platform.OS !== "web" ? await AsyncStorage.getItem("logedIn", false) : window.localStorage.getItem("logedIn", false);
        setSignIn(stringToBoolean(value));
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        const value = Platform.OS !== "web" ? await AsyncStorage.getItem("logedIn", false) : window.localStorage.getItem("logedIn", false);
        setSignIn(stringToBoolean(value));
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return null;
  }

  const onDone = async () => {
    const showSlide = await AsyncStorage.setItem("showRealApp", true);
    setshowRealApp(showSlide)
  }

  const renderItem = ({ item }) => {
    return (
      <View
        style={[
          styles.slide,
          {
            backgroundColor: item.bg,
          },
        ]}>
        <Text style={styles.title}>{item.title}</Text>
        <Image source={item.image} style={styles.image} />
        <Text style={styles.text}>{item.text}</Text>
        {
          item.key == "1" ? 
          <TouchableOpacity
          onPress={async () => {
            const printer = await Print.selectPrinterAsync(); // iOS only
            await AsyncStorage.setItem("printerURL", printer.url);
            await AsyncStorage.setItem("printerName", printer.name);
          }}>
          <View
            style={{
              height: 50,
              width: 210,
              marginBottom: 30,
              flexDirection: "row",
              borderRadius: 20,
              backgroundColor: "#ffffff",
              fontWeight: "bold",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
            }}>
            <Text
              style={{
                color: "#000000",
                fontWeight: "bold",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 17,
              }}>
              {" "} Select A Printer {" "}
            </Text>
            <FontAwesome name="printer" size={15} style={styles.whiteIcon} />
          </View>
        </TouchableOpacity>
         : ""
        }
      </View>
    );
  }

  const renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          name="md-arrow-round-forward"
          color="rgba(255, 255, 255, .9)"
          size={24}
        />
      </View>
    );
  };
  const keyExtractor = (item) => item.title;

  const renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          name="md-checkmark"
          color="rgba(255, 255, 255, .9)"
          size={24}
        />
      </View>
    );
  };
  if (showRealApp) {
  if (signIn) {
    return (
      <NavigationContainer>
                    <AlertNotificationRoot>
        <Stack.Navigator initialRouteName="EventLists">
          <Stack.Screen
            name="Event List"
            component={EventLists}
            options={{
              headerShown: true,
              headerLeft: () => <></>,
            }}
          />
          <Stack.Screen
            name="Add New Event"
            component={AddEvents}
            options={{
              headerShown: true,
              headerBackTitleVisible: false,
              headerTintColor: "#000000",
            }}
          />
          <Stack.Screen
            name="Check In Attendees"
            options={({ route }) => ({
              title: route.params.kiosk_event + " Attendee Check In",
              headerShown: true,
              headerBackTitleVisible: false,
              headerTintColor: "#000000",
            })} // what
            component={Checkins}
          />
          <Stack.Screen
            name="Kiosk Settings"
            component={Bluetooth}
            options={{
              headerShown: true,
              headerBackTitleVisible: false,
              headerTintColor: "#000000",
            }}
          />
          <Stack.Screen
            name="Add Attendee"
            component={AddAttendee}
            options={{
              headerShown: true,
              headerBackTitleVisible: false,
              headerTintColor: "#000000",
            }}
          />
          <Stack.Screen
            name="WebView"
            component={WebViewer}
            options={{
              headerShown: true,
              headerBackTitleVisible: false,
              headerTintColor: "#000000",
            }}
          />
          <Stack.Screen
            name="Change Password"
            component={ChangePass}
            options={{
              headerShown: true,
              headerBackTitleVisible: false,
              headerTintColor: "#000000",
            }}
          />
          <Stack.Screen
            name="Change Account Details"
            component={ChangeData}
            options={{
              headerShown: true,
              headerBackTitleVisible: false,
              headerTintColor: "#000000",
            }}
          />
          <Stack.Screen
            name="View Event Attendee List"
            component={ViewEventList}
            options={{
              headerShown: true,
              headerBackTitleVisible: false,
              headerTintColor: "#000000",
            }}
          />
                    <Stack.Screen
            name="Kiosk Sign In"
            component={SignIn}
            options={{ headerShown: false }}
          />
           <Stack.Screen
                  name="Register an Account"
                  component={Register}
                  options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTintColor: "#000",
                    headerBackTitleVisible: false,
                  }}
                />
        </Stack.Navigator>
        </AlertNotificationRoot>
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
                    <AlertNotificationRoot>
        <Stack.Navigator initialRouteName="SignIn">
          <Stack.Screen
            name="Kiosk Sign In"
            component={SignIn}
            options={{ headerShown: false }}
          />
 <Stack.Screen
                  name="Register an Account"
                  component={Register}
                  options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTintColor: "#000",
                    headerBackTitleVisible: false,
                  }}
                />
          <Stack.Screen
            name="Event List"
            options={{
              headerShown: true,
              headerLeft: () => <></>,
            }}
            component={EventLists}
          />
          <Stack.Screen
            name="Add New Event"
            component={AddEvents}
            options={{
              headerShown: true,
              headerBackTitleVisible: false,
              headerTintColor: "#000000",
            }}
          />
          <Stack.Screen
            name="Check In Attendees"
            options={{
              headerShown: true,
              headerBackTitleVisible: false,
              headerTintColor: "#000000",
            }}
            component={Checkins}
          />
          <Stack.Screen
            name="Kiosk Settings"
            component={Bluetooth}
            options={{
              headerShown: true,
              headerBackTitleVisible: false,
              headerTintColor: "#000000",
            }}
          />
          <Stack.Screen
            name="Add Attendee"
            component={AddAttendee}
            options={{
              headerShown: true,
              headerBackTitleVisible: false,
              headerTintColor: "#000000",
            }}
          />
          <Stack.Screen
            name="WebView"
            component={WebViewer}
            options={{
              headerShown: true,
              headerBackTitleVisible: false,
              headerTintColor: "#000000",
            }}
          />
          <Stack.Screen
            name="Change Password"
            component={ChangePass}
            options={{
              headerShown: true,
              headerBackTitleVisible: false,
              headerTintColor: "#000000",
            }}
          />
          <Stack.Screen
            name="Change Account Details"
            component={ChangeData}
            options={{
              headerShown: true,
              headerBackTitleVisible: false,
              headerTintColor: "#000000",
            }}
          />
          <Stack.Screen
            name="View Event Attendee List"
            component={ViewEventList}
            options={{
              headerShown: true,
              headerBackTitleVisible: false,
              headerTintColor: "#000000",
            }}
          />
        </Stack.Navigator>
        </AlertNotificationRoot>
      </NavigationContainer>
    );
          }
   }else {
    return <AppIntroSlider 
    keyExtractor={keyExtractor}
    renderDoneButton={renderDoneButton}
    showSkipButton
    showPrevButton
    renderNextButton={renderNextButton}
    renderItem={renderItem} 
    data={slides} 
    onDone={onDone}/>;
  }
}

  const styles = StyleSheet.create({
    whiteIcon: {
      color: "#000000",
      justifyContent: "center",
    },
    buttonCircle: {
      width: 44,
      height: 44,
      backgroundColor: 'rgba(0, 0, 0, .2)',
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
    },
    slide: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: 400,
      height: 400,
      marginVertical: 32,
    },
    text: {
      fontSize: 18,
      color: 'white',
      textAlign: 'center',
    },
    title: {
      fontSize: 25,
      color: 'white',
      textAlign: 'center',
    },
  });
