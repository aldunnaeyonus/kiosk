import LoginScreen from "react-native-login-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { sha256 } from "js-sha256";
const baseUrl = "https://bigdogtools.com/kiosk";

interface Props {
  navigation: any;
}

export default class Register extends Component<Props> {
  emails: any;
  passwords: any;

  constructor(props: Props) {
    super(props);
    this.emails = "";
    this.passwords = "empty";
  }
  render() {
    return (
      <LoginScreen
        logoImageSource={require("../../assets/register.png")}
        disableSocialButtons={true}
        onLoginPress={() => {
          let re =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (this.passwords.length < 6) {
            Toast.show({
              type: ALERT_TYPE.DANGER,
              title: "Password",
              textBody: "Password can not be blank or less than 6 characters.",
              autoClose: 3000, // or time in ms by default 5000
            });
          } else if (this.emails.length <= 0) {
            Toast.show({
              type: ALERT_TYPE.DANGER,
              title: "E-Mail Address",
              textBody: "E-Mail address can not be left blank.",
              autoClose: 3000, // or time in ms by default 5000
            });
          } else if (!re.test(this.emails)) {
            Toast.show({
              type: ALERT_TYPE.DANGER,
              title: "E-Mail Address",
              textBody: "E-Mail address is not correctly formatted.",
              autoClose: 3000, // or time in ms by default 5000
            });
          } else {
            fetch(
              baseUrl +
                "register/index.php?email=" +
                this.emails +
                "&password=" +
                sha256(this.passwords)
            )
              .then((response) => response.json())
              .then(async (jsonData) => {
                if (jsonData[0].errResponse === "Good") {
                  try {
                    await AsyncStorage.setItem("kiosk_id", jsonData[0].kiosk_pin);
                    await AsyncStorage.setItem(
                      "kiosk_logo",
                      jsonData[0].kiosk_logo
                    );
                    await AsyncStorage.setItem(
                      "kiosk_comapny_name",
                      jsonData[0].kiosk_comapny_name
                    );
                    await AsyncStorage.setItem(
                      "kiosk_is_ifs",
                      jsonData[0].kiosk_is_ifs
                    );
                    await AsyncStorage.setItem("logedIn", "true");

                    this.props.navigation.navigate("Event List");

                  } catch (error) {
                    Toast.show({
                      onPress() {},
                      type: ALERT_TYPE.WARNING,
                      title: "Connection Failed",
                      textBody: "Server Connection Error: " + error,
                      autoClose: 5000, // or time in ms by default 5000
                    });
                  }
                } else if (jsonData[0].errResponse === "exists") {
                  Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: "E-Mail Address.",
                    textBody: "E-Mail address already exists.",
                    autoClose: 5000, // or time in ms by default 5000
                  });
                } else if (jsonData[0].errResponse === "missing context") {
                  Toast.show({
                    onPress() {},
                    type: ALERT_TYPE.DANGER,
                    title: "System Error",
                    textBody:
                      "The data could not be written to the database, please try again.",
                    autoClose: 5000, // or time in ms by default 5000
                  });
                }
              })
              .catch((error) => {
                Toast.show({
                  onPress() {},
                  type: ALERT_TYPE.WARNING,
                  title: "Error",
                  textBody: "Error: " + error,
                  autoClose: 3000, // or time in ms by default 5000
                });
              });
          }
        }}
        loginButtonText={"Register"}
        disableDivider={true}
        disableSignup={true}
        onSignupPress={() => {}}
        onEmailChange={(email: string) => {
          this.emails = email;
        }}
        onPasswordChange={(password: string) => {
          this.passwords = password;
        }}
      ></LoginScreen>
    );
  }
}
