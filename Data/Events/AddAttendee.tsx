import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import InteractiveTextInput from "react-native-text-input-interactive";
import { TextInput } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import moment from "moment";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width: ScreenWidth } = Dimensions.get("screen");
import axios from "axios";
import FontAwesome from "@expo/vector-icons/FontAwesome";
FontAwesome.loadFont();
import * as Print from "expo-print";

const AddAttendee = ({ navigation, props }) => {
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    moment(new Date()).format("MMMM DD, YYYY")
  );
  const [title, settitle] = useState("");
  const [location, setLocation] = useState("");
  const [tag, setTag] = useState("");
  const isFocused = useIsFocused();
  const [url, setURL] = useState("");
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kiosPrinterURL =
          Platform.OS !== "web"
            ? await AsyncStorage.getItem("printerURL")
            : window.localStorage.getItem("printerURL");
        setURL("" + kiosPrinterURL);
      } catch (error) {
        setURL("");
      }
    };
    fetchData();
  }, [isFocused]);

  const print = async (orientation = Print.Orientation.portrait) => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    await Print.printAsync({
      html,
      orientation,
      printerUrl: url, // iOS only
    });
  };

  const preview = () => {
    if (title.length <= 0 || location.length <= 0 || tag.length <= 0) {
      alert("The title, phone, and email address are required entried.");
    } else {
      axios
        .post(
          baseUrl + "/events/checkin.php",
          {
            attendee: title,
            email: location,
            phone: tag,
            id: props.route.params.kiosk_id,
          },
          {
            headers: {
              "Content-Type": "application/json;charset=utf-8",
            },
          }
        )
        .then((response) => {
          print(Print.Orientation.portrait);

          navigation.goBack(null);
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };
  const hideDatePicker = React.useCallback(() => {
    setDatePickerVisible(false);
  }, [datePickerVisible]);

  const onConfirmSingle = React.useCallback(
    (params: { date: moment.MomentInput }) => {
      setDatePickerVisible(false);
      setSelectedDate(moment(params.date).format("MMMM DD, YYYY"));
    },
    [setDatePickerVisible, selectedDate]
  );

  useEffect(() => {
    {
    }
    navigation.setOptions({
      headerTitle: "Add Attendee",
    });
  });

  return (
    <SafeAreaProvider style={styles.container}>
      <ScrollView>
        <View
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: "100%",
              height: 60,
              marginTop: 0,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TextInput.Icon
              style={{
                marginLeft: 38,
                marginTop: 45,
                flexDirection: "row",
                width: "90%",
                justifyContent: "space-between",
              }}
              size={20}
              icon="tag-outline"
            />

            <InteractiveTextInput
              maxLength={33}
              autoCapitalize="words"
              textInputStyle={{
                backgroundColor: "white",
                marginLeft: 38,
                fontSize: 18,
                height: 60,
                justifyContent: "center",
              }}
              keyboardType="default"
              placeholder="Name"
              onChangeText={(text) => {
                settitle(text);
              }}
            />
          </View>
          <View style={[styles.dividerStyle]} />

          <View
            style={{
              backgroundColor: "white",
              width: "100%",
              height: 60,
              marginTop: 0,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TextInput.Icon
              style={{
                marginLeft: 38,
                marginTop: 45,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
              size={20}
              icon="mail"
            />
            <InteractiveTextInput
              maxLength={33}
              autoCapitalize="words"
              textInputStyle={{
                backgroundColor: "white",
                marginLeft: 38,
                height: 60,
                fontSize: 18,
                justifyContent: "center",
              }}
              keyboardType="email-address"
              placeholder="Email Address"
              onChangeText={(text) => {
                setLocation(text);
              }}
            />
          </View>
          <View style={[styles.dividerStyle]} />

          <View
            style={{
              backgroundColor: "white",
              width: "100%",
              height: 60,
              marginTop: 0,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TextInput.Icon
              style={{
                marginLeft: 38,
                marginTop: 45,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
              size={20}
              icon="phone"
            />
            <InteractiveTextInput
              maxLength={33}
              textInputStyle={{
                backgroundColor: "white",
                marginLeft: 38,
                height: 60,
                fontSize: 18,
                justifyContent: "center",
              }}
              keyboardType="phone-pad"
              placeholder="Phone Number"
              onChangeText={(text) => {
                setTag(text);
              }}
            />
          </View>

          <View style={[styles.dividerStyle]} />
        </View>
        <TouchableOpacity
          onPress={() => {
            preview();
          }}
        >
          <View
            style={{
              height: 50,
              width: 200,
              marginTop: 50,
              flexDirection: "row",
              borderRadius: 20,
              backgroundColor: "green",
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
              Chekin{" "}
            </Text>
            <FontAwesome name="check" size={15} style={styles.whiteIcon} />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  whiteIcon: {
    color: "#ffffff",
    justifyContent: "center",
  },
  dividerStyle: {
    height: 0.5,
    width: ScreenWidth * 0.9,
    backgroundColor: "#ccc",
  },
});

export default AddAttendee;
