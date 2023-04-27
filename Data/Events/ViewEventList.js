import {
    StyleSheet,
    View,
    FlatList,
    TextInput,
    Image,
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import { useIsFocused } from "@react-navigation/native";
  import FontAwesome from "@expo/vector-icons/FontAwesome";
  FontAwesome.loadFont();
  const baseUrl = "https://dunn-carabali.com/kiosk";
  import { ListItem } from '@rneui/themed'
  import { ALERT_TYPE, Dialog } from "react-native-alert-notification";

  const ViewEventList = (props) => {
    const [search, setSearch] = useState("");
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    const isFocused = useIsFocused();
    const [isLoding, setisLoding] = useState(true);


    const EmptyListMessage = () => {
      return (
        <Image
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
    
  
    useEffect(() => {
      setisLoding(true)
      const fetchData = async () => {
        fetch( baseUrl + "/events/attendees.php?kiosk_id=" + props.route.params.kiosk_id )
          .then((response) => response.json())
          .then(async (jsonData) => {
            const myData = []
              .concat(jsonData)
              .sort((a, b) =>
                a.kiosk_attendee_events_attendee_fname > b.kiosk_attendee_events_attendee_fname ? 1 : -1
              );
              setisLoding(false)
            setFilteredDataSource(myData);
            setMasterDataSource(myData);
          });
      };
      fetchData();
    }, [isFocused]);
  
    useEffect(() => {
      props.navigation.setOptions({
        headerTitle: props.route.params.kiosk_event + " Event List",
        headerRight: () => (
          <FontAwesome
            style={{ paddingRight: 20 }}
            backgroundColor="white"
            borderRadius={17}
            size={28}
            color="black"
            name={"file-excel-o"}
            onPress={() => {
              fetch( baseUrl + "/events/excel.php?kiosk_id=" + props.route.params.kiosk_id )
              .then((response) => response.json())
              .then(async (jsonData) => {
                Dialog.show({
                  type: ALERT_TYPE.SUCCESS,
                  title: "Success",
                  textBody: "Please check your email inbox or spam folder for the generated excel file.",
                  autoClose: 5000, // or time in ms by default 5000
                });
              })
            }}
          />
        ),
      });
    });
  
    const searchFilterFunction = (text) => {
      if (text) {
        const newData = masterDataSource.filter(function (item) {
          const itemData = item.kiosk_attendee_events_attendee_fname ? item.kiosk_attendee_events_attendee_fname.toUpperCase()  : kiosk_attendee_events_attendee_lname.toUpperCase();
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

    return (
      <View style={styles.container}>
        <TextInput
                autoCapitalize="words"
          style={styles.textInputStyle}
          onChangeText={(text) => searchFilterFunction(text)}
          underlineColorAndroid="transparent"
          placeholder="Search by Attendee Name"
        />
        <FlatList
        keyboardShouldPersistTaps="always"
        refreshing={isLoding}
          style={{ flex: 1 }}
          ListEmptyComponent={EmptyListMessage}
          data={filteredDataSource}
          keyExtractor={item => item.kiosk_attendee_events_attendee_email}
          renderItem={({ item }) => 
          <ListItem key={item.kiosk_attendee_events_event_ifs_id} bottomDivider>
        <ListItem.Content>
          <ListItem.Title style={{    fontSize: 20, fontWeight: "bold", marginBottom:10}}><FontAwesome name="id-badge" size={20} style={styles.whiteIcon2} /> {item.kiosk_attendee_events_attendee_fname} {item.kiosk_attendee_events_attendee_lname}</ListItem.Title>
          <ListItem.Subtitle><FontAwesome name="envelope-o" size={15} style={styles.whiteIcon2} /> {item.kiosk_attendee_events_attendee_email} | <FontAwesome name="mobile" size={15} style={styles.whiteIcon2} /> {item.kiosk_attendee_events_attendee_phone}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
          }
        />
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
    whiteIcon2: {
      marginTop: 3,
      paddingRight: 5,
      color: "#5A5A5A",
      justifyContent: "center",
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
    
  });
  export default ViewEventList;
  