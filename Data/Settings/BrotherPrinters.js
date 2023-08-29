import React, {Component} from 'react';
import {StyleSheet, Text, ActivityIndicator, View, FlatList,TouchableOpacity} from 'react-native';
import {discoverPrinters, registerBrotherListener} from 'react-native-brother-printers';
import ViewShot from "react-native-view-shot";
import FontAwesome from "@expo/vector-icons/FontAwesome";
FontAwesome.loadFont();
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default class BrotherPrinters extends Component {
  state = {
    printer: [],
    loading: false
  };

  componentDidMount() {
    registerBrotherListener("onDiscoverPrinters", (brotherPrinters) => {
      if (brotherPrinters.length > 0) {
        this.setState({loading: false});
        this.setState({printer: brotherPrinters});
      }
    });
  }

  render() {
    const {printer, loading} = this.state;

    const Item = ({item}) => {
        return(
            <TouchableOpacity
                onPress={async () => {
            await AsyncStorage.setItem("BrotherPrinterIP", item.ipAddress);   
            await AsyncStorage.setItem("BrotherPrinterName", item.serialNumber);   
            await AsyncStorage.setItem("BrotherPrinter", JSON.stringify(item));
            Toast.show({
                type: ALERT_TYPE.SUCCESS,
                title: "Success",
                textBody: "Printer was saved successfully.",
                autoClose: 2000, // or time in ms by default 5000
              });
              this.props.navigation.goBack(null);
        }}
        >
         <View style={styles.listItem}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesome name="print" size={20} style={styles.whiteIcon2} />
              <Text style={{ marginLeft: 10, fontWeight: "bold", fontSize: 20, marginTop: 5 }}>
                {item.serialNumber}
              </Text>
              <Text style={{ marginLeft: 10, fontWeight: "bold", fontSize: 15, marginTop: 5 }}>
              </Text>
            </View>          
            </View>
            </TouchableOpacity>
            );
        }


    return (
      <View style={styles.listItem}>
        
        <ViewShot ref={(e) => {
          this.viewShot = e;
        }}
        style={{ position: "absolute", left: -1000, justifyContent: 'center', alignItems: 'center'}} options={{format: 'png', quality: 0.9}}>
        <Text style={{fontSize: 14, flex: 1, textAlign: 'center', marginTop: 5, fontWeight: 'bold',}}>
            Firstname
          </Text>

          <Text style={{fontSize: 12, flex: 1, textAlign: 'center', fontWeight: '500'}}>
          Lastname
          </Text>

          <Text style={{fontSize: 10, flex: 1, textAlign: 'center', fontWeight: 'normal'}}>
         Status
          </Text>
      </ViewShot>

        <View style={styles.actions}>
        <Text style={styles.instructions}>Step 1. Ensure this device and all printers are connected to the same network.</Text>

        <TouchableOpacity onPress={() => {
            this.setState({loading: true})
               discoverPrinters({}).then(() => {
              console.log("Discover Successful");
              
            }).catch(() => {
              console.log("Discover failed")
            });
          }} style={styles.appButtonContainer}>
    <Text style={styles.appButtonText}>Step 2. Touch here to Discover All Available Printers. If no printers are found, retry step 2.{'\n\n'}Note: Ensure all printers are connected to the internet, and the WIFI icon on the screen is not blinking.{'\n\n'}This feature will not work if you are connected to a network that requires a signin page or Hotel Networks.</Text>
  </TouchableOpacity>

                <View style={styles.loading}>
        <ActivityIndicator animating={loading} size={'large'} color={'black'}/>
                </View>
          {printer.length > 0 && (
                    <>
              <Text style={styles.instructions2}>Step 3. Select a Printer from the list below.</Text>

                    <FlatList
                        data={printer}
                        keyboardShouldPersistTaps="always"
                        style={{ flex: 1 }}
                        renderItem={({ item }) => <Item item={item} />}
                        keyExtractor={(item) => item.serialNumber} />
                        </>


          )}

          
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex:1
  },
  moreIcon: {
    color: "#5A5A5A",
    justifyContent: "center",
  },
  actions: {
    marginTop:20,
    backgroundColor: 'white',
    flex:1
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 15,
  },
  instructions2: {
    textAlign: 'center',
    color: '#333333',
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 15,
    marginTop: 15,

  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 100,
    bottom: 0,
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center'
},
listItem: {
    margin: 1,
    padding: 10,
    borderRadius: 5,
    height:65,
    backgroundColor: "#FFF",
    borderBottomWidth: 0.5,
    borderColor: "#D3D3D3",
    width: "100%",
    flex: 1,
    alignSelf: "center",
    flexDirection: "row",
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textAlign: "center",
    textTransform: "uppercase"
  }
});