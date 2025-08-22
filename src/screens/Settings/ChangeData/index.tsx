import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { ALERT_TYPE, Dialog, Toast } from 'react-native-alert-notification';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';

import kioskApi from '../../../api/kioskApi';

interface DropdownItem {
  label: string;
  value: string;
}

const ChangeData: React.FC = () => {
  const [companyName, setCompanyName] = useState('');
  const [isIfs, setIsIfs] = useState(false);
  const [logoItems, setLogoItems] = useState<DropdownItem[]>([]);
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null);
  const [logoOpen, setLogoOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const kioskId = await AsyncStorage.getItem('kiosk_id');
        const company = await AsyncStorage.getItem('kiosk_comapny_name');
        const ifsEnabled = await AsyncStorage.getItem('kiosk_is_ifs');

        setCompanyName(company || '');
        setIsIfs(ifsEnabled === '1');

        if (kioskId) {
          const response = await kioskApi.get<DropdownItem[]>(`/fetch/index.php?type=logos&kiosk_id=${kioskId}`);
          setLogoItems(response.data);
        }
      } catch (error) {
        Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Could not load initial data.' });
      } finally {
        setIsLoading(false);
      }
    };

    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const kioskId = await AsyncStorage.getItem('kiosk_id');
      await kioskApi.post('/update/index.php', {
        kiosk_id: kioskId,
        company_name: companyName,
        is_ifs: isIfs ? '1' : '0',
        logo: selectedLogo,
      });

      // Update local storage
      await AsyncStorage.setItem('kiosk_comapny_name', companyName);
      await AsyncStorage.setItem('kiosk_is_ifs', isIfs ? '1' : '0');

      Toast.show({ type: ALERT_TYPE.SUCCESS, title: 'Success', textBody: 'Account details updated.' });
    } catch (error) {
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Failed to save details.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <TextInput
          label="Company Name"
          value={companyName}
          onChangeText={setCompanyName}
          style={styles.input}
          mode="outlined"
        />
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Enable Infusionsoft/KEAP</Text>
          <Switch value={isIfs} onValueChange={setIsIfs} />
        </View>
        <View style={[styles.dropdownContainer, { zIndex: 1000 }]}>
          <DropDownPicker
            open={logoOpen}
            value={selectedLogo}
            items={logoItems}
            setOpen={setLogoOpen}
            setValue={setSelectedLogo}
            setItems={setLogoItems as any}
            placeholder="Select Default Logo (Optional)"
            style={styles.dropdown}
          />
        </View>
        <TouchableOpacity onPress={handleSave} disabled={isLoading} style={[styles.button, isLoading && styles.buttonDisabled]}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save Changes</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20 },
    input: { marginBottom: 20 },
    switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingVertical: 10 },
    switchLabel: { fontSize: 16 },
    dropdownContainer: { marginBottom: 20 },
    dropdown: { backgroundColor: '#f7f7f7', borderWidth: 0 },
    button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    buttonDisabled: { backgroundColor: '#a9cff5' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default ChangeData;
