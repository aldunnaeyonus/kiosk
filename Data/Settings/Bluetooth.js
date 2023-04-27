import React, {useState, useEffect, useCallback} from 'react';
import { View, StyleSheet, Platform, Dimensions, ScrollView, Alert } from 'react-native';
import * as Print from 'expo-print';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
const { width: ScreenWidth } = Dimensions.get("screen");
import { ListItem, Icon } from "@rneui/themed";
import InfoText from "../extras/InfoText";
import { SafeAreaProvider } from "react-native-safe-area-context";


  const Bluetooth = (props, navigation) => {

  const [selectedPrinter, setSelectedPrinter] = useState();
  const [title, settitle] = useState("");
  const [url, setURL] = useState("");
  const isFocused = useIsFocused();
  const baseUrl = "https://dunn-carabali.com/kiosk";

  const logout = async () => {
    await AsyncStorage.removeItem("printerURL");
    await AsyncStorage.removeItem("printerName");
    await AsyncStorage.removeItem("kiosk_id");
    await AsyncStorage.removeItem("kiosk_logo");
    await AsyncStorage.removeItem("kiosk_comapny_name");
    await AsyncStorage.removeItem("kiosk_is_ifs");
    await AsyncStorage.removeItem("logedIn");
    props.navigation.navigate("Kiosk Sign In");
  };

  const changeDetails = useCallback(async () => {
    props.navigation.navigate("Change Account Details", { title: "Change Account Details", kios_id: props.route.params.kiosk_id });
  }, []);


  const privacy = async () => {
    props.navigation.navigate("WebView", {
      url: baseUrl + "/privacyPolicy.html",
      name: "Privacy Policy",
    });
  };
  const terms = async () => {
    props.navigation.navigate("WebView", {
      url: baseUrl + "/termsUsePolicy.html",
      name: "Terms & Use",
    });
  };


  const changePassword = useCallback(() => {
    props.navigation.navigate("Change Password", { title: "Change Account Password", kios_id: props.route.params.kiosk_id });
  }, []);

  const preview = useCallback(() => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account. All information associated with this accound will be purged.',  
      [
         {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'destructive'},
         {text: 'Delete Account', onPress: () => {
          previewAction()
         }
        },
      ],
      { cancelable: false }
  );
  }, []);


      
const previewAction = () => {
  axios.post(baseUrl + '/profile/delete.php', {
    id: props.route.params.kiosk_id, 
}, {
  headers : {
    'Content-Type': 'application/json;charset=utf-8',

  }
})
        .then(response => {
          logout()
        })
      .catch(error => {
        alert(error);
    });
      };

  const deleteAccount = useCallback(() => {
    preview()    
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kiosPrinterURL = Platform.OS !== "web" ? await AsyncStorage.getItem("printerURL") : window.localStorage.getItem("printerURL");
        const kiosPrinterTitle = Platform.OS !== "web" ? await AsyncStorage.getItem("printerName") : window.localStorage.getItem("printerName");
        settitle(kiosPrinterTitle);
        setURL(kiosPrinterURL);
        setSelectedPrinter(kiosPrinterURL);
      } catch (error) {
        settitle("");
        setURL("");
      }
    };
    fetchData();
  }, [isFocused]);


  const selectPrinter = async () => {
    settitle("");
    setURL("");
    setSelectedPrinter("");
    const printer = await Print.selectPrinterAsync(); // iOS only
    await AsyncStorage.setItem("printerURL", printer.url);
    await AsyncStorage.setItem("printerName", printer.name);
    settitle(printer.name);
    setURL(printer.url);
    setSelectedPrinter(printer);
  };

  return (
    <SafeAreaProvider>
      <ScrollView keyboardShouldPersistTaps="always"
 style={styles.container}>
        <View style={{ width: "100%" }}>
          <View>
            <InfoText text="Account" />
            <View>
              <View style={[styles.dividerTableStyle]} />
              <ListItem
                containerStyle={{ paddingVertical: 5 }}
                key="1"
                onPress={changeDetails}
              >
                <Icon
                  type="ionicon"
                  name="person"
                  size={20}
                  color="white"
                  containerStyle={{
                    backgroundColor: "#5caad2",
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
                <ListItem.Content>
                  <ListItem.Title>Update Account Details</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
              <View style={[styles.dividerTableStyleShort]} />
              <ListItem
                containerStyle={{ paddingVertical: 5 }}
                key="2"
                onPress={changePassword}
              >
                <Icon
                  type="ionicon"
                  name="key"
                  size={20}
                  color="white"
                  containerStyle={{
                    backgroundColor: "orange",
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
                <ListItem.Content>
                  <ListItem.Title>Update Password</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
              <View style={[styles.dividerTableStyleShort]} />
              <ListItem
                containerStyle={{ paddingVertical: 5 }}
                key="4"
                onPress={deleteAccount}
              >
                 <Icon
                  type="ionicon"
                  name="close-circle-outline"
                  size={20}
                  color="white"
                  containerStyle={{
                    backgroundColor: "#FF3232",
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
                <ListItem.Content>
                  <ListItem.Title>Delete Account</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
              <View style={[styles.dividerTableStyleShort]} />
              <ListItem
              containerStyle={{paddingVertical: 5 }}
              key="8"
              onPress={logout}
            >
              <Icon
                type="ionicon"
                name="power"
                size={20}
                color="white"
                containerStyle={{
                  backgroundColor: "#FF3232",
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
              <ListItem.Content>
                <ListItem.Title>Logout</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
              <View style={[styles.dividerTableStyle]} />
            </View>

            {
            Platform.OS === 'ios' ? 
            <>
            <InfoText text="Printers" /><View style={[styles.dividerTableStyle]} /><ListItem
                  containerStyle={{ paddingVertical: 5 }}
                  key="3"
                  onPress={selectPrinter}
                >
                  <Icon
                    type="ionicon"
                    name="print"
                    size={20}
                    color="white"
                    containerStyle={{
                      backgroundColor: "#007AFF",
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      alignItems: "center",
                      justifyContent: "center",
                    }} />
                  <ListItem.Content>
                    <ListItem.Title>{title != null ? `Selected Printer: ${title}` : 'Select Printer'}</ListItem.Title>
                  </ListItem.Content>
                  <ListItem.Chevron />
                </ListItem><View style={[styles.dividerTableStyle]} /></>
                  : ""
                  }

            <InfoText text="More" />
            <View style={[styles.dividerTableStyle]} />
            <View>
            <ListItem
              containerStyle={{ paddingVertical: 5 }}
              key="6"
              onPress={privacy}
            >
              <Icon
                type="ionicon"
                name="copy"
                size={20}
                color="white"
                containerStyle={{
                  backgroundColor: "orange",
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
              <ListItem.Content>
                <ListItem.Title>Privacy Policy</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
            <View style={[styles.dividerTableStyleShort]} />
            <ListItem
              containerStyle={{ paddingVertical: 5 }}
              key="7"
              onPress={terms}
            >
              <Icon
                type="ionicon"
                name="ios-book-outline"
                size={20}
                color="white"
                containerStyle={{
                  backgroundColor: "#5caad2",
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
              <ListItem.Content>
                <ListItem.Title>Terms & Use Policy</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>            
            <View style={[styles.dividerTableStyle]} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaProvider>

  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  listItemContainer: {
    height: 55,
    borderWidth: 0.5,
    borderColor: "#ECECEC",
  },
  dividerStyle: {
    height: 0.5,
    marginTop: 0,
    marginBottom: -20,
    borderRadius: 16,
    width: ScreenWidth * 0.9,
    alignSelf: "center",
    backgroundColor: "#ccc",
  },
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
  header: {
    backgroundColor: "#00BFFF",
    flex: 1,
    height: 240,
    resizeMode: 'center'
  },
  drawerIc: {
    width: 35,
    height: 35,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    backgroundColor: "#b9d9ff",
    marginBottom: 10,
    alignSelf: "auto",
    position: "absolute",
    marginTop: 170,
    marginLeft: 10,
  },
  name: {
    fontSize: 20,
    position: "absolute",
    color: "#5A5A5A",
    fontWeight: "600",
    paddingLeft: 0,
    marginTop: -35,
  },
  body: {
    marginTop: 40,
  },
  bodyContent: {
    flex: 1,
    alignItems: "center",
    padding: 30,
  },
  names: {
    fontSize: 28,
    color: "#696969",
    fontWeight: "600",
  },
  info: {
    fontSize: 14,
    position: "absolute",
    alignSelf: "auto",
    color: "#b3b3b3",
    paddingLeft: 60,
    fontWeight: "600",
    marginTop: -10,
  },
});
export default Bluetooth;
/*
    <View >
          <Button title="Select printer" onPress={selectPrinter} />
          <View  />
          {selectedPrinter ? (
            <Text >{`Selected printer: ${title} via ${url}`}</Text>
          ) : undefined}
    </View>
    */