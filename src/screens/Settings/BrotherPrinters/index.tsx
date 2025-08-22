import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BRPtouchPrinter, { Printer } from 'react-native-brother-printers';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { useNavigation } from '@react-navigation/native';

const BrotherPrinters: React.FC = () => {
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    // Automatically search for printers when the component mounts
    searchForPrinters();
  }, []);

  const searchForPrinters = async () => {
    if (Platform.OS === 'web') {
      Toast.show({ type: ALERT_TYPE.WARNING, title: 'Unsupported', textBody: 'Printer discovery is not available on the web.' });
      return;
    }
    setIsLoading(true);
    try {
      // The discoverPrinters method might need specific params depending on the library version
      const discoveredPrinters: Printer[] = await BRPtouchPrinter.discoverPrinters({});
      setPrinters(discoveredPrinters);
      if (discoveredPrinters.length === 0) {
        Toast.show({ type: ALERT_TYPE.WARNING, title: 'No Printers Found', textBody: 'Ensure you are on the same Wi-Fi network as the printer.' });
      }
    } catch (error) {
      console.error("Failed to discover printers:", error);
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Discovery Error', textBody: 'Could not search for printers.' });
    } finally {
      setIsLoading(false);
    }
  };

  const selectPrinter = async (printer: Printer) => {
    try {
      // Storing the IP address or another unique identifier
      const printerIdentifier = printer.ipAddress || printer.modelName;
      await AsyncStorage.setItem('BrotherPrinter', printerIdentifier);
      await AsyncStorage.setItem('BrotherPrinterIP', printer.ipAddress);
      
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Printer Selected',
        textBody: `${printer.modelName} is now the default printer.`,
      });
      navigation.goBack();
    } catch (error) {
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Could not save the selected printer.' });
    }
  };

  const renderItem = ({ item }: { item: Printer }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => selectPrinter(item)}>
      <Text style={styles.itemTitle}>{item.modelName}</Text>
      <Text style={styles.itemSubtitle}>{item.ipAddress || 'N/A'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.searchButton} onPress={searchForPrinters} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.searchButtonText}>Search for Printers</Text>
        )}
      </TouchableOpacity>
      <FlatList
        data={printers}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.ipAddress || index.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No printers found. Tap search to begin.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    searchButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center', margin: 20 },
    searchButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    itemContainer: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
    itemTitle: { fontSize: 18, fontWeight: 'bold' },
    itemSubtitle: { fontSize: 14, color: 'gray', marginTop: 5 },
    emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: 'gray' },
});

export default BrotherPrinters;
