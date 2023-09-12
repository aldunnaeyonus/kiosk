import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Platform,
  Image,
  Alert,
  Keyboard
} from "react-native";
import React, { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from "@expo/vector-icons/FontAwesome";
FontAwesome.loadFont();
import SegmentedControlTab from "react-native-segmented-control-tab";
const baseUrl = "https://bigdogtools.com/kiosk";
import BRPtouchPrinter from 'react-native-brother-printers';
import { ALERT_TYPE, Dialog, Toast } from "react-native-alert-notification";
import axios from "axios";
import VersionCheck from 'react-native-version-check';

const EventList = (props) => {
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(0);
  const [kiosk_ids, setkiosk_ids] = useState(0);
  const [kiosk_name, setkiosk_name] = useState(0);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const isFocused = useIsFocused();
  const [isLoding, setisLoding] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [kiosk_is_ifs, setkiosk_is_ifs] = useState("0");
  
  const doSomething = async() =>{
    VersionCheck.needUpdate()
    .then(res => {
      if (res.isNeeded) {
        props.navigation.navigate("WebView", {
          url: 'https://apps.apple.com/us/app/big-dog-tags/id6447769349',
          name: "App Store",
        });
      }
    });
    const kiosk_id =
    Platform.OS !== "web"
      ? await AsyncStorage.getItem("kiosk_id")
      : window.localStorage.getItem("kiosk_id");
      const kioskifs = Platform.OS !== "web" ? await AsyncStorage.getItem("kiosk_is_ifs") : window.localStorage.getItem("kiosk_is_ifs");

  const kiosk_comapny_name =
    Platform.OS !== "web"
      ? await AsyncStorage.getItem("kiosk_comapny_name")
      : window.localStorage.getItem("kiosk_comapny_name");
  setkiosk_ids(kiosk_id);
  setkiosk_name(kiosk_comapny_name);
  setkiosk_is_ifs(""+kioskifs)
  props.navigation.setOptions({
    title: kiosk_comapny_name + " Events List",
  });
  fetch(
    baseUrl +
      "/events/index.php?kiosk_id=" +
      kiosk_id +
      "&active=" +
      active
  )
    .then((response) => response.json())
    .then((jsonData) => {
        setFilteredDataSource(jsonData.sort((a, b) => b.kiosk_event_timestamp < a.kiosk_event_timestamp));
        setMasterDataSource(jsonData.sort((a, b) => b.kiosk_event_timestamp < a.kiosk_event_timestamp));
        setisLoding(false)
    });
    }

    
  useEffect(() => {
    if (search.length > 1){
    const timer = setTimeout(() => {
      searchFilterFunction(search);
      Keyboard.dismiss();
    }, 1600)
    return () => clearTimeout(timer)
  }
  }, [search])

  const EmptyListMessage = ({ item }) => {
    return (
      <Image
        key={item}
        style={{
          flex: 1,
          width: 400,
          alignSelf: "center",
          flexDirection: "row",
          justifyContent: "center",
          height: 400,
        }}
        source={require("../../assets/2953962.jpg")}
      />
    );
  };
  const handleSingleIndexSelect = (index) => {
    setActive(index == 0 ? "0" : "1");
    setSelectedIndex(index);
    fetch(
      baseUrl +
        "/events/index.php?kiosk_id=" +
        kiosk_ids +
        "&active=" +
        index
    )
      .then((response) => response.json())
      .then(async (jsonData) => {
        setisLoding(false)
        setFilteredDataSource(jsonData.sort((a, b) => b.kiosk_event_timestamp < a.kiosk_event_timestamp));
        setMasterDataSource(jsonData.sort((a, b) => b.kiosk_event_timestamp < a.kiosk_event_timestamp));
      });
  };

  useEffect(() => {
    setisLoding(true)
    setActive(selectedIndex == 0 ? "0" : "1");
    doSomething();
  }, [isFocused]);

  useEffect(() => {
    async function fetchData () {
        try {
        if (await AsyncStorage.getItem("BrotherPrinterIP") != null){
          BRPtouchPrinter().discoverPrinters({}).then(async () => {
            Toast.show({
              onPress() {},
              type: ALERT_TYPE.SUCCESS,
              title: "Found a Printer",
              textBody: "The selected Printer's IP Address was found.",
              autoClose: 5000, // or time in ms by default 5000
            });
            pingPrinter(Platform.OS !== "web" ? await AsyncStorage.getItem("BrotherPrinterIP") : window.localStorage.getItem("BrotherPrinterIP"))
            .then((error) => {
              console.log(error);
            }).catch((err) => {
            });
          }).catch(() => {
            Toast.show({
              onPress() {},
              type: ALERT_TYPE.WARNING,
              title: "Failed to Find a Printer",
              textBody: "The selected Printer's IP Address could not be accessed, please go to the Select A Printer in the settings menu and search for a new printer.",
              autoClose: 5000, // or time in ms by default 5000
            });
          });
        }else{
          Dialog.show({
            onPress() {},
            type: ALERT_TYPE.WARNING,
            title: "Failed to Connect",
            textBody: "The selected Printer's IP Address could not be accessed, please go to the Select A Printer in the settings menu and search for a new printer.",
            autoClose: 5000, // or time in ms by default 5000
          });
        }
      } catch (error) {
      }
    };
    fetchData();
  }, []);


  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: kiosk_name + " Event List",
      headerRight: () => (
        <FontAwesome
          style={{ paddingRight: 20 }}
          backgroundColor="white"
          borderRadius={17}
          size={28}
          color="black"
          name={"sliders"}
          onPress={() => {
            props.navigation.navigate("Kiosk Settings", {
              kiosk_id: kiosk_ids,
            });
          }}
        />
      ),
    });
  });

  const searchFilterFunction = (text) => {
    if (text) {
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.kiosk_event_name
          ? item.kiosk_event_name.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };


  async function deleteEvent(id, pin, index) {
    setisLoding(true)
    fetch(
      baseUrl +
        "/events/delete.php?kiosk_id=" +
        id +
        "&active=" +
        active +
        "&kiosk_pin="+pin
    )
      .then((response) => response.json())
      .then(async (jsonData) => {
        handleRefresh();
        Toast.show({
          onPress() {},
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "Event was successfully deleted.",
          autoClose: 5000, // or time in ms by default 5000
        });
        setisLoding(false)
      })
      .catch((error) => {
        Toast.show({
          onPress() {},
          type: ALERT_TYPE.WARNING,
          title: "Connection Failed",
          textBody: "Server Connection Error: " + error,
          autoClose: 5000, // or time in ms by default 5000
        });
      });
  };

  
  function Item({ item, index }) {
    return (
      <TouchableOpacity
        onPress={() => {
          if (item.kiosk_event_status == "0") {

          Alert.alert(
            "Event Actions",
            "Choose a view mode:",
            [
              {
                text: "Kiosk Mode",
                onPress: () => {
                  props.navigation.navigate("Check In Attendees", {
                    kiosk_id: item.kiosk_event_id,
                    kiosk_event: item.kiosk_event_name,
                    kiosk_owner: item.kiosk_event_owner_id,
                    event_status: item.kiosk_event_status,
                    event_logo: item.kiosk_event_logo,
                    prints: item.kiosk_event_print,
                    mode: "KIOSK",
                  });
                },
              },
                {
                text: "Admin Mode",
                onPress: () => {
                  props.navigation.navigate("Check In Attendees", {
                    kiosk_id: item.kiosk_event_id,
                    kiosk_event: item.kiosk_event_name,
                    kiosk_owner: item.kiosk_event_owner_id,
                    event_status: item.kiosk_event_status,
                    event_logo: item.kiosk_event_logo,
                    prints: item.kiosk_event_print,
                    mode: "NORMAL",
                  });
                },
              },
              {
                text: "Edit Mode",
                onPress: () => {
                  props.navigation.navigate("Edit Mode", {
                    kiosk_id: item.kiosk_event_id,
                    kiosk_event: item.kiosk_event_name,
                    kiosk_owner: item.kiosk_event_owner_id,
                    ifs_mode: kiosk_is_ifs,
                  });
                },
              },
              {
                text: "Archive Event",
                onPress: () => {
                  Alert.alert(
                    "Archive Event",
                    "Are you sure you want to Archive this Event [" +
                    item.kiosk_event_name +
                      "]\n\nThis will prevent attendees from checking in.",
                    [
                      {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "destructive",
                      },
                      {
                        text: "Archive Event",
                        onPress: () => {
                          setisLoding(true)
    axios
      .post(
        baseUrl + "/events/close.php",
        {
          kiosk_id: item.kiosk_event_id,
        },
        {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
        }
      )
      .then(async (jsonData) => {
        setisLoding(false)
        handleRefresh();
        Toast.show({
          onPress() {},
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "Event was successfully archived.",
          autoClose: 5000, // or time in ms by default 5000
      })
      })
      .catch((error) => {
        setisLoding(false)
        Toast.show({
          onPress() {},
          type: ALERT_TYPE.WARNING,
          title: "Connection Failed",
          textBody: "Server Connection Error: " + error,
          autoClose: 5000, // or time in ms by default 5000
        });
      });
                        },
                      },
                    ],
                    { cancelable: false }
                  );
                },
              },
              {
                text: "Delete Event",
                onPress: () => {
                  Alert.alert(
                    "Delete Event",
                    "Are you sure you want to delete this event.",
                    [
                      {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "destructive",
                      },
                      {
                        text: "Delete Event",
                        onPress: async () => {
                          deleteEvent(item.kiosk_event_id, item.kiosk_event_owner_id, index)
                          }
                        }
                    ],
                    { cancelable: false }
                  );
                },
              },
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "destructive",
              },
            ],
            { cancelable: false }
          );
          } else {
              props.navigation.navigate("View Event Attendees", {
                kiosk_id: item.kiosk_event_id,
                logo: item.kiosk_event_logo,
                kiosk_event: item.kiosk_event_name,
              });
          }
        }}
      >
        <View style={styles.listItem}>
          <View
            style={{
              alignItems: "flex-start",
              marginStart: 15,
              flex: 1,
              justifyContent: "center",
            }}
          >
            {
              (item.kiosk_event_status == "0")  ?
              <Text
              style={{ fontWeight: "bold", fontSize: 21, color: "#000000" }}
            >
              {item.kiosk_event_name}
            </Text>
            :               <Text
            style={{ fontWeight: "bold", fontSize: 21, color: "red" }}
          >
            {item.kiosk_event_name}
          </Text>
            }
            <Text style={{ fontSize: 15, color: "#808080", paddingTop: 5 }}>
              {item.kiosk_event_location}
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
                color: "#808080",
                paddingTop: 5,
              }}
            >
              {item.kiosk_event_timestring}
            </Text>
          </View>
          <View
            style={{
              width: 80,
              height: 25,
              marginTop: 25,
              borderRadius: 40,
              flexDirection: "row",
              borderWidth: 1,
              borderColor: "#efefef",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#efefef",
            }}
          >
            <FontAwesome name="users" size={15} style={styles.whiteIcon2} />
            <Text
              style={{
                color: "#000000",
                fontSize: 15,
                padding: 0,
              }}
            >
              {item.kiosk_event_attendees}
            </Text>
          </View>
          <View
            style={{
              width: 100,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {item.kiosk_event_status == "0" ? (
              <FontAwesome
                name="chevron-right"
                size={20}
                style={styles.moreIcon}
              />
            ) : ""
            }
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  const handleRefresh = () => {
    handleSingleIndexSelect(selectedIndex)
    setisLoding(true);
  };

  

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInputStyle}
        autoCapitalize="words"
        onChangeText={(text) => setSearch(text)}
        underlineColorAndroid="transparent"
        placeholder="Search "
      />
      <View
        style={{
          height: 60,
          width: "60%",
          marginBottom: 30,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
        }}
      >
        <SegmentedControlTab
          values={["Active Events", "Closed Events"]}
          selectedIndex={selectedIndex}
          tabStyle={styles.tabStyle}
          tabTextStyle={styles.tabTextStyle}
          activeTabStyle={styles.activeTabStyle}
          onTabPress={handleSingleIndexSelect}
        />
      </View>
      <Text style={{margin:10, textAlign:'center'}}>Ensure the required printer under the settings menu is choosen before printing tags, this is incase of an IP Address or network change during device storage.</Text>

      <FlatList
        keyboardShouldPersistTaps="always"
        style={{ flex: 1 }}
        numColumns={1}
        ListEmptyComponent={EmptyListMessage}
        refreshing={isLoding}
        keyExtractor={item => item.kiosk_event_id}
        onRefresh={handleRefresh}
        data={filteredDataSource}
        renderItem={({ item, index }) => <Item item={item} index={index} />}
      />
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("Add New Event");
        }}
      >
        <View
          style={{
            height: 50,
            width: 200,
            marginBottom: 30,
            flexDirection: "row",
            borderRadius: 20,
            backgroundColor: "#007AFF",
            fontWeight: "bold",
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
            Create New Event{" "}
          </Text>
          <FontAwesome name="send" size={15} style={styles.whiteIcon} />
        </View>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  emptyListStyle: {
    padding: 10,
    fontSize: 18,
    textAlign: "center",
  },
  tabContent: {
    color: "#D52C43",
    fontSize: 18,
    margin: 24,
  },
  seperator: {
    marginHorizontal: -10,
    alignSelf: "stretch",
    borderTopWidth: 1,
    borderTopColor: "#888888",
    marginTop: 24,
  },
  tabStyle: {
    height: 44,
    borderColor: "#007AFF",
    color: "#007AFF",
  },
  tabTextStyle: {
    borderColor: "#007AFF",
    fontSize: 18,
    color: "#007AFF",
  },
  activeTabStyle: {
    backgroundColor: "#007AFF",
  },
  moreIcon: {
    color: "#5A5A5A",
    justifyContent: "center",
  },
  fileIcon: {
    color: "#009688",
    justifyContent: "center",
  },
  whiteIcon: {
    color: "#ffffff",
    justifyContent: "center",
  },
  whiteIcon2: {
    paddingRight: 5,
    color: "#000000",
    justifyContent: "center",
  },
  textInputStyle: {
    height: 60,
    borderWidth: 1,
    paddingLeft: 20,
    width: "90%",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 30,
    borderColor: "#dedede",
    borderRadius: 45,
    backgroundColor: "#FFFFFF",
    fontSize: 24,
  },
  listItem: {
    margin: 0.0,
    padding: 10,
    backgroundColor: "#FFF",
    width: "100%",
    height: 100,
    flex: 1,
    borderRadius: 0,
    borderBottomWidth: 0.5,
    borderColor: "#D3D3D3",
    justifyContent: "space-between",
    alignSelf: "center",
    flexDirection: "row",
  },
});
export default EventList;
