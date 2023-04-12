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
const baseUrl = "https://dunn-carabali.com/kiosk";
const html = `
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
<style type="text/css" media="screen"></style>

<style type="text/css" media="print">
 
/* @page {size:landscape}  */   
body {
    page-break-before: avoid;
    width:200;
    height:200;
    -webkit-transform: rotate(-90deg) scale(.68,.68); 
    -moz-transform:rotate(-90deg) scale(.58,.58);
    zoom: 100%    
  }

</style>
</head>
<body style="text-align: center;">
<h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
  Hello Expo!
</h1>
</body>
</html>
`;

const Checkins = (props, navigation) => {
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [isFound, setisFound] = useState(true);
  const isFocused = useIsFocused();
  const [url, setURL] = useState("");
  const [textValue, settextValue] = useState("");
  const [addedEmails, setaddedEmails] = useState([]);

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
        alert(error);
      });
  };

  useEffect(() => {
    props.navigation.setOptions({
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
    await fetch(baseUrl + "/search/index.php?email=" + text)
      .then((response) => response.json())
      .then(async (jsonData) => {
        const myData = []
          .concat(jsonData)
          .sort((a, b) => (a.name > b.name ? 1 : -1));
        setFilteredDataSource(myData);
        setisFound(true);
      });
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

  const preview = (name, email, phone, kiosk_id, ifs_id) => {
    if (addedEmails.includes(email)) {
      alert(email + " has already checked in.");
    } else {
      axios
        .post(
          baseUrl + "/events/checkin.php",
          {
            attendee: name,
            email: email,
            phone: phone,
            id: kiosk_id,
            ifs_id: ifs_id,
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
          print(Print.Orientation.landscape);
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  const print = async (orientation = Print.Orientation.landscape) => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    await Print.printAsync({
      html,
      orientation,
      printerUrl: url, // iOS only
    });
  };

  function Item({ item }) {
    return (
      <TouchableOpacity
        onPress={() => {
          preview(
            item.name,
            item.email,
            item.phone,
            props.route.params.kiosk_id,
            item.ifs_id
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
                {item.name}
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
});
export default Checkins;
