import Checkins from "./Data/Events/Checkins";
import ViewAttendees from "./Data/Events/ViewAttendees";
import ChangePass from "./Data/Settings/ChangePassword";
import ChangeData from "./Data/Settings/ChangeData";
import ViewEventList from "./Data/Events/ViewEventList";
import AddAttendee from "./Data/Events/AddAttendee";
import Bluetooth from "./Data/Settings/Bluetooth";
import SignIn from "./Data/Signin/SignIn";
import Register from "./Data/Signin/Register";
import EventLists from "./Data/Events/EventLists";
import BrotherPrinters from "./Data/Settings/BrotherPrinters";
import AddEvents from "./Data/Events/AddEvents";
import EditEvents from "./Data/Events/EditEvents";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform, Text, LogBox, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import WebViewer from "./Data/WebView/WebView";
import { AlertNotificationRoot } from "react-native-alert-notification";
import AppIntroSlider from 'react-native-app-intro-slider';
import * as Print from 'expo-print';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { requestLocalNetworkAccess, checkLocalNetworkAccess } from "react-native-local-network-permission";
FontAwesome.loadFont();

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
      title: 'Brother Printer Integration',
      text: 'The App uses the Brother SDK to allow silent printing when printing badges.\nSo users will not receive annoying pop-ups.',
      image: require('./assets/pos-printer.png'),
      backgroundColor: '#0E86D4',
    },
    {
      key: '2',
      title: 'Infusionsoft and Sql Database Intergrations',
      text: 'Administratios can opt in to use the infusionsoft database for established members.\n-OR-\nAdministrators can start fresh and create your own user base within the app.\nThis option is under settings, Update Account Details option.',
      image: require('./assets/data-processing.png'),
      backgroundColor: '#055C9D',
    },
    {
      key: '3',
      title: 'Kiosk Mode',
      text: 'Kiosk Mode prevents any erouneous navigation away from the checkin screen.\nAdministrators can touch the upper left corner for 2 seconds or swipe from the left to right to exit kiosk mode and navigate back to normal mode.',
      image: require('./assets/kios_mode.png'),
      backgroundColor: '#0E86D4',
    }
  ];

  useEffect(() => {
    async function prepare() {
      try {
        if (await AsyncStorage.getItem("labelWidth") == null){
        await AsyncStorage.setItem("labelWidth", "325.03937008");
        await AsyncStorage.setItem("labelHeight", "226.77165354");
        }
        if (await AsyncStorage.getItem("BrotherPrinterLabel") == null){
          await AsyncStorage.setItem("BrotherPrinterLabel", "18");
          }
        if (await AsyncStorage.getItem("useAirPrint") == null){
          await AsyncStorage.setItem("useAirPrint", JSON.stringify(false))
        }
        const showSlide = await AsyncStorage.getItem("showRealApp");
        setshowRealApp(showSlide)
        const value = Platform.OS !== "web" ? await AsyncStorage.getItem("logedIn") : window.localStorage.getItem("logedIn");
        setSignIn(stringToBoolean(value));
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        const value = Platform.OS !== "web" ? await AsyncStorage.getItem("logedIn") : window.localStorage.getItem("logedIn");
        setSignIn(stringToBoolean(value));
        await SplashScreen.hideAsync();
        await checkLocalNetworkAccess();
        await requestLocalNetworkAccess();

      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return null;
  }

  const onDone = async () => {
    await AsyncStorage.setItem("showRealApp", "true");
    setshowRealApp(true)

  }

  const renderItem = ({ item }) => {
    return (
      <View
        style={[styles.slide, { backgroundColor: item.backgroundColor } ]}>
        <Text style={styles.title}>{item.title}</Text>
        <Image source={item.image} style={styles.image} />
        <Text style={styles.text}>{item.text}</Text>
        {
          item.key == "5" ? 
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
              marginTop: 25,
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
            <FontAwesome name="print" size={15} style={styles.whiteIcon} />
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
        <FontAwesome
          name="arrow-right"
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
        <FontAwesome
          name="check"
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
            <Stack.Screen
            name="Edit Mode"
            component={EditEvents}
            options={{
              headerShown: true,
              headerBackTitleVisible: false,
              headerTintColor: "#000000",
            }}
          />
          <Stack.Screen
            name="Select Printer"
            component={BrotherPrinters}
            options={{
              headerShown: true,
              headerBackTitleVisible: false,
              headerTintColor: "#000000",
            }}
          />  
         <Stack.Screen
            name="View Event Attendees"
            component={ViewAttendees}
            options={({ route }) => ({
              title: route.params.kiosk_event + " Attendee's Checked In",
              headerShown: true,
              headerBackTitleVisible: false,
              headerTintColor: "#000000",
            })}
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
           <Stack.Screen
            name="Edit Mode"
            component={EditEvents}
            options={{
              headerShown: true,
              headerBackTitleVisible: false,
              headerTintColor: "#000000",
            }}
          />

<Stack.Screen
            name="Select Printer"
            component={BrotherPrinters}
            options={{
              headerShown: true,
              headerBackTitleVisible: false,
              headerTintColor: "#000000",
            }}
          />  
           <Stack.Screen
            name="View Event Attendees"
            component={ViewAttendees}
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
      alignContent:'center',
      flexDirection: 'column',
      alignItems: 'center',
      alignself: 'center',
      justifyContent: 'center',
    },
    image: {
      width: 400,
      justifyContent: 'center',
      alignItems: 'center',
      tintColor:'white',
      height: 400,
    },
    text: {
      fontSize: 20,
      color: 'white',
      padding: 10,
      textAlign: 'center',
    },
    title: {
      fontSize: 25,
      color: 'white',
      textAlign: 'center',
    },
  });
