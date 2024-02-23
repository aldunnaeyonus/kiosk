import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image
} from "react-native";
import InteractiveTextInput from "react-native-text-input-interactive";
import { TextInput } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width: ScreenWidth } = Dimensions.get("screen");
import axios from "axios";

import * as Print from "expo-print";
import { ALERT_TYPE, Dialog, Toast } from "react-native-alert-notification";
import {printImage} from 'react-native-brother-printers';
import ViewShot, {captureRef, releaseCapture} from "react-native-view-shot";


const AddAttendee = ({ navigation, route }) => {
  const [fname, setfname] = useState("");
  const [lname, setlname] = useState("");
  const [email, setemail] = useState("");
  const [phone, setphone] = useState("");
  const isFocused = useIsFocused();
  const baseUrl = "https://bigdogtools.com/kiosk";
  const [printer, setPrinter] = useState("");
  const capref = useRef();
  const [printerURL, setprinterURL] = useState('');
  const [bt, setBT] = useState("");

  useEffect(() => {
      if (route.params.searchText.includes("@")){
          setemail(route.params.searchText);
      }else if (/^\d+$/.test(route.params.searchText)){
        setphone(route.params.searchText);
      }else if (route.params.searchText.includes(" ")){
        const words = route.params.searchText.split(' ');
        setfname(words[0]);
        setlname(words[1]);
      }else {
        setfname(route.params.searchText);
      }

    const fetchData = async () => {
      try {
        setprinterURL(await AsyncStorage.getItem("AirprintURL"));
        const BrotherPrinter = Platform.OS !== "web" ? await AsyncStorage.getItem("BrotherPrinter") : window.localStorage.getItem("BrotherPrinter");
        const BBT = Platform.OS !== "web" ? await AsyncStorage.getItem("useBT") : window.localStorage.getItem("useBT");

        setPrinter(JSON.parse(""+BrotherPrinter));
        setBT(JSON.parse(""+BBT));

      } catch (error) {
        setPrinter("");
      }
    };
    fetchData();
  }, [isFocused]);

  function onCapture(index) {
    captureRef(capref, {
      format: "jpg",    
      quality: 0.9,
    })
    .then(async (uri) => {
        printImage(printer, (JSON.parse(await AsyncStorage.getItem("useBT")) == false) ? "0" : "1", uri, { autoCut: true, labelSize: parseInt(await AsyncStorage.getItem("BrotherPrinterLabel"))})
        .then(() => {
          Toast.show({
            onPress() {},
            type: ALERT_TYPE.SUCCESS,
            title: "Printing Success",
            textBody: "Please grab your name tag.",
            autoClose: 5000, // or time in ms by default 5000
          });
            releaseCapture(uri);
            navigation.goBack(null);
          })
          .catch((error) => {
            Toast.show({
              onPress() {},
              type: ALERT_TYPE.WARNING,
              title: "Connection Failed",
              textBody: ""+error,
              autoClose: 5000, // or time in ms by default 5000
            });
          });
      },
      (error) => Toast.show({
        onPress() {},
        type: ALERT_TYPE.WARNING,
        title: "Connection Failed",
        textBody: ""+error,
        autoClose: 5000, // or time in ms by default 5000
      })
    );
  }

  const print = () => {
    Toast.show({
      onPress() {},
      type: ALERT_TYPE.SUCCESS,
      title: "Loading",
      textBody: "Gathering details.",
      autoClose: 5000, // or time in ms by default 5000
    });
    captureRef(capref, {
      format: "jpg",    
      quality: 0.9,
      screenView: "add"
    })
    .then((uri) => {
      Print.printAsync({
        uri: uri,
        orientation: "landscape",
        printerUrl: printerURL
      });
      Toast.show({
        onPress() {},
        type: ALERT_TYPE.SUCCESS,
        title: "Printing Success",
        textBody: "Please grab your name tag.",
        autoClose: 5000, // or time in ms by default 5000
      });
      releaseCapture(uri);
      navigation.goBack(null);

    }).catch((error) => {
      Toast.show({
        onPress() {},
        type: ALERT_TYPE.WARNING,
        title: "Connection Failed",
        textBody: "Ensure your printer is not asleep. " +error,
        autoClose: 5000, // or time in ms by default 5000
      });
      },
      (error) => Toast.show({
        onPress() {},
        type: ALERT_TYPE.WARNING,
        title: "Connection Failed",
        textBody: "Ensure your printer is not asleep. " +error,
        autoClose: 5000, // or time in ms by default 5000
      })
    );
  };

  const preview = async (
    fname,
    lname,
    email,
    phone,
    kiosk_id,
    ifs_id
  ) => {

    if (fname.length <= 0 || lname.length <= 0 || email.length <= 0) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Error",
        textBody: "Your name and email address are required entries.",
        autoClose: 5000, // or time in ms by default 5000
      });
    } else {
      axios
        .post(
          baseUrl + "/events/checkin.php",
          {
            fattendee: fname,
            lattendee: lname,
            email: email,
            phone: phone,
            id: kiosk_id,
            ifs_id: ifs_id,
            pin: route.params.pin,
          },
          {
            headers: {
              "Content-Type": "application/json;charset=utf-8",
            },
          }
        )
        .then(async function () {
          if (parseInt(route.params.prints) > 1) {
            if (JSON.parse(await AsyncStorage.getItem("useAirPrint")) == false){
              onCapture();
                onCapture();
            }else{
              print();
              print();
              }
              } else {
            if (JSON.parse(await AsyncStorage.getItem("useAirPrint")) == false){
                  onCapture();
              }else{
                print();
                }
            }
        })
        .catch((error) => {
          Toast.show({
            onPress() {},
            type: ALERT_TYPE.WARNING,
            title: "Connection Failed",
            textBody: ""+error,
            autoClose: 5000, // or time in ms by default 5000
          });
        });
    }
  };

  useEffect(() => {
    {
    }
    navigation.setOptions({
      headerTitle: "Add Attendee",
    });
  });

  return (
    <SafeAreaProvider style={styles.container}>
      <ScrollView>
        <View
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: "100%",
              height: 60,
              marginTop: 0,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TextInput.Icon
              iconColor="#007AFF"
              style={{
                marginLeft: 38,
                marginTop: 45,
                flexDirection: "row",
                width: "90%",
                justifyContent: "space-between",
              }}
              size={20}
              icon="tag-outline"
            />

            <InteractiveTextInput
              maxLength={33}
              autoCapitalize="words"
              textInputStyle={{
                backgroundColor: "white",
                marginLeft: 38,
                fontSize: 18,
                height: 60,
                justifyContent: "center",
              }}
              defaultValue={fname}
              keyboardType="default"
              placeholder="First Name"
              onChangeText={(text) => {
                setfname(text);
              }}
            />
          </View>
          <View style={[styles.dividerStyle]} />
          <View
            style={{
              backgroundColor: "white",
              width: "100%",
              height: 60,
              marginTop: 0,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TextInput.Icon
              iconColor="#007AFF"
              style={{
                marginLeft: 38,
                marginTop: 45,
                flexDirection: "row",
                width: "90%",
                justifyContent: "space-between",
              }}
              size={20}
              icon="tag-outline"
            />

            <InteractiveTextInput
              maxLength={33}
              autoCapitalize="words"
              textInputStyle={{
                backgroundColor: "white",
                marginLeft: 38,
                fontSize: 18,
                height: 60,
                justifyContent: "center",
              }}
              defaultValue={lname}
              keyboardType="default"
              placeholder="Last Name"
              onChangeText={(text) => {
                setlname(text);
              }}
            />
          </View>
          <View style={[styles.dividerStyle]} />
          <View
            style={{
              backgroundColor: "white",
              width: "100%",
              height: 60,
              marginTop: 0,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TextInput.Icon
              iconColor="#007AFF"
              style={{
                marginLeft: 38,
                marginTop: 45,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
              size={20}
              icon="mail"
            />
            <InteractiveTextInput
              maxLength={33}
              autoCapitalize="words"
              textInputStyle={{
                backgroundColor: "white",
                marginLeft: 38,
                height: 60,
                fontSize: 18,
                justifyContent: "center",
              }}
              defaultValue={email}
              keyboardType="email-address"
              placeholder="Email Address"
              onChangeText={(text) => {
                setemail(text);
              }}
            />
          </View>
          <View style={[styles.dividerStyle]} />

          <View
            style={{
              backgroundColor: "white",
              width: "100%",
              height: 60,
              marginTop: 0,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TextInput.Icon
              iconColor="#007AFF"
              style={{
                marginLeft: 38,
                marginTop: 45,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
              size={20}
              icon="phone"
            />
            <InteractiveTextInput
              maxLength={33}
              textInputStyle={{
                backgroundColor: "white",
                marginLeft: 38,
                height: 60,
                fontSize: 18,
                justifyContent: "center",
              }}
              defaultValue={phone}
              keyboardType="phone-pad"
              placeholder="Phone Number"
              onChangeText={(text) => {
                setphone(text);
              }}
            />
          </View>

          <View style={[styles.dividerStyle]} />
        </View>
        <TouchableOpacity
          onPress={async () => {
            preview(
              fname,
              lname,
              email,
              phone,
              route.params.kiosk_id,
              "0",
              "Guest"
            );
          }}
        >
          <View
            style={{
              height: 50,
              width: '65%',
              marginTop: 20,
              flexDirection: "row",
              borderRadius: 20,
              backgroundColor: "green",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 17,
              }}
            >
              {" "}
              Check-in and Grab Name Tag{" "}
            </Text>
            <View style={styles.listItem}>
            <ViewShot
            style={{
              transform: [{rotate: '-90deg'}],
              position: "absolute",
              left: -1000,
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            ref={capref}
          >
            <Text
              style={{
                fontSize: 50,
                fontFamily: 'Avenir',
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {fname}
            </Text>
            <Text
              style={{
                fontSize: 40,
                fontFamily: 'Avenir',
                marginTop: -10,
                textAlign: "center",
                fontWeight: "500",
              }}
            >
              {lname}
            </Text>
            <Image
        resizeMode="contain"
        resizeMethod="auto"
        tintColor='black'
        style={{
          width: 200,
          marginTop: 10,
          height: 80,
          alignSelf: "center",
          flexDirection: "row",
          justifyContent: "center",
        }}
        source={{ uri: baseUrl + "/logos/" + route.params.logo }}
      />
          </ViewShot>
          </View>
          </View>
                    </TouchableOpacity>
      </ScrollView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  whiteIcon: {
    color: "#ffffff",
    justifyContent: "center",
  },
  dividerStyle: {
    height: 0.5,
    width: ScreenWidth * 0.9,
    backgroundColor: "#ccc",
  },
});

export default AddAttendee;
