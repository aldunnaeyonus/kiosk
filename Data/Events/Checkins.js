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
  const [logo, setLogo] = useState("");
  const [textValue, settextValue] = useState("");
  const [addedEmails, setaddedEmails] = useState([]);
  const baseUrl = "https://dunn-carabali.com/kiosk";

  function html1(fname, lname, status) {
    return `<html>
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=yes" />
  <style>
  body {
    width: 100%;
    vertical-align: center;
    margin: -1rem -1rem 1rem -1rem;
    horizontal-align: center;
  }
  .fname { 
    font-size: 5em; 
    font-weight: bolder; 
    text-align: center;
  }
  .lname {
    font-size: 3em; 
    font-weight: bold; 
    margin: -1rem -1rem 1rem -1rem;
    text-align: center;
  }
</style>
</head>
<body class="body">
<div class="fname">${fname}</div>
<div class="lname">${lname}<BR>
<span style="font-weight: lighter;">${status}</span></div>
</body>
</html>`;
  }

  function html2(fname, lname, status) {
    return `<html>
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=yes" />
        <style>
        body {
          width: 100%;
          vertical-align: center;
          margin: -1rem -1rem 1rem -1rem;
          horizontal-align: center;
        }
        .fname { 
          font-size: 5em; 
          font-weight: bolder; 
          text-align: center;
        }
        .lname {
          font-size: 3em; 
          font-weight: bold; 
          margin: -1rem -1rem 1rem -1rem;
          text-align: center;
        }
      </style>
      </head>
      <body class="body">
      <div class="fname">${fname}</div>
      <div class="lname">${lname}<BR>
      <span style="font-weight: lighter;">${status}</span></div>
      <BR><BR><BR>
      <div class="fname">${fname}</div>
      <div class="lname">${lname}<BR>
      <span style="font-weight: lighter;">${status}</span></div>
      </body>
    </html>`;
  }

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
          <FontAwesome
            style={{ paddingRight: 20 }}
            backgroundColor="white"
            borderRadius={17}
            size={28}
            color="black"
            name={"file-archive-o"}
            onPress={() => {
              Alert.alert(
                "Archive Event",
                "Are you sure you want to Archive this Event [" +
                  props.route.params.kiosk_event +
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
                      closeEvent();
                    },
                  },
                ],
                { cancelable: false }
              );
            }}
          />
        ) : (
          ""
        ),
    });
  }, [navigation]);

  useEffect(() => {
    setisFound(true);
  }, [isFocused]);

  const searchFilterFunction = async (text) => {
    if (text.length <= 0) {
      setFilteredDataSource([]);
      setisFound(true);
    } else {
      await fetch(
        baseUrl +
          "/search/index.php?email=" +
          text +
          "&pin=" +
          props.route.params.kiosk_owner
      )
        .then((response) => response.json())
        .then(async (jsonData) => {
          const myData = []
            .concat(jsonData)
            .sort((a, b) => (a.name > b.name ? 1 : -1));
          setFilteredDataSource(myData);
          if (myData.length <= 0) {
            setisFound(false);
          } else {
            setisFound(true);
          }
        });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLogo(baseUrl + "/logos/" + props.route.params.event_logo);
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

  const preview = (
    fname,
    lname,
    email,
    phone,
    kiosk_id,
    ifs_id,
    status,
    logo
  ) => {
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
              if (parseInt(props.route.params.prints) > 1){
                print2(Print.Orientation.landscape, fname, lname, status, logo);
              }else{
                print(Print.Orientation.landscape, fname, lname, status, logo);
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
        .then((response) => {
          addedEmails.push(email);

          setFilteredDataSource([]);
          setisFound(true);
          searchFilterFunction("");
          settextValue("");
          if (parseInt(props.route.params.prints) > 1){
            print2(Print.Orientation.landscape, fname, lname, status, logo);
          }else{
            print(Print.Orientation.landscape, fname, lname, status, logo);
          }
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
  /*
      .fname { 
        font-size: 15em; 
        font-weight: bolder; 
        text-align: center;
      }
      .lname {
        font-size: 10em; 
       text-align: center;
      }
      .status {
        font-size: 5em; 
        text-align: center;
      }
*/
  //const sleep = ms => new Promise(r => setTimeout(r, ms));

  const print2 = async (orientations, fname, lname, status, logo) => {
    await Print.printAsync({
      html:`<html>
    <head>
      <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=yes" />
      <style>
      body {
        width: 100%;
        vertical-align: center;
        margin: -1rem -1rem 1rem -1rem;
        horizontal-align: center;
      }
      .fname { 
        font-size: 5em; 
        font-weight: bolder; 
        text-align: center;
      }
      .lname {
        font-size: 3em; 
        font-weight: bold; 
        margin: -1rem -1rem 1rem -1rem;
        text-align: center;
      }
    </style>
    </head>
    <body class="body">
    <div class="fname">${fname}</div>
    <div class="lname">${lname}<BR>
    <span style="font-weight: lighter;">${status}</span></div>
    <BR><BR><BR>
    <div class="fname">${fname}</div>
    <div class="lname">${lname}<BR>
    <span style="font-weight: lighter;">${status}</span></div>
    </body>
    </html>`,
      orientation: orientations,
      width: 325.03937008,
      height: 226.77165354,
      useMarkupFormatter: true,
      printerUrl: url, // iOS only
    });
  };

  const print = async (orientations, fname, lname, status, logo) => {
    await Print.printAsync({
      html:`<html>
    <head>
      <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=yes" />
      <style>
      body {
        width: 100%;
        vertical-align: center;
        margin: -1rem -1rem 1rem -1rem;
        horizontal-align: center;
      }
      .fname { 
        font-size: 5em; 
        font-weight: bolder; 
        text-align: center;
      }
      .lname {
        font-size: 3em; 
        font-weight: bold; 
        margin: -1rem -1rem 1rem -1rem;
        text-align: center;
      }
    </style>
    </head>
    <body class="body">
    <div class="fname">${fname}</div>
    <div class="lname">${lname}<BR>
    <span style="font-weight: lighter;">${status}</span></div>
    </body>
    </html>`,
      orientation: orientations,
      width: 325.03937008,
      height: 226.77165354,
      useMarkupFormatter: true,
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
            item.status,
            props.route.params.event_logo
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
          <TouchableOpacity
            onPress={() => {
              preview(
                item.fname,
                item.lname,
                item.email,
                item.phone,
                props.route.params.kiosk_id,
                item.ifs_id,
                item.status,
                props.route.params.event_logo
              );
            }}
          >
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
              <Text
                style={{ color: "white", fontSize: 15, fontWeight: "bold" }}
              >
                Check In
              </Text>
            </View>
          </TouchableOpacity>
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
          searchFilterFunction(text);
          settextValue(text);
        }}
        keyboardType="default"
        underlineColorAndroid="transparent"
        placeholder="Search by Email or Name"
        value={textValue}
      />
      <View
        style={{
          height: 80,
          width: "90%",
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
          or your data can not be found, touch the red "Add An Attendee" button
          below to enter your information and print your name tag.
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("Add Attendee", {
            kiosk_id: props.route.params.kiosk_id,
            email: textValue,
            logo: props.route.params.event_logo,
            prints: props.route.params.prints,
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
            width: "50%",
            marginBottom: 30,
            marginTop: 20,
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
      </TouchableOpacity>

      <FlatList
        keyboardShouldPersistTaps="always"
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
