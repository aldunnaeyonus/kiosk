import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ListItem } from '@rneui/themed';
import { FontAwesome } from '@expo/vector-icons';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

import { RootStackParamList } from '../../../types/navigation'; // Import the main RootStackParamList

// Use the RootStackParamList to give the navigator access to all top-level screens
type BluetoothNavigationProp = StackNavigationProp<RootStackParamList>;

const Bluetooth: React.FC = () => {
  const [useAirPrint, setUseAirPrint] = useState(false);
  const [useBT, setUseBT] = useState(false);
  const [printerName, setPrinterName] = useState<string | null>(null);
  const navigation = useNavigation<BluetoothNavigationProp>();
  const isFocused = useIsFocused();

  const loadSettings = useCallback(async () => {
    try {
      const airPrintEnabled = await AsyncStorage.getItem('useAirPrint');
      const btEnabled = await AsyncStorage.getItem('useBT');
      const name = await AsyncStorage.getItem('BrotherPrinter');

      setUseAirPrint(airPrintEnabled ? JSON.parse(airPrintEnabled) : false);
      setUseBT(btEnabled === '1');
      setPrinterName(name);
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      loadSettings();
    }
  }, [isFocused, loadSettings]);

  const toggleSwitch = async (key: 'useAirPrint' | 'useBT', value: boolean) => {
    try {
      if (key === 'useAirPrint') {
        setUseAirPrint(value);
        await AsyncStorage.setItem('useAirPrint', JSON.stringify(value));
      } else {
        setUseBT(value);
        await AsyncStorage.setItem('useBT', value ? '1' : '0');
      }
      Toast.show({ type: ALERT_TYPE.SUCCESS, title: 'Settings Saved' });
    } catch (error) {
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Failed to save settings.' });
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.clear();
            // This navigation call is now type-safe
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth', params: { screen: 'SignIn' } }],
            });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <ListItem bottomDivider>
        <ListItem.Content style={styles.listItemContent}>
          <ListItem.Title style={styles.title}>Use AirPrint</ListItem.Title>
          <Switch onValueChange={(value) => toggleSwitch('useAirPrint', value)} value={useAirPrint} />
        </ListItem.Content>
      </ListItem>
      <ListItem bottomDivider>
        <ListItem.Content style={styles.listItemContent}>
          <ListItem.Title style={styles.title}>Use Bluetooth Printer</ListItem.Title>
          <Switch onValueChange={(value) => toggleSwitch('useBT', value)} value={useBT} />
        </ListItem.Content>
      </ListItem>
      <ListItem bottomDivider onPress={() => navigation.navigate('App', { screen: 'SelectPrinter' })}>
        <ListItem.Content>
          <ListItem.Title style={styles.title}>Select Brother Printer</ListItem.Title>
          <Text style={styles.subtitle}>{printerName || 'Not Selected'}</Text>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
      <ListItem bottomDivider onPress={() => navigation.navigate('App', { screen: 'ChangeData' })}>
        <ListItem.Content>
          <ListItem.Title style={styles.title}>Update Account Details</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
      <ListItem bottomDivider onPress={() => navigation.navigate('App', { screen: 'ChangePassword' })}>
        <ListItem.Content>
          <ListItem.Title style={styles.title}>Change Password</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <FontAwesome name="sign-out" size={20} color="#fff" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f2f2f7' },
    listItemContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: 16 },
    subtitle: { fontSize: 14, color: 'gray' },
    logoutButton: {
        flexDirection: 'row',
        backgroundColor: '#d9534f',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
        marginTop: 40,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});

export default Bluetooth;
