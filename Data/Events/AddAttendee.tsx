import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Platform,
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

const AddAttendee = ({ navigation, props }) => {
  const [fname, setfname] = useState("");
  const [lname, setlname] = useState("");
  const [email, setemail] = useState("");
  const [phone, setphone] = useState("");
  const isFocused = useIsFocused();
  const [url, setURL] = useState("");
  const baseUrl = "https://dunn-carabali.com/kiosk";
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kiosPrinterURL =
          Platform.OS !== "web"
            ? await AsyncStorage.getItem("printerURL")
            : window.localStorage.getItem("printerURL");
        setURL("" + kiosPrinterURL);
      } catch (error) {
        setURL("");
      }
    };
    fetchData();
  }, [isFocused]);

  const print = async (orientations: any, fname: any, lname: any, status: any) => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    await Print.printAsync({
      html: `
      <html>
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=yes" />
        <style>
          @page {
            margin: 0;
          }
          #body {
            zoom:500%
            height: '100%';
            width: '100%';
            margin: 0;
            padding: 0;
            overflow: hidden;
            align-items: center;
            justify-content: center;
          }
          #content {
            position: relative;
        }
         #content img {
            position: absolute;
            top: 0px;
            right: 0px;
        }
        </style>
      </head>
      <body id="body"">
      <div style="font-size: 55vw; font-weight: bolder; width:'100%'; text-align: center;">${fname}<div>
      <div style="font-size: 35vw;  width:'100%';  margin: 0 auto; text-align: center;">${lname}<div>
      <div style="font-size: 25vw;  width:'100%';  margin: 0 auto; text-align: center;">${status}<div>
      </body>
    </html>
      `,
      orientation: orientations,
      printerUrl: url, // iOS only
    });
  };

  const preview = (fname: any, lname: any, email: any, phone: any, kiosk_id: any, ifs_id: any, status: any) => {
    if (fname.length <= 0 || lname.length <= 0 || email.length <= 0) {
      alert("Your name and email address are required entries.");
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
          },
          {
            headers: {
              "Content-Type": "application/json;charset=utf-8",
            },
          }
        )
        .then((response) => {
          print(Print.Orientation.landscape, fname, lname, status);
          navigation.goBack(null);
        })
        .catch((error) => {
          alert(error);
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
                          iconColor='#007AFF'
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
                          iconColor='#007AFF'
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
                          iconColor='#007AFF'
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
                          iconColor='#007AFF'
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
          onPress={() => {
            preview(
              fname,
              lname,
              email,
              phone,
              props.route.params.kiosk_id,
              "0",
              "Guest"
            );
          }}
        >
          <View
            style={{
              height: 50,
              width: 300,
              marginTop: 50,
              flexDirection: "row",
              borderRadius: 20,
              backgroundColor: "#007AFF",
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
            >{" "} Create User & Chek In {" "} </Text>
            <FontAwesome name="check" size={15} style={styles.whiteIcon} />
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
