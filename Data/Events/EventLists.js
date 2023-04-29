import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Platform,
  Image,
  Alert
} from "react-native";
import React, { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from "@expo/vector-icons/FontAwesome";
FontAwesome.loadFont();
import SegmentedControlTab from "react-native-segmented-control-tab";
const baseUrl = "https://bigdogtools.com/kiosk";

const EventList = (props) => {
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(0);
  const [kiosk_ids, setkiosk_ids] = useState(0);
  const [kiosk_name, setkiosk_name] = useState(0);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const isFocused = useIsFocused();
  const [isLoding, setisLoding] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [kiosk_is_ifs, setkiosk_is_ifs] = useState("0");

  const EmptyListMessage = ({ item }) => {
    return (
      // Flat List Item
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
  const handleSingleIndexSelect = (index) => {
    setActive(index == 0 ? "0" : "1");
    setSelectedIndex(index);
    fetch(
      baseUrl +
        "/events/index.php?kiosk_id=" +
        kiosk_ids +
        "&active=" +
        index
    )
      .then((response) => response.json())
      .then(async (jsonData) => {
        const myData = []
          .concat(jsonData)
          .sort((a, b) =>
            a.kiosk_event_timestamp > b.kiosk_event_timestamp ? 1 : -1
          );
        setisLoding(false)
        setFilteredDataSource(myData);
        setMasterDataSource(myData);
      });
  };

  useEffect(() => {
    setisLoding(true)
    setActive(selectedIndex == 0 ? "0" : "1");
    const fetchData = async () => {
      const kiosk_id =
        Platform.OS !== "web"
          ? await AsyncStorage.getItem("kiosk_id")
          : window.localStorage.getItem("kiosk_id");
          const kioskifs = Platform.OS !== "web" ? await AsyncStorage.getItem("kiosk_is_ifs") : window.localStorage.getItem("kiosk_is_ifs");

      const kiosk_comapny_name =
        Platform.OS !== "web"
          ? await AsyncStorage.getItem("kiosk_comapny_name")
          : window.localStorage.getItem("kiosk_comapny_name");
      setkiosk_ids(kiosk_id);
      setkiosk_name(kiosk_comapny_name);
      setkiosk_is_ifs(""+kioskifs)
      props.navigation.setOptions({
        title: kiosk_comapny_name + " Events List",
      });
      fetch(
        baseUrl +
          "/events/index.php?kiosk_id=" +
          kiosk_id +
          "&active=" +
          active
      )
        .then((response) => response.json())
        .then(async (jsonData) => {
          const myData = []
            .concat(jsonData)
            .sort((a, b) =>
              a.kiosk_event_timestamp > b.kiosk_event_timestamp ? 1 : -1
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
      headerTitle: kiosk_name + " Event List",
      headerRight: () => (
        <FontAwesome
          style={{ paddingRight: 20 }}
          backgroundColor="white"
          borderRadius={17}
          size={28}
          color="black"
          name={"sliders"}
          onPress={() => {
            props.navigation.navigate("Kiosk Settings", {
              kiosk_id: kiosk_ids,
            });
          }}
        />
      ),
    });
  });

  const searchFilterFunction = (text) => {
    if (text) {
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.kiosk_event_name
          ? item.kiosk_event_name.toUpperCase()
          : "".toUpperCase();
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

  function Item({ item }) {
    return (
      <TouchableOpacity
        onPress={() => {
          if (item.kiosk_event_status == "0") {

          Alert.alert(
            "Event Actions",
            "Choose a view mode:",
            [
              {
                text: "Kiosk Mode",
                onPress: () => {
                  props.navigation.navigate("Check In Attendees", {
                    kiosk_id: item.kiosk_event_id,
                    kiosk_event: item.kiosk_event_name,
                    kiosk_owner: item.kiosk_event_owner_id,
                    event_status: item.kiosk_event_status,
                    event_logo: item.kiosk_event_logo,
                    prints: item.kiosk_event_print,
                    mode: "KIOSK",
                  });
                },
              },
                {
                text: "Normal Mode",
                onPress: () => {
                  props.navigation.navigate("Check In Attendees", {
                    kiosk_id: item.kiosk_event_id,
                    kiosk_event: item.kiosk_event_name,
                    kiosk_owner: item.kiosk_event_owner_id,
                    event_status: item.kiosk_event_status,
                    event_logo: item.kiosk_event_logo,
                    prints: item.kiosk_event_print,
                    mode: "NORMAL",
                  });
                },
              },
              {
                text: "Edit Mode",
                onPress: () => {
                  props.navigation.navigate("Edit Mode", {
                    kiosk_id: item.kiosk_event_id,
                    kiosk_event: item.kiosk_event_name,
                    ifs_mode: kiosk_is_ifs,
                  });
                },
              },
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "destructive",
              },
            ],
            { cancelable: false }
          );
          } else {
            props.navigation.navigate("View Event Attendee List", {
              kiosk_id: item.kiosk_event_id,
              kiosk_owner: item.kiosk_event_owner_id,
              kiosk_event: item.kiosk_event_name,
            });
          }
        }}
      >
        <View style={styles.listItem}>
          <View
            style={{
              alignItems: "flex-start",
              marginStart: 15,
              flex: 1,
              justifyContent: "center",
            }}
          >
            {
              (item.kiosk_event_status == "0")  ?
              <Text
              style={{ fontWeight: "bold", fontSize: 21, color: "#000000" }}
            >
              {item.kiosk_event_name}
            </Text>
            :               <Text
            style={{ fontWeight: "bold", fontSize: 21, color: "red" }}
          >
            {item.kiosk_event_name}
          </Text>
            }
            <Text style={{ fontSize: 15, color: "#808080", paddingTop: 5 }}>
              {item.kiosk_event_location}
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
                color: "#808080",
                paddingTop: 5,
              }}
            >
              {item.kiosk_event_timestring}
            </Text>
          </View>
          <View
            style={{
              width: 80,
              height: 25,
              marginTop: 25,
              borderRadius: 40,
              flexDirection: "row",
              borderWidth: 1,
              borderColor: "#efefef",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#efefef",
            }}
          >
            <FontAwesome name="users" size={15} style={styles.whiteIcon2} />
            <Text
              style={{
                color: "#000000",
                fontSize: 15,
                padding: 0,
              }}
            >
              {item.kiosk_event_attendees}
            </Text>
          </View>
          <View
            style={{
              width: 100,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {item.kiosk_event_status == "0" ? (
              <FontAwesome
                name="chevron-right"
                size={20}
                style={styles.moreIcon}
              />
            ) : (
              <FontAwesome name="file" size={20} style={styles.fileIcon} />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  const handleRefresh = () => {
    handleSingleIndexSelect(selectedIndex)
    setisLoding(true);
  };

  

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInputStyle}
        autoCapitalize="words"
        onChangeText={(text) => searchFilterFunction(text)}
        underlineColorAndroid="transparent"
        placeholder="Search "
      />
      <View
        style={{
          height: 60,
          width: "60%",
          marginBottom: 30,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
        }}
      >
        <SegmentedControlTab
          values={["Active Events", "Closed Events"]}
          selectedIndex={selectedIndex}
          tabStyle={styles.tabStyle}
          tabTextStyle={styles.tabTextStyle}
          activeTabStyle={styles.activeTabStyle}
          onTabPress={handleSingleIndexSelect}
        />
      </View>
      <FlatList
        keyboardShouldPersistTaps="always"
        style={{ flex: 1 }}
        ListEmptyComponent={EmptyListMessage}
        refreshing={isLoding}
        keyExtractor={item => item.kiosk_event_id}
        onRefresh={handleRefresh}
        data={filteredDataSource}
        renderItem={({ item }) => <Item item={item} />}
      />
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("Add New Event");
        }}
      >
        <View
          style={{
            height: 50,
            width: 200,
            marginBottom: 30,
            flexDirection: "row",
            borderRadius: 20,
            backgroundColor: "#007AFF",
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
              fontSize: 17,
            }}
          >
            {" "}
            Create New Event{" "}
          </Text>
          <FontAwesome name="send" size={15} style={styles.whiteIcon} />
        </View>
      </TouchableOpacity>
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
  tabContent: {
    color: "#D52C43",
    fontSize: 18,
    margin: 24,
  },
  seperator: {
    marginHorizontal: -10,
    alignSelf: "stretch",
    borderTopWidth: 1,
    borderTopColor: "#888888",
    marginTop: 24,
  },
  tabStyle: {
    height: 44,
    borderColor: "#007AFF",
    color: "#007AFF",
  },
  tabTextStyle: {
    borderColor: "#007AFF",
    fontSize: 18,
    color: "#007AFF",
  },
  activeTabStyle: {
    backgroundColor: "#007AFF",
  },
  moreIcon: {
    color: "#5A5A5A",
    justifyContent: "center",
  },
  fileIcon: {
    color: "#009688",
    justifyContent: "center",
  },
  whiteIcon: {
    color: "#ffffff",
    justifyContent: "center",
  },
  whiteIcon2: {
    paddingRight: 5,
    color: "#000000",
    justifyContent: "center",
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
  listItem: {
    margin: 0.0,
    padding: 10,
    backgroundColor: "#FFF",
    width: "100%",
    height: 100,
    flex: 1,
    borderRadius: 0,
    borderBottomWidth: 0.5,
    borderColor: "#D3D3D3",
    justifyContent: "space-between",
    alignSelf: "center",
    flexDirection: "row",
  },
});
export default EventList;
