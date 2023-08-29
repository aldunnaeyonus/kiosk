import React, {useState, useEffect, useCallback} from 'react';
import { View, StyleSheet, Platform, Dimensions, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
const { width: ScreenWidth } = Dimensions.get("screen");
import { ListItem, Icon } from "@rneui/themed";
import InfoText from "../extras/InfoText";
import { SafeAreaProvider } from "react-native-safe-area-context";
import DropDownPicker from "react-native-dropdown-picker";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import VersionCheck from 'react-native-version-check';

MaterialCommunityIcons.loadFont();

  const Bluetooth = (props) => {
  const [title, settitle] = useState("");
  const [url, setURL] = useState("");
  const isFocused = useIsFocused();
  const baseUrl = "https://bigdogtools.com/kiosk";
  const [paper, setPaper] = useState([{label: "DK-1234 W60xH86 (Common)", value: "12"}, {label: "DK-2205 W62 RB", value: "23"}]);
  const [open, setOpen] = useState(false);
  const [valuepaper, setValuepaper] = useState("");
  const [checks, setChecked] = useState(false);

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

  const appstore = async () => {
    props.navigation.navigate("WebView", {
      url: "https://apps.apple.com/us/app/big-dog-tags/id6447769349",
      name: "App Store",
    });
  };
  
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
    props.navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
        onPress={async () => {
          await AsyncStorage.setItem("BrotherPrinterLabel", valuepaper)

                  props.navigation.goBack(null);
        }}
      >
        <MaterialCommunityIcons
          name="chevron-left"
          size={40}
          style={styles.moreIcon}
        />
      </TouchableOpacity>
      ),
    });
  });

  useEffect(() => {
    async function fetchData(){
      try {
        const kiosPrinterURL = Platform.OS !== "web" ? await AsyncStorage.getItem("BrotherPrinterIP") : window.localStorage.getItem("BrotherPrinterIP");
        const kiosPrinterTitle = Platform.OS !== "web" ? await AsyncStorage.getItem("BrotherPrinterName") : window.localStorage.getItem("BrotherPrinterName");

        if ((await AsyncStorage.getItem("BrotherPrinterLabel") == "10") || (await AsyncStorage.getItem("BrotherPrinterLabel") == null) ){
          await AsyncStorage.setItem("BrotherPrinterLabel", "12")
        setValuepaper("18");
        }else{
          const BrotherPrinterLabel = Platform.OS !== "web" ? await AsyncStorage.getItem("BrotherPrinterLabel") : window.localStorage.getItem("BrotherPrinterLabel");
          setValuepaper(BrotherPrinterLabel);
        }
        console.log(await AsyncStorage.getItem("useAirPrint"));
        if (await AsyncStorage.getItem("useAirPrint") == null){
          await AsyncStorage.setItem("useAirPrint", JSON.stringify(false))
          setChecked(JSON.stringify(false));
        }else{
          const useAirPrint = Platform.OS !== "web" ? await AsyncStorage.getItem("useAirPrint") : window.localStorage.getItem("useAirPrint");
          setChecked(JSON.parse(useAirPrint));
        }
        settitle(kiosPrinterTitle);
        setURL(kiosPrinterURL);
      } catch (error) {
        settitle("");
        setURL("");
      }
    };
    fetchData();
  }, [isFocused]);

  const selectPrinter = async () => {
    props.navigation.navigate("Select Printer");
  };

  return (
    <SafeAreaProvider style={{ backgroundColor:'white' }}>
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

            <InfoText text="Printers & Paper Size" />
            <View style={[styles.dividerTableStyle]} />

            <ListItem
                  containerStyle={{ paddingVertical: 5 }}
                  key="11"
                  onPress={async ()=> {
                    checks == true ? setChecked(false) : setChecked(true);
                    await AsyncStorage.setItem("useAirPrint", JSON.stringify(checks == true ? false : true))
                  }}
                >
                  <Icon
                    type="ionicon"
                    name="albums-outline"
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
                    <ListItem.Title>iOS Airprint / Direct Print</ListItem.Title>
                  </ListItem.Content>
                  <ListItem.CheckBox 
                  right 
                  checkedTitle='Using iOS AirPrint' 
                  title='Using Direct Print' 
                  checked={checks} 
                  onIconPress={async ()=> {
                    checks == true ? setChecked(false) : setChecked(true);
                    await AsyncStorage.setItem("useAirPrint", JSON.stringify(checks == true ? false : true))
                  }} 
                  iconRight={true}
                  />
                </ListItem>
                <View style={[styles.dividerTableStyleShort]} />
            
            <ListItem
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
                    <ListItem.Title>{url != null ? `Selected Printer: ${title} at IP: ${url}` : `Select Printer`}</ListItem.Title>
                  </ListItem.Content>
                  <ListItem.Chevron />
                </ListItem>
                <View style={[styles.dividerTableStyleShort]} />
                <ListItem
                  containerStyle={{ paddingVertical: 5}}
                  key="9"
                  onPress={selectPrinter}
                >
                  <Icon
                    type="ionicon"
                    name="document"
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
                   
          <DropDownPicker
            dropDownContainerStyle={{
              borderColor: "#000",
              backgroundColor: "white",
              borderWidth: 1.5,
              justifyContent: "center",
            }}
            style={{
              backgroundColor: "white",
              borderColor: "white",
              marginLeft: -10,
              marginTop: -5,
              justifyContent: "center",
            }}
            autoScroll={true}
            itemSeparator={true}
            itemSeparatorStyle={{
              backgroundColor: "#000",
              height: 0.5,
            }}
            open={open}
            placeholder="Select Paper Size"
            placeholderStyle={{ fontSize: 17 }}
            textStyle={{ fontSize: 17 }}
            value={valuepaper}
            items={paper}
            setOpen={setOpen}
            setValue={setValuepaper}
            setItems={setPaper}
          />
                  </ListItem.Content>
                </ListItem>

                <View style={[styles.dividerTableStyle]} />
            <InfoText style={{zIndex:-1}} text="Policies" />
            <View style={[styles.dividerTableStyle]} />
            <View style={{zIndex:-1}}>
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
            <View style={[styles.dividerTableStyleShort]} />
            <ListItem
              containerStyle={{ paddingVertical: 5 }}
              key="7"
              onPress={appstore}
            >
              <Icon
                type="ionicon"
                name="arrow-up-circle-outline"
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
                <ListItem.Title>Check for App Update</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>           
            <View style={[styles.dividerTableStyle]} />
            <ListItem
              containerStyle={{ paddingVertical: 0 }}
              key="11"
              onPress={{}}
            >
              <ListItem.Content>
              <ListItem.Title>v{VersionCheck.getCurrentVersion()}</ListItem.Title>
              </ListItem.Content>
            </ListItem> 
            </View>
        </View>
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
    zIndex:-1,
    height: 0.5,
    marginTop: 0,
    marginBottom: -20,
    borderRadius: 16,
    width: ScreenWidth * 0.9,
    alignSelf: "center",
    backgroundColor: "#ccc",
  },
  dividerTableStyle: {
    zIndex:-1,
    height: 0.5,
    marginTop: 10,
    marginBottom: 10,
    width: ScreenWidth * 1,
    alignSelf: "center",
    backgroundColor: "#ccc",
  },
  dividerTableStyleShort: {
    zIndex:-2,
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