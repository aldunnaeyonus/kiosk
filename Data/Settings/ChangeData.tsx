import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { TextInput } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
const { width: ScreenWidth } = Dimensions.get("screen");
import AsyncStorage from "@react-native-async-storage/async-storage";


const ChangeData = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  const [myEmail, setMyEmail] = useState("");
  const [myName, setMyName] = useState("");
  const [myMobile, setmyMobile] = useState("");
  const baseUrl = "https://dunn-carabali.com/kiosk";

  useEffect(() => {
    const fetchData = async () => {
      fetch(
        baseUrl + "/profile/fetch.php?kiosk_id=" + route.params.kios_id
      )
        .then((response) => response.json())
        .then(async (jsonData) => {
          setMyEmail(jsonData[0].email);
          setMyName(jsonData[0].name);
          setmyMobile(jsonData[0].mobile);
          await AsyncStorage.setItem("kiosk_comapny_name", jsonData[0].name);
        });
    };
    fetchData();
  }, [isFocused]);

  async function fetchCode(name: any, email: any, mobile: any) {
    if (
      name.length <= 0 ||
      name.length <= 0 ||
      name.length === null ||
      name.length === null
    ) {
      /*Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Entry Error",
        textBody:
          "Password and Company Name Field cannot be left blank, please try again.",
        autoClose: 3000, // or time in ms by default 5000
      });*/
    } else {
      fetch(
        baseUrl +
          "/profile/save.php?id=" +
          route.params.kios_id +
          "&email=" +
          email +
          "&name=" +
          name +
          "&mobile=" +
          mobile
      )
        .then((response) => response.json())
        .then(async (jsonData) => {
          await AsyncStorage.setItem("kiosk_comapny_name", name);
          /*Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: "Information",
            textBody: "Profile information was updated and saved successfully.",
            autoClose: 2000, // or time in ms by default 5000
          });*/
        })
        .catch((error) => {
          /*Toast.show({
            type: ALERT_TYPE.WARNING,
            title: "Connection Failed",
            textBody: "Server Connection Error: " + error,
            autoClose: 3000, // or time in ms by default 5000
          });*/
        });
    }
  }

  useEffect(() => {
    const fetchData = async () => {};
    fetchData();
  }, [isFocused]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.title,
      headerRight: () => (
        <Text
          style={{ marginRight: 10 }}
          onPress={() => {
            fetchCode(myName, myEmail, myMobile);
          }}
        >
          {" "}
          Save{" "}
        </Text>
      ),
    });
  });

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View
        style={{
          marginTop: 180,
          width: "100%",
          height: 60,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TextInput
          left={
            <TextInput.Icon size={20} iconColor="#007AFF" icon="tag-outline" />
          }
          style={{
            backgroundColor: "transparent",
            width: "100%",
            height: 60,
          }}
          mode="flat"
          dense={true}
          activeUnderlineColor="#fff"
          underlineColor="white"
          keyboardType="default"
          selectionColor="#000"
          value={myName}
          label="Company Name"
          onChangeText={(text) => {
            setMyName("" + text);
          }}
        />
        <View style={[styles.dividerTableStyleShort]} />

        <TextInput
          left={
            <TextInput.Icon
              size={20}
              iconColor="#007AFF"
              icon="email-outline"
            />
          }
          style={{
            backgroundColor: "white",
            width: "100%",
            height: 60,
            justifyContent: "center",
          }}
          mode="flat"
          dense={true}
          keyboardType="email-address"
          underlineColor="white"
          activeUnderlineColor="#fff"
          label="Login Email"
          selectionColor="#000"
          value={myEmail}
          onChangeText={(text) => {
            setMyEmail("" + text);
          }}
        />
        <View style={[styles.dividerTableStyleShort]} />

        <TextInput
          left={
            <TextInput.Icon
              size={20}
              iconColor="#007AFF"
              icon="cellphone-message"
            />
          }
          style={{
            backgroundColor: "white",
            width: "100%",
            height: 60,
            justifyContent: "center",
          }}
          mode="flat"
          underlineColor="white"
          maxLength={10}
          dense={true}
          keyboardType="phone-pad"
          activeUnderlineColor="#fff"
          selectionColor="#000"
          label="Mobile Number"
          value={myMobile}
          placeholder="0000000000"
          onChangeText={(text) => {
            setmyMobile("" + text);
          }}
        />
        <View style={[styles.dividerTableStyleShort]} />

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
                  marginLeft: 40,
                  marginTop: 45,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
                size={20}
                icon="database"
              />
              <Text
                style={{
                  marginLeft: 55,
                  marginTop: 22,
                  fontSize: 18,
                  color: "black",
                }}
              >
                Use Infustionsoft Database </Text>

                </View>

                <View style={[styles.dividerTableStyle]} />
    
        <Text
          style={{
            fontSize: 13,
            color: "#5A5A5A",
            height: 60,
            textAlign: "center",
            marginTop: 20,
            marginLeft: 20,
            marginRight: 20,
          }}
        >
          Tap Save, once all entries are complete to save profile information.~
          {"\n"}
          Mobile Numbers will only be used to send temporary codes to reset a
          password.~{"\n"}Messaging and data rates will apply.
        </Text>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  dividerTableStyle: {
    height: 0.5,
    marginTop: 10,
    marginBottom: 10,
    width: ScreenWidth * 1,
    alignSelf: "center",
    backgroundColor: "#ccc",
  },
  dividerTableStyleShort: {
    height: 0.5,
    marginTop: 10,
    marginBottom: 10,
    width: ScreenWidth * 0.9,
    alignSelf: "center",
    backgroundColor: "#ccc",
  },
});
export default ChangeData;
