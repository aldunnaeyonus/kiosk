import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import InteractiveTextInput from "react-native-text-input-interactive";
import { TextInput } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DatePickerModal } from 'react-native-paper-dates';
import moment from "moment";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
const { width: ScreenWidth } = Dimensions.get("screen");
import axios from "axios";
import FontAwesome from '@expo/vector-icons/FontAwesome';

FontAwesome.loadFont();
const AddEvent = ({ navigation, props }) => {
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    moment(new Date()).format("MMMM DD, YYYY")
  );
  const baseUrl = "https://dunn-carabali.com/kiosk";
  const [title, settitle] = useState("");
  const [location, setLocation] = useState("");
  const [tag, setTag] = useState("");
  const isFocused = useIsFocused();
  const [kiosk_id, setkiosk_id] = useState("");
  const [kiosk_logo, setkiosk_logo] = useState("");
  const [kiosk_is_ifs, setkiosk_is_ifs] = useState("0");
  
  const preview = () => {
    if ((title.length <= 0) || (location.length <= 0) || (selectedDate.length <= 0)){
      alert("The title, location, and selected date are required entried.")
    }else{  

  axios.post(baseUrl + '/events/create.php', {
        title: title, 
        location: location, 
        kiosk_id: kiosk_id, 
        selectedDate: selectedDate, 
        tag: tag
}, {
  headers : {
    'Content-Type': 'application/json;charset=utf-8',

  }
})
        .then(response => {
          navigation.goBack(null)
      })
      .catch(error => {
        alert(error);
    });
  }
      };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kiosk_is_ifs = Platform.OS !== "web" ? await AsyncStorage.getItem("kiosk_is_ifs") : window.localStorage.getItem("kiosk_is_ifs");
        const kiosk_id = Platform.OS !== "web" ? await AsyncStorage.getItem("kiosk_id") : window.localStorage.getItem("kiosk_id");
        const kiosk_logo = Platform.OS !== "web" ? await AsyncStorage.getItem("kiosk_logo") : window.localStorage.getItem("kiosk_logo");
        setkiosk_logo("" + kiosk_logo);
        setkiosk_id("" + kiosk_id);
        setkiosk_is_ifs(""+kiosk_is_ifs)
      } catch (error) {
        setkiosk_logo("");
        setkiosk_id("");
        setkiosk_is_ifs("")
      }
    };
    fetchData();
  }, [isFocused]);

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };
  const hideDatePicker = React.useCallback(() => {
    setDatePickerVisible(false);
  }, [datePickerVisible]);

  const onConfirmSingle = React.useCallback(
    (params: { date: moment.MomentInput; }) => {
      setDatePickerVisible(false);
      setSelectedDate(moment(params.date).format("MMMM DD, YYYY"));

    },
    [setDatePickerVisible, selectedDate]
  );

  useEffect(() => {
    {
    }
    navigation.setOptions({
      headerTitle: "Add New Event",
    });
  });

  return (
    <SafeAreaProvider style={styles.container}>
      <Image 
    resizeMode='contain'
    resizeMethod="scale"
style={{    
  height: 200,
  alignSelf: "center",
  flexDirection: "row",
  justifyContent: "center",
}}
source={require('../../assets/events-transparent-1.png')}
 />      
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
                iconColor='#007AFF'
                style={{
                  marginLeft: 38,
                  marginTop: 45,
                  flexDirection: "row",
                  width:'90%',
                  justifyContent: "space-between",
                }}
                size={20}
                icon="tag-multiple-outline"
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
              placeholder="Enter Event Title"
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
                                        iconColor='#007AFF'
                style={{
                  marginLeft: 38,
                  marginTop: 45,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
                size={20}
                icon="map-marker"
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
              keyboardType="default"
              placeholder="Enter Event Location"
              onChangeText={(text) => {
                setLocation(text);
              }}
            />

          </View>
          <View style={[styles.dividerStyle]} />

          

          <TouchableWithoutFeedback
            onPress={async () => {
              showDatePicker();
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
                              iconColor='#007AFF'
                style={{
                  marginLeft: 40,
                  marginTop: 45,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
                size={20}
                icon="clock-outline"
              />
              <Text
                style={{
                  marginLeft: 55,
                  marginTop: 22,
                  fontSize: 18,
                  color: "black",
                }}
              >
                Event Date:  </Text>
                
              <Text
                style={{
                  marginRight: 0,
                  marginTop: 22,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  color: "#0e1111",
                }}
              >
                {selectedDate}
              </Text>
              <DatePickerModal
          locale="en"
          mode="single"
          validRange={{
              startDate: new Date(),  // optional
             }}
          saveLabel="Save Date"
          visible={datePickerVisible}
          onDismiss={hideDatePicker}
          date={new Date()}
          onConfirm={onConfirmSingle}
        />
            </View>
          </TouchableWithoutFeedback>
          <View style={[styles.dividerStyle]} />
          { kiosk_is_ifs == "1" ? 
          <><View
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
              iconColor='#007AFF'
              style={{
                marginLeft: 38,
                marginTop: 45,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
              size={20}
              icon="tag-outline" />
            <InteractiveTextInput
              maxLength={33}
              textInputStyle={{
                backgroundColor: "white",
                marginLeft: 38,
                height: 60,
                fontSize: 18,
                justifyContent: "center",
              }}
              keyboardType="default"
              placeholder="IFS TAG"
              onChangeText={(text) => {
                setTag(text);
              } } />

          </View><View style={[styles.dividerStyle]} /></> : <View></View> }
</View>
<TouchableOpacity 
          onPress={()=> {
            preview()
          }
 }>
        <View style={{
            height: 50, 
            width: 200, 
            marginTop: 50,
            flexDirection: 'row',
            borderRadius: 20,
            backgroundColor: "#007AFF", 
            justifyContent:"center", 
            alignItems:"center",
            alignSelf: "center"
            }}>

                 <Text style={{
                    color:"white", 
                    fontWeight: "bold",
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: 17,
                }}> Create This Event </Text><FontAwesome name="send" size={15} style={styles.whiteIcon} />
       </View>
       </TouchableOpacity>
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

export default AddEvent;
