import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
FontAwesome.loadFont();
import * as Print from "expo-print";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
MaterialCommunityIcons.loadFont();
import { ALERT_TYPE, Dialog, Toast } from "react-native-alert-notification";
  
const Checkins = (props, navigation) => {
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [isFound, setisFound] = useState(true);
  const isFocused = useIsFocused();
  const [url, setURL] = useState("");
  const [textValue, settextValue] = useState("");
  const [addedEmails, setaddedEmails] = useState([]);
  const baseUrl = "https://dunn-carabali.com/kiosk";

  const closeEvent = () => {
    axios
      .post(
        baseUrl + "/events/close.php",
        {
          kiosk_id: props.route.params.kiosk_id,
        },
        {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
        }
      )
      .then((response) => {
        props.navigation.goBack(null);
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

  useEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              "Exit Out",
              "Are you sure you want to exit out of this Event [" +
                props.route.params.kiosk_event +
                "]\n\nThis will erase the duplicate email checker",
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "destructive",
                },
                {
                  text: "Go back",
                  onPress: () => {
                    props.navigation.goBack(null);
                  },
                },
              ],
              { cancelable: false }
            );
          }}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={40}
            style={styles.moreIcon}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <Button
          textStyle={{
            color: "white",
          }}
          color="red"
          title="Close Event"
          onPress={() => {
            Alert.alert(
              "Close Checkin",
              "Are you sure you want to close out this Event [" +
                props.route.params.kiosk_event +
                "]\n\nThis will prevent attendees from checking in.",
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "destructive",
                },
                {
                  text: "Close Event Checkin",
                  onPress: () => {
                    closeEvent();
                  },
                },
              ],
              { cancelable: false }
            );
          }}
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    setisFound(true);
  }, [isFocused]);

  const searchFilterFunction = async (text) => {
    if (text.length <= 0){
      setFilteredDataSource([]);
      setisFound(true);
    }else{
    await fetch(baseUrl + "/search/index.php?email=" + text+"&pin="+props.route.params.kiosk_owner)
      .then((response) => response.json())
      .then(async (jsonData) => {
        const myData = []
          .concat(jsonData)
          .sort((a, b) => (a.name > b.name ? 1 : -1));
        setFilteredDataSource(myData);
        if (myData.length <= 0){
          setisFound(false);
        }else{
        setisFound(true);
        }
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kiosPrinterURL =
          Platform.OS !== "web"
            ? await AsyncStorage.getItem("printerURL")
            : window.localStorage.getItem("printerURL");
        setURL(kiosPrinterURL);
      } catch (error) {
        setURL("");
      }
    };
    fetchData();
  }, [isFocused]);

  const preview = (fname, lname, email, phone, kiosk_id, ifs_id, status) => {
    if (addedEmails.includes(email)) {
      Alert.alert(
        "Duplicate Checkin",
        fname +
          " " +
          lname +
          " with email address of" +
          email +
          " has already checked in.",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "destructive",
          },
          {
            text: "Re-Print Tag",
            onPress: () => {
              print(Print.Orientation.landscape, fname, lname, status);
            },
          },
        ],
        { cancelable: false }
      );
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
            pin: props.route.params.kiosk_id,
          },
          {
            headers: {
              "Content-Type": "application/json;charset=utf-8",
            },
          }
        )
        .then((response) => {
          addedEmails.push(email);

          setFilteredDataSource([]);
          setisFound(true);
          searchFilterFunction("");
          settextValue("");
          print(Print.Orientation.landscape, fname, lname, status);
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
    }
  };

  const print = async (orientations, fname, lname, status) => {
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

  function Item({ item }) {
    return (
      <TouchableOpacity
        onPress={() => {
          preview(
            item.fname,
            item.lname,
            item.email,
            item.phone,
            props.route.params.kiosk_id,
            item.ifs_id,
            item.status
          );
        }}
      >
        <View style={styles.listItem}>
          <View style={{ alignItems: "flex-start", marginStart: 15, flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesome name="tag" size={12} style={styles.whiteIcon2} />
              <Text style={{ fontWeight: "bold", marginTop: 5 }}>
                {item.fname} {item.lname}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesome
                name="envelope-o"
                size={12}
                style={styles.whiteIcon2}
              />
              <Text style={{ marginTop: 5 }}>{item.email}</Text>
            </View>
            <View
              style={{
                width: 100,
                marginTop: 5,
                marginBottom: 5,
                height: 25,
                borderRadius: 40,
                flexDirection: "row",
                borderWidth: 1,
                borderColor: "#efefef",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#efefef",
              }}
            >
              <FontAwesome name="id-badge" size={12} style={styles.whiteIcon} />
              <Text
                style={{
                  color: "#000000",
                  fontSize: 12,
                }}
              >
                {item.status}
              </Text>
            </View>
          </View>

          <View
            style={{
              width: 90,
              height: 40,
              justifyContent: "center",
              backgroundColor: "#2E8B57",
              alignSelf: "center",
              alignItems: "center",
              borderRadius: 45,
            }}
          >
            <Text style={{ color: "white", fontSize: 15, fontWeight: "bold" }}>
              Check In
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInputStyle}
        onChangeText={(text) => {
          searchFilterFunction(text);
          settextValue(text);
        }}
        keyboardType="default"
        underlineColorAndroid="transparent"
        placeholder="Search by Email or First & Last name"
        value={textValue}
      />
      <View
        style={{
          height: 50,
          width: "75%",
          marginBottom: 30,
          marginTop: -20,
          flexDirection: "row",
          borderRadius: 100,
          fontWeight: "bold",
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
        }}
      >
        <Text
          style={{
            color: "gray",
            justifyContent: "center",
            alignSelf: "center",
            alignItems: "center",
            fontSize: 15,
            textAlign: "center",
          }}
        >
          Enter an email address or first and last name.{"\n"}If you are a guest
          or your data can not be found, type in your email and you will be
          guided on how to register.
        </Text>
      </View>
      {isFound ? (
        <View></View>
      ) : (
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("Add Attendee", {
              kiosk_id: props.route.params.kiosk_id,
              email: textValue,
            });
            addedEmails.push(textValue);
            setFilteredDataSource([]);
            setisFound(true);
            searchFilterFunction("");
            settextValue("");
          }}
        >
          <View
            style={{
              height: 50,
              width: "75%",
              marginBottom: 30,
              marginTop: 30,
              flexDirection: "row",
              borderRadius: 100,
              backgroundColor: "red",
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
                fontSize: 20,
              }}
            >
              Attendee Not Found, Touch to Add
            </Text>
          </View>
        </TouchableOpacity>
      )}

      <FlatList
        style={{ flex: 1 }}
        data={filteredDataSource}
        renderItem={({ item }) => <Item item={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  textInputStyle: {
    height: 60,
    borderWidth: 1,
    paddingLeft: 20,
    width: "60%",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 30,
    borderColor: "#dedede",
    borderRadius: 45,
    backgroundColor: "#FFFFFF",
    fontSize: 24,
  },
  whiteIcon2: {
    marginTop: 3,
    paddingRight: 5,
    color: "#5A5A5A",
    justifyContent: "center",
  },
  whiteIcon: {
    paddingRight: 5,
    color: "#000000",
    justifyContent: "center",
  },
  listItem: {
    margin: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#FFF",
    borderBottomWidth: 0.5,
    borderColor: "#D3D3D3",
    width: "100%",
    flex: 1,
    alignSelf: "center",
    flexDirection: "row",
  },
  moreIcon: {
    marginLeft: -5,
    justifyContent: "center",
  },
});
export default Checkins;
