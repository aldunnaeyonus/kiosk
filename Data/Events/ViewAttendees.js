import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    TextInput,
    TouchableOpacity,
    Keyboard,
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import FontAwesome from "@expo/vector-icons/FontAwesome";
  import { useIsFocused } from "@react-navigation/native";
  FontAwesome.loadFont();
  import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
  MaterialCommunityIcons.loadFont();
  
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
  
    function Item({ item }) {  
      return (
        <TouchableOpacity
          onPress={async () => {
            
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
  