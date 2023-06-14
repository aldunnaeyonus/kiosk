import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Modal,
  Image
} from "react-native";
import InteractiveTextInput from "react-native-text-input-interactive";
import { TextInput } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width: ScreenWidth } = Dimensions.get("screen");
import axios from "axios";
import FontAwesome from "@expo/vector-icons/FontAwesome";
FontAwesome.loadFont();
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
  const [visible, setvisible] = useState(false);
  const [printer, setPrinter] = useState("");
  const capref = useRef();
  const [labelWidth, setlabelWidth] = useState(252);
  const [labelHeight, setlabelHeight] = useState(172.79999999999998);

  const CustomProgressBar = ({ visible }) => (
    <Modal
      style={{ backgroundColor: "transparent" }}
      onRequestClose={() => null}
      visible={visible}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "#dcdcdc",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{ borderRadius: 10, backgroundColor: "white", padding: 25 }}
        >
          <Text style={{ fontSize: 20, fontWeight: "200" }}>
            Adding Attendee
          </Text>
          <ActivityIndicator size="large" />
        </View>
      </View>
    </Modal>
  );

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
        const BrotherPrinter = Platform.OS !== "web" ? await AsyncStorage.getItem("BrotherPrinter") : window.localStorage.getItem("BrotherPrinter");
        setPrinter(JSON.parse(""+BrotherPrinter));
      } catch (error) {
        setPrinter("");
      }
    };
    fetchData();
  }, [isFocused]);

  async function onCapture(fname, lname, status) {
    captureRef(capref, {
      format: "jpg",
      quality: 1.0
    }).then(
      async uri => {printImage(printer, uri, {autoCut: true, labelSize: parseInt(await AsyncStorage.getItem("BrotherPrinterLabel"))})
        .then((response) =>  {
          Toast.show({
            onPress() {},
            type: ALERT_TYPE.SUCCESS,
            title: "Printing Success",
            textBody: "Please grab your name tag.",
            autoClose: 5000, // or time in ms by default 5000
          });
          navigation.goBack(null);

        }).catch(async (response) => {
          if (parseInt(route.params.prints) > 1) {
              print2(fname, lname, status, logo);
              } else {
              print(fname, lname, status, logo);
            }
           releaseCapture(uri);
        });  
      }, 
      error => console.log("Printing failed", error));
  }

  const print2 = async (fname, lname, status, logo) => {
    await Print.printAsync({
      html: `<html>
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=yes" />
        <style>
        html,body {
          width:${labelWidth}px;
          height:${labelHeight}px;
          vertical-align: center;
          horizontal-align: center;
          margin: .5rem .5rem .5rem .5rem;
        }
        .fname { 
          font-size: 4em; 
          font-weight: bolder; 
          text-align: center;
        }
        .lname {
          font-size: 3em; 
          font-weight: bold; 
          margin: -1rem 0rem 0rem 0rem;
          text-align: center;
          }
        .status {
          font-size: 2em; 
          font-weight: lighter; 
          margin: -0.5rem 0rem 0rem 0rem;
          text-align: center;
          }
      </style>
      </head>
      <body class="body">
      <div class="fname">${fname}</div>
      <div class="lname">${lname}</div>
      <div class="status"></div>
      <BR><BR>
      <div class="fname">${fname}</div>
      <div class="lname">${lname}</div>
      <div class="status"></div>
      </body>
      </html>`,
      orientation: "landscape",
      width: labelWidth,
      margins: {
        left: 1,
        top: 1,
        right: 1,
        bottom: 1,
      },
      height: labelHeight,
      useMarkupFormatter: true,
    }).catch((error) => {
      Toast.show({
        onPress() {},
        type: ALERT_TYPE.WARNING,
        title: "Connection Failed",
        textBody: "Server Connection Error: " + error,
        autoClose: 5000, // or time in ms by default 5000
      });
    });
  };

  const print = async (fname, lname, status, logo) => {
    await Print.printAsync({
      html: `<html>
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=yes" />
        <style>
        html,body {
          width:${labelWidth}px;
          height:${labelHeight}px;
          vertical-align: center;
          horizontal-align: center;
          margin: .5rem .5rem .5rem .5rem;
        }
        .fname { 
          font-size: 4em; 
          font-weight: bolder; 
          text-align: center;
        }
        .lname {
          font-size: 3em; 
          font-weight: bold; 
          margin: -1rem 0rem 0rem 0rem;
          text-align: center;
          }
        .status {
          font-size: 2em; 
          font-weight: lighter; 
          margin: -0.5rem 0rem 0rem 0rem;
          text-align: center;
          }
      </style>
      </head>
      <body class="body">
      <div class="fname">${fname}</div>
      <div class="lname">${lname}</div>
      <div class="status"></div>
      </body>
      </html>`,
      orientation: "landscape",
      width: labelWidth,
      margins: {
        left: 1,
        top: 1,
        right: 1,
        bottom: 1,
      },
      height: labelHeight,
      useMarkupFormatter: true,
    }).catch((error) => {
      Toast.show({
        onPress() {},
        type: ALERT_TYPE.WARNING,
        title: "Connection Failed",
        textBody: "Server Connection Error: " + error,
        autoClose: 5000, // or time in ms by default 5000
      });
    });
  };

  const preview = async (
    fname,
    lname,
    email,
    phone,
    kiosk_id,
    ifs_id,
    status
  ) => {

    if (fname.length <= 0 || lname.length <= 0 || email.length <= 0) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Error",
        textBody: "Your name and email address are required entries.",
        autoClose: 5000, // or time in ms by default 5000
      });
    } else {
      setvisible(true);
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
          },
          {
            headers: {
              "Content-Type": "application/json;charset=utf-8",
            },
          }
        )
        .then(async (jsonData) => {
          setvisible(false);
          if (parseInt(route.params.prints) > 1) {
            if (JSON.parse(await AsyncStorage.getItem("useAirPrint")) == false){
                onCapture(fname, lname, status, logo);
                onCapture(fname, lname, status, logo);
            }else{
              print2(fname, lname, status, logo);
              }
              } else {
                if (JSON.parse(await AsyncStorage.getItem("useAirPrint")) == false){
                  onCapture(fname, lname, status, logo);
              }else{
                print(fname, lname, status, logo);
                }
            }
        })
        .catch((error) => {
          setvisible(false);
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
      <CustomProgressBar visible={visible} />
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
            console.log(await AsyncStorage.getItem("useAirPrint"))

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
              width: '40%',
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
              Checkin and Grab Name Tag{" "}
            </Text>
            
            <ViewShot
            style={{
              transform: [{rotate: '90deg'}],
              position: "absolute",
              left: -1000,
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            options={{
            format: "jpg",
            quality: 1.0
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
        source={{ uri: route.params.logo }}
      />
          </ViewShot>
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
