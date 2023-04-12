import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { TextInput } from "react-native-paper";
import { ALERT_TYPE, Toast, Dialog } from "react-native-alert-notification";
import { sha256 } from "js-sha256";
import { SafeAreaProvider } from "react-native-safe-area-context";
const { width: ScreenWidth } = Dimensions.get("screen");

const ChangePassword = ({ navigation, route }) => {
  const [userPassword, setuserPassword] = useState("");
  const [userPassword2, setuserPassword2] = useState("");
  const baseUrl = "https://dunn-carabali.com/kiosk";

  async function fetchCode(password: any, password2: any) {
    if (
      password !== password2 ||
      (password.length <= 0 && password.length <= 0)
    ) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Password Error",
        textBody: "Passwords do not match or are blank, please try again.",
        autoClose: 3000, // or time in ms by default 5000
      });
    } else {
      fetch(
        baseUrl +
          "/profile/password.php?id=" +
          route.params.kios_id +
          "&password=" +
          sha256(password)
      )
        .then((response) => response.json())
        .then(async (jsonData) => {
          Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: "Password",
            textBody: "Profile password was updated and saved successfully.",
            autoClose: 2000, // or time in ms by default 5000
          });
        })
        .catch((error) => {
          Toast.show({
            type: ALERT_TYPE.WARNING,
            title: "Connection Failed",
            textBody: "Server Connection Error: " + error,
            autoClose: 3000, // or time in ms by default 5000
          });
        });
    }
  }

  useEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.title,
      headerRight: () => (
        <Text
          style={{ marginRight: 10 }}
          onPress={() => {
            fetchCode(userPassword, userPassword2);
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
      <View style={{ width: "100%" }}></View>
      <View
        style={{
          marginTop: 102,
          width: "100%",
          height: 60,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TextInput
          left={
            <TextInput.Icon size={20} iconColor="#007AFF" icon="form-textbox" />
          }
          style={{
            backgroundColor: "white",
            width: "100%",
            height: 60,
            justifyContent: "center",
          }}
          mode="flat"
          dense={true}
          underlineColor="white"
          keyboardType="default"
          activeUnderlineColor="#fff"
          placeholder="Enter Password"
          selectionColor="#000"
          label="Enter Password"
          onChangeText={(text) => {
            setuserPassword("" + text);
          }}
        />
        <View style={[styles.dividerTableStyleShort]} />

        <TextInput
          left={
            <TextInput.Icon
              size={20}
              iconColor="#007AFF"
              icon="form-textbox-lock"
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
          keyboardType="default"
          underlineColor="white"
          activeUnderlineColor="#fff"
          selectionColor="#000"
          placeholder="Confirm Password"
          label="Confirm Password"
          onChangeText={(text) => {
            setuserPassword2("" + text);
          }}
        />
        <View style={[styles.dividerTableStyle]} />

        <Text
          style={{
            fontSize: 13,
            color: "#5A5A5A",
            height: 60,
            textAlign: "center",
            marginTop: 30,
            marginLeft: 20,
            marginRight: 20,
          }}
        >
          Please do not enter a password, leave both fields blank, unless the
          intent is to change the current password.
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
export default ChangePassword;
