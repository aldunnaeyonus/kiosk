import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    TextInput,
    TouchableOpacity,
    Keyboard,
    Alert,
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import FontAwesome from "@expo/vector-icons/FontAwesome";
  import { useIsFocused } from "@react-navigation/native";
  FontAwesome.loadFont();
  import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
  MaterialCommunityIcons.loadFont();
  import { ALERT_TYPE, Toast } from "react-native-alert-notification";
  import axios from "axios";

  const ViewAttendees = (props) => {
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [textValue, settextValue] = useState("");
    const baseUrl = "https://bigdogtools.com/kiosk";
    const isFocused = useIsFocused();
    const [masterDataSource, setMasterDataSource] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          fetch( baseUrl + "/search/fetch.php?kioskID=" + props.route.params.kiosk_id )
            .then((response) => response.json())
            .then(async (jsonData) => {
              setFilteredDataSource(jsonData.sort((a, b) => a.fullname < b.fullname));
              setMasterDataSource(jsonData.sort((a, b) => a.fullname < b.fullname));
            });
        };
        fetchData();
      }, [isFocused]);
  
      
      useEffect(() => {
        props.navigation.setOptions({
          headerTitle: props.route.params.kiosk_event + " Attendee's Checked In",
        });
      });


      const searchFilterFunction = (text) => {
        if (text) {
          const newData = masterDataSource.filter(
            function (item) {
              const itemData = item.fullname
                ? item.fullname.toUpperCase()
                : "".toUpperCase()
              const textData = text.toUpperCase();
              return itemData.indexOf(textData) > -1;
          });
          setFilteredDataSource(newData);
        } else {
          setFilteredDataSource(masterDataSource);
        }
      };
  
      const preview = (
        fname,
        lname,
        email,
        kiosk_id,
        ifs_id
      ) => {
          Alert.alert(
            "Remove Attendee from Checkin",
            "Remove Attendee: "+ fname +
              " " +
              lname +
              " with email address of" +
              email,
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "destructive",
              },
              {
                text: "Delete Attendee",
                onPress: async () => {
                  axios
                  .post(
                    baseUrl + "/events/remove.php",
                    {
                      email: email,
                      id: kiosk_id,
                      ifs_id: ifs_id,
                    },
                    {
                      headers: {
                        "Content-Type": "application/json;charset=utf-8",
                      },
                    }
                  )
                  .then(async (jsonData) => {
                    setFilteredDataSource([])
                    setMasterDataSource([])
            fetch( baseUrl + "/search/fetch.php?kioskID=" + props.route.params.kiosk_id )
            .then((response) => response.json())
            .then(async (jsonData) => {
              setFilteredDataSource(jsonData.sort((a, b) => a.fullname < b.fullname));
              setMasterDataSource(jsonData.sort((a, b) => a.fullname < b.fullname));
            });
                    Toast.show({
                      onPress() {},
                      type: ALERT_TYPE.SUCCESS,
                      title: "Attendee Removal",
                      textBody: "Success, the attendee was removed.",
                      autoClose: 5000, // or time in ms by default 5000
                    });
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
    
                },
              },
            ],
            { cancelable: false }
          );
      };

    function Item({ item }) {  
      return (
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
            </View>
            <TouchableOpacity
            onPress={() => {
              preview(
                item.fname,
                item.lname,
                item.email,
                props.route.params.kiosk_id,
                item.ifs_id,
              );
            }}
          >
            <View
              style={{
                width: 90,
                height: 40,
                marginTop: item.status != "" ? 18 : 2,
                justifyContent: "center",
                backgroundColor: "red",
                alignSelf: "center",
                alignItems: "center",
                borderRadius: 45,
              }}
            >
              <Text
                style={{ color: "white", fontSize: 15, fontWeight: "bold" }}
              >
                Remove
              </Text>
            </View>
          </TouchableOpacity>
          </View>
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
        source={{ uri: baseUrl + "/logos/" + props.route.params.logo }}
      />

  
        <TextInput
          autoCapitalize="words"
          style={styles.textInputStyle}
          onChangeText={(text) => {
            settextValue(text);
            searchFilterFunction(text);
          }}
          keyboardType="default"
          underlineColorAndroid="transparent"
          placeholder="Search by Email or Name"
          value={textValue}
        />

        <FlatList
          onScrollBeginDrag={() => Keyboard.dismiss()}
          keyboardShouldPersistTaps="always"
          style={{ flex: 1 }}
          data={filteredDataSource}
          renderItem={({ item }) => <Item item={item} /> }
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
  export default ViewAttendees;
  