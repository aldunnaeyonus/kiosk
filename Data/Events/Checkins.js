import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  Keyboard,
} from "react-native";
import React, { useState, useEffect, useRef, createRef } from "react";
import { useIsFocused } from "@react-navigation/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
FontAwesome.loadFont();
import * as Print from "expo-print";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
MaterialCommunityIcons.loadFont();
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import ViewShot, { captureRef, releaseCapture } from "react-native-view-shot";
import { printImage } from "react-native-brother-printers";

const Checkins = (props, navigation) => {
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [isFound, setisFound] = useState(true);
  const isFocused = useIsFocused();
  const [logo, setLogo] = useState("");
  const [textValue, settextValue] = useState("");
  const [addedEmails, setaddedEmails] = useState([]);
  const baseUrl = "https://bigdogtools.com/kiosk";
  const [printer, setPrinter] = useState();
  const [labelWidth, setlabelWidth] = useState(252);
  const [labelHeight, setlabelHeight] = useState(172.79999999999998);
  let refs = useRef([]);

  
  useEffect(() => {
    props.navigation.setOptions({
      headerLeft: () =>
        props.route.params.mode === "NORMAL" ? (
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
                    onPress: () => {
                      console.log("Cancel Pressed");
                    },
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
        ) : (
          <TouchableOpacity
            delayLongPress={2000}
            onLongPress={() => {
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
              style={styles.moreIconWhite}
            />
          </TouchableOpacity>
        ),
      headerRight: () =>
        props.route.params.mode === "NORMAL" ? (
          <View style={{flexDirection:"row"}}>
          <FontAwesome
            style={{ paddingRight: 20 }}
            backgroundColor="white"
            borderRadius={17}
            size={28}
            color="black"
            name={"users"}
            onPress={() => {
              props.navigation.navigate("View Event Attendees", {
                kiosk_id: props.route.params.kiosk_id,
                logo: props.route.params.event_logo,
                kiosk_event: props.route.params.kiosk_event,
              });
            }}
          />
           </View>
        ) : (
          ""
        ),
    });
  }, [navigation]);
  
  function onCapture(index) {
    captureRef(refs.current[index], {
      format: "jpg",    
      quality: 0.9
    })
    .then(async (uri) => {
        printImage(printer, uri, { autoCut: true, labelSize: parseInt(await AsyncStorage.getItem("BrotherPrinterLabel"))})
        .then(() => {
          Toast.show({
            onPress() {},
            type: ALERT_TYPE.SUCCESS,
            title: "Printing Success",
            textBody: "Please grab your name tag.",
            autoClose: 5000, // or time in ms by default 5000
          });
            setFilteredDataSource([]);
            setisFound(true);
            searchFilterFunction("");
            settextValue("");
            releaseCapture(uri);
          })
          .catch((error) => {
            Toast.show({
              onPress() {},
              type: ALERT_TYPE.WARNING,
              title: "Connection Failed",
              textBody: error,
              autoClose: 5000, // or time in ms by default 5000
            });
          });
      },
      (error) => Toast.show({
        onPress() {},
        type: ALERT_TYPE.WARNING,
        title: "Connection Failed",
        textBody: error,
        autoClose: 5000, // or time in ms by default 5000
      })
    );
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      searchFilterFunction(textValue);
      Keyboard.dismiss();
    }, 750)

    return () => clearTimeout(timer)
  }, [textValue])

  const searchFilterFunction = async (text) => {
    if (text.length <= 0) {
      setFilteredDataSource([]);
      setisFound(true);
      refs = []
    } else {
      if (text.length >= 3) {
      await fetch(
        baseUrl +
          "/search/index.php?email=" +
          text +
          "&pin=" +
          props.route.params.kiosk_owner
      )
        .then((response) => response.json())
        .then(async (jsonData) => {
          setFilteredDataSource(jsonData.sort((a, b) => a.fullname < b.fullname));
        });
      if (text.length >= 3) {
        setisFound(false);
      } else {
        setisFound(true);
      }
    }
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLogo(baseUrl + "/logos/" + props.route.params.event_logo);
        const BrotherPrinter =
          Platform.OS !== "web"
            ? await AsyncStorage.getItem("BrotherPrinter")
            : window.localStorage.getItem("BrotherPrinter");
        setPrinter(JSON.parse(BrotherPrinter));
      } catch (error) {
        setPrinter("");
      }
    }
    fetchData();
  }, [isFocused]);

  useEffect(() => {
    setisFound(true);
  }, [isFocused]);

  const preview = (
    fname,
    lname,
    email,
    phone,
    kiosk_id,
    ifs_id,
    index
  ) => {
    if (addedEmails.includes(email)) {
      Alert.alert(
        "Duplicate Checkin",
        fname +
          " " +
          lname +
          " with email address with " +
          email +
          ", has already checked into this event.",
        [
          {
            text: "Cancel",
            onPress: () => {
              console.log("Cancel Pressed");
              setFilteredDataSource([]);
              setisFound(true);
              searchFilterFunction("");
              settextValue("");
            },
            style: "destructive",
          },
          {
            text: "Re-Print Tag",
            onPress: async () => {
          if (parseInt(props.route.params.prints) > 1) {
            if (JSON.parse(await AsyncStorage.getItem("useAirPrint")) == false){
                onCapture(index);
                onCapture(index);
            }else{
              setFilteredDataSource([]);
              setisFound(true);
              searchFilterFunction("");
              settextValue("");
              print2(fname, lname);
              }
              } else {
                if (JSON.parse(await AsyncStorage.getItem("useAirPrint")) == false){
                  onCapture(index);
              }else{
                setFilteredDataSource([]);
                setisFound(true);
                searchFilterFunction("");
                settextValue("");
                print(fname, lname);
                }
            }

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
        .then(async function () {
          addedEmails.push(email);
          setaddedEmails(addedEmails);
          if (parseInt(props.route.params.prints) > 1) {
            if (JSON.parse(await AsyncStorage.getItem("useAirPrint")) == false){
                onCapture(index);
                onCapture(index);
            }else{
              print2(fname, lname);
              setFilteredDataSource([]);
              setisFound(true);
              searchFilterFunction("");
              settextValue("");
              }
              } else {
                if (JSON.parse(await AsyncStorage.getItem("useAirPrint")) == false){
                  onCapture(index);
              }else{
                print(fname, lname);
                setFilteredDataSource([]);
                setisFound(true);
                searchFilterFunction("");
                settextValue("");
                }
            }
        })
        .catch((error) => {
          Toast.show({
            onPress() {},
            type: ALERT_TYPE.WARNING,
            title: "Connection Failed",
            textBody: error,
            autoClose: 5000, // or time in ms by default 5000
          });
        });
    }
  };

  const print2 = async (fname, lname) => {
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
      <BR><BR>
      <div class="fname">${fname}</div>
      <div class="lname">${lname}</div>
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
        textBody: error,
        autoClose: 5000, // or time in ms by default 5000
      });
    });
  };

  const print = async (fname, lname) => {
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
        textBody: error,
        autoClose: 5000, // or time in ms by default 5000
      });
    });
  };

  function Item({ item, index }) {
    refs.current[index] = createRef();

    return (
      <TouchableOpacity
        onPress={async () => {
          preview(
            item.fname,
            item.lname,
            item.email,
            item.phone,
            props.route.params.kiosk_id,
            item.ifs_id,
            index
          );
        }}
      >
                  <View style={styles.listItem}>

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
            quality: 0.9
            }}
            ref={refs.current[index]}
          >
            <Text
              style={{
                fontSize: 50,
                fontFamily: 'Avenir',
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {item.fname}
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
              {item.lname}
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
        source={{ uri: logo }}
      />
          </ViewShot>

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
            { 
            item.status != "" ? 
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
              
<FontAwesome name="id-badge" size={12} style={styles.whiteIcon} /><Text
                    style={{
                      color: "#000000",
                      fontSize: 12,
                    }}
                  >
                    {item.status}
                  </Text>
            </View>
                          : ""
              }
          </View>
            <View
              style={{
                width: 90,
                height: 40,
                marginTop: item.status != "" ? 18 : 2,
                justifyContent: "center",
                backgroundColor: "#2E8B57",
                alignSelf: "center",
                alignItems: "center",
                borderRadius: 45,
              }}
            >
              <Text
                style={{ color: "white", fontSize: 15, fontWeight: "bold" }}
              >
                Checkin
              </Text>
            </View>
          </View>
      </TouchableOpacity>
    );
  }

  
  return (
    
    <View style={styles.container}>

      <Image
        resizeMode="contain"
        resizeMethod="auto"
        style={{
          width: "100%",
          marginTop: 10,
          height: "10%",
          alignSelf: "center",
          flexDirection: "row",
          justifyContent: "center",
        }}
        source={{ uri: logo }}
      />

      <TextInput
        autoCapitalize="words"
        style={styles.textInputStyle}
        onChangeText={(text) => {
          settextValue(text);
        }}
        keyboardType="default"
        underlineColorAndroid="transparent"
        placeholder="Search by Email or Name"
        value={textValue}
      />

      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("Add Attendee", {
            kiosk_id: props.route.params.kiosk_id,
            email: textValue,
            logo: props.route.params.event_logo,
            prints: props.route.params.prints,
            searchText: textValue,
            prints: props.route.params.prints,
            pin: props.route.params.kiosk_id
          });
          setFilteredDataSource([]);
          setisFound(true);
          searchFilterFunction("");
          settextValue("");
        }}
      >
        {!isFound ? (
          <View
            style={{
              height: 50,
              width: "50%",
              marginBottom: 10,
              marginTop: 0,
              flexDirection: "row",
              borderRadius: 100,
              backgroundColor: "white",
              borderWidth: 2,
              borderColor: "red",
              fontWeight: "bold",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                color: "red",
                fontWeight: "bold",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 20,
              }}
            >
              Add An Attendee
            </Text>
          </View>
        ) : (
          ""
        )}
      </TouchableOpacity>

      <FlatList
        onScrollBeginDrag={() => Keyboard.dismiss()}
        ListEmptyComponent={
          <View
            style={{
              height: "100%",
              width: "90%",
              marginTop: 20,
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
                color: "black",
                justifyContent: "center",
                alignSelf: "center",
                alignItems: "center",
                fontSize: 20,
                textAlign: "center",
              }}
            >

              1. Enter an email address or the first and last name of the
              attendee in the search bar above.{"\n\n"}2. Find your name.{"\n\n"}3. Touch the green checkin button next to the
              attendee name.{"\n\n"}4. Grab your printed name tag.{"\n\n\n"}Note: If your information can not be found, touch the
              red "Add An Attendee" button that will show after you begin typing. And on the next screen enter your information and print your name tag.
            </Text>
          </View>
        }
        keyboardShouldPersistTaps="always"
        style={{ flex: 1 }}
        data={filteredDataSource}
        renderItem={({ item, index }) => <Item item={item} index={index} /> }
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
    width: "90%",
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
    marginLeft: 5,
    justifyContent: "center",
  },
  moreIconWhite: {
    marginLeft: -5,
    color: "transparent",
    justifyContent: "center",
  },
});
export default Checkins;
