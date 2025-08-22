import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ALERT_TYPE, Dialog, Toast } from 'react-native-alert-notification';
import ViewShot from 'react-native-view-shot';

import kioskApi from '../../api/kioskApi';
import { AppStackParamList } from '../../types/navigation';
import { printWithNameTag } from '../../services/printingServices';

// --- Type Definitions ---
type AddAttendeeNavigationProp = StackNavigationProp<AppStackParamList, 'AddAttendee'>;
type AddAttendeeRouteProp = RouteProp<AppStackParamList, 'AddAttendee'>;

interface AttendeeForm {
  fname: string;
  lname: string;
  email: string;
  phone: string;
}

const AddAttendee: React.FC = () => {
  const [form, setForm] = useState<AttendeeForm>({ fname: '', lname: '', email: '', phone: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<AddAttendeeNavigationProp>();
  const route = useRoute<AddAttendeeRouteProp>();
  const printViewRef = useRef<ViewShot>(null);

  const { searchText, kiosk_id, pin, prints, logo } = route.params;

  useEffect(() => {
    // Pre-fill form based on search text from previous screen
    if (searchText) {
      if (searchText.includes('@')) {
        setForm(prev => ({ ...prev, email: searchText }));
      } else if (/^\d+$/.test(searchText)) {
        setForm(prev => ({ ...prev, phone: searchText }));
      } else if (searchText.includes(' ')) {
        const parts = searchText.split(' ');
        setForm(prev => ({ ...prev, fname: parts[0], lname: parts.slice(1).join(' ') }));
      } else {
        setForm(prev => ({ ...prev, fname: searchText }));
      }
    }
  }, [searchText]);

  const handleInputChange = (field: keyof AttendeeForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.fname || !form.lname || !form.email) {
      Dialog.show({ type: ALERT_TYPE.WARNING, title: 'Missing Info', textBody: 'First name, last name, and email are required.' });
      return;
    }

    setIsLoading(true);
    try {
      await kioskApi.post('/events/checkin.php', {
        fattendee: form.fname,
        lattendee: form.lname,
        email: form.email,
        phone: form.phone,
        id: kiosk_id,
        ifs_id: '0', // New attendee
        pin: pin,
      });

      await printWithNameTag(printViewRef, { fname: form.fname, lname: form.lname, logo }, prints);

      Toast.show({ type: ALERT_TYPE.SUCCESS, title: 'Success', textBody: 'Attendee added and name tag is printing.' });
      navigation.goBack();

    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred.";
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <TextInput label="First Name" value={form.fname} onChangeText={text => handleInputChange('fname', text)} style={styles.input} mode="outlined" />
        <TextInput label="Last Name" value={form.lname} onChangeText={text => handleInputChange('lname', text)} style={styles.input} mode="outlined" />
        <TextInput label="Email Address" value={form.email} onChangeText={text => handleInputChange('email', text)} keyboardType="email-address" autoCapitalize="none" style={styles.input} mode="outlined" />
        <TextInput label="Phone Number" value={form.phone} onChangeText={text => handleInputChange('phone', text)} keyboardType="phone-pad" style={styles.input} mode="outlined" />

        <TouchableOpacity onPress={handleSubmit} disabled={isLoading} style={[styles.button, isLoading && styles.buttonDisabled]}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Check-in & Print Tag</Text>}
        </TouchableOpacity>
      </ScrollView>
      
      {/* Off-screen view for printing */}
      <ViewShot ref={printViewRef} style={{ position: 'absolute', left: -2000 }} />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 15 },
    input: { marginBottom: 15 },
    button: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    buttonDisabled: { backgroundColor: '#a3d9b1' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default AddAttendee;
