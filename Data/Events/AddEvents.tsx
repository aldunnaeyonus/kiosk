import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal
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
import { ALERT_TYPE, Dialog, Toast } from "react-native-alert-notification";
import DropDownPicker from 'react-native-dropdown-picker';

FontAwesome.loadFont();
const AddEvent = ({ navigation }) => {
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [visible, setvisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    moment(new Date()).format("MMMM DD, YYYY")
  );
  const baseUrl = "https://bigdogtools.com/kiosk";
  const [title, settitle] = useState("");
  const [prints, setPrints] = useState("1");
  const [location, setLocation] = useState("");
  const [tag, setTag] = useState("");
  const isFocused = useIsFocused();
  const [kiosk_id, setkiosk_id] = useState("");
  const [kiosk_logo, setkiosk_logo] = useState("");
  const [kiosk_is_ifs, setkiosk_is_ifs] = useState("0");
  const [items, setItems] = useState([
    {label: 'Austin RENC', value: 'AustinRENCLogoLong.png'},
    {label: 'Austin RENC', value: 'DallasREIALogoLong.png'},
    {label: 'Houston RENC', value: 'HoustonREIALogoLong.png'},
    {label: 'San Antonio RENC', value: 'SanAntonioRENCLogoLong.png'},
    {label: 'Big Live Event', value: 'RealEstateInvestingLogo.png'},
    {label: 'Big Dog Program', value: 'big-dog-logo2.png'},
  ]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  const CustomProgressBar = ({ visible }) => (
    <Modal style={{backgroundColor: 'transparent'}} onRequestClose={() => null} visible={visible}>
      <View style={{ flex: 1, backgroundColor: '#dcdcdc', alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ borderRadius: 10, backgroundColor: 'white', padding: 25 }}>
          <Text style={{ fontSize: 20, fontWeight: '200' }}>Creating Event</Text>
          <ActivityIndicator size="large" />
        </View>
      </View>
    </Modal>
  );

  const preview = () => {
    if ((title.length <= 0) || (location.length <= 0) || (selectedDate.length <= 0)){
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Error",
        textBody: "The title, location, and selected date are required entried.",
        autoClose: 3000, // or time in ms by default 5000
      });
    }else{  
      setvisible(true)
  axios.post(baseUrl + '/events/create.php', {
        title: title, 
        location: location, 
        kiosk_id: kiosk_id, 
        selectedDate: selectedDate, 
        tag: tag,
        prints: prints,
        logo: value


}, {
  headers : {
    'Content-Type': 'application/json;charset=utf-8',

  }
})
        .then(response => {
          setvisible(false)
          navigation.goBack(null)
      })
      .catch(error => {
        setvisible(false)
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
          <CustomProgressBar visible={visible} />
     
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
              placeholder="Enter Event Location (for example: InterContinental Hotel Houston TX)"
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
                Event Date:  {selectedDate}</Text>

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
              placeholder="IFS TAG (for example: 801)"
              onChangeText={(text) => {
                setTag(text);
              } } />

          </View>       
        <View style={[styles.dividerStyle]} />
        </> :  <View style={[styles.dividerStyle]} /> } 
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
              value="1"
              keyboardType="numeric"
              placeholder="Print Number of Name Tags"
              onChangeText={(text) => {
                setPrints(text);
              } } />

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
              icon="image" />
  <DropDownPicker
  dropDownContainerStyle={{
    borderColor: "#ccc",
    backgroundColor: "white",
    borderWidth:0.5,
    marginLeft: 45,
    marginTop: 5,
    width:'91%',
    justifyContent: "center",
  }}
  style={{
                backgroundColor: "white",
                borderColor: "white",
                marginLeft: 45,
                marginTop: 5,
                width:'91%',
                justifyContent: "center",
  }}
      autoScroll={true}
      itemSeparator={true}
      itemSeparatorStyle={{
        backgroundColor: "#ccc",
        height:0.5
      }}
      open={open}
      placeholder="Select Event Logo"
      placeholderStyle={{fontSize: 18}}
      textStyle={{fontSize: 18}}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
    />


</View></View>
<TouchableOpacity 
          style={{marginTop:300,
          }}
          onPress={()=> {
            preview()
          }
 }>
        <View style={{
            height: 50, 
            width: 200, 
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
