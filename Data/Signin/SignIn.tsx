import LoginScreen from "react-native-login-screen";
import React, { Component } from "react";
import { sha256 } from "js-sha256";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Props {
  navigation: any;
}
const baseUrl = "https://dunn-carabali.com/kiosk";

export default class SignIn extends Component<Props> {
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
        loginButtonText={"Login"}
        disableDivider={false}
        disableSignup={true}
        logoImageSource={require("../../assets/emptyList.png")}
        disableSocialButtons={true}
        onSignupPress={() => {}}
        onLoginPress={() => {
          fetch(
            baseUrl +
              "/users/index.php?email=" +
              this.emails +
              "&password=" +
              sha256(this.passwords)
          )
            .then((response) => response.json())
            .then(async (jsonData) => {
              if (jsonData[0].errResponse == "3") {
                alert("");
              } else {
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
              }
            });
        }}
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
