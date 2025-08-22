import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { ALERT_TYPE, Dialog, Toast } from 'react-native-alert-notification';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';
import moment from 'moment';
import { DatePickerModal } from 'react-native-paper-dates';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

import kioskApi from '../../api/kioskApi';
import { AppStackParamList } from '../../types/navigation';

// --- Type Definitions ---
type EditEventNavigationProp = StackNavigationProp<AppStackParamList, 'EditEvent'>;
type EditEventRouteProp = RouteProp<AppStackParamList, 'EditEvent'>;

interface EventDetails {
  title: string;
  location: string;
  selectedDate: string;
  printQuantity: string | null;
  logo: string | null;
}

interface DropdownItem {
  label: string;
  value: string;
}

const EditEvents: React.FC = () => {
  const [eventDetails, setEventDetails] = useState<EventDetails>({
    title: "",
    location: "",
    selectedDate: moment(new Date()).format("MMMM DD, YYYY"),
    printQuantity: null,
    logo: null,
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [logoOpen, setLogoOpen] = useState(false);
  const [printsOpen, setPrintsOpen] = useState(false);
  const [logoItems, setLogoItems] = useState<DropdownItem[]>([]);
  const [printItems, setPrintItems] = useState<DropdownItem[]>([
    { label: "Print 1 Name Tag", value: "1" },
    { label: "Print 2 Name Tags", value: "2" },
  ]);

  const isFocused = useIsFocused();
  const navigation = useNavigation<EditEventNavigationProp>();
  const route = useRoute<EditEventRouteProp>();
  const { kiosk_id } = route.params;

  useEffect(() => {
    const loadEventData = async () => {
      setIsLoading(true);
      try {
        const kioskId = await AsyncStorage.getItem('kiosk_id');
        // First, fetch the existing event details
        const eventResponse = await kioskApi.get(`/events/details.php?kiosk_id=${kiosk_id}`);
        const data = eventResponse.data;
        setEventDetails({
            title: data.kiosk_event_name,
            location: data.kiosk_event_location,
            selectedDate: data.kiosk_event_timestring,
            printQuantity: data.kiosk_event_print,
            logo: data.kiosk_event_logo,
        });

        // Then, fetch the list of available logos
        const logoResponse = await kioskApi.get<DropdownItem[]>(`/fetch/index.php?type=logos&kiosk_id=${kioskId}`);
        setLogoItems(logoResponse.data);
      } catch (error) {
        Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Could not load event data.' });
      } finally {
        setIsLoading(false);
      }
    };

    if (isFocused) {
      loadEventData();
    }
  }, [isFocused, kiosk_id]);

  const handleInputChange = (field: keyof EventDetails, value: string | null) => {
    setEventDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await kioskApi.post('/events/update.php', {
        kiosk_id: kiosk_id,
        title: eventDetails.title,
        location: eventDetails.location,
        selectedDate: eventDetails.selectedDate,
        prints: eventDetails.printQuantity,
        logo: eventDetails.logo,
      });
      Toast.show({ type: ALERT_TYPE.SUCCESS, title: 'Success', textBody: 'Event details updated.' });
      navigation.goBack();
    } catch (error) {
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Failed to save event details.' });
    } finally {
      setIsLoading(false);
    }
  };

  const onConfirmDate = useCallback((params: { date?: Date }) => {
    setDatePickerVisible(false);
    if (params.date) {
      handleInputChange('selectedDate', moment(params.date).format("MMMM DD, YYYY"));
    }
  }, []);

  if (isLoading) {
      return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <TextInput label="Event Title" value={eventDetails.title} onChangeText={text => handleInputChange('title', text)} style={styles.input} mode="outlined" />
        <TextInput label="Event Location" value={eventDetails.location} onChangeText={text => handleInputChange('location', text)} style={styles.input} mode="outlined" />
        <TouchableWithoutFeedback onPress={() => setDatePickerVisible(true)}>
          <View style={styles.datePicker}>
            <Text style={styles.dateText}>Event Date: {eventDetails.selectedDate}</Text>
          </View>
        </TouchableWithoutFeedback>
        <View style={[styles.dropdownContainer, { zIndex: 2000 }]}>
          <DropDownPicker open={printsOpen} value={eventDetails.printQuantity} items={printItems} setOpen={setPrintsOpen} setValue={val => handleInputChange('printQuantity', val(eventDetails.printQuantity))} setItems={setPrintItems as any} style={styles.dropdown} />
        </View>
        <View style={[styles.dropdownContainer, { zIndex: 1000 }]}>
          <DropDownPicker open={logoOpen} value={eventDetails.logo} items={logoItems} setOpen={setLogoOpen} setValue={val => handleInputChange('logo', val(eventDetails.logo))} setItems={setLogoItems} style={styles.dropdown} />
        </View>
        <TouchableOpacity onPress={handleSave} disabled={isLoading} style={[styles.button, isLoading && styles.buttonDisabled]}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save Changes</Text>}
        </TouchableOpacity>
      </ScrollView>
      <DatePickerModal locale="en" mode="single" visible={datePickerVisible} onDismiss={() => setDatePickerVisible(false)} date={moment(eventDetails.selectedDate, "MMMM DD, YYYY").toDate()} onConfirm={onConfirmDate} />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20 },
    input: { marginBottom: 15 },
    datePicker: { padding: 15, borderWidth: 1, borderColor: '#ccc', borderRadius: 4, marginBottom: 15 },
    dateText: { fontSize: 16 },
    dropdownContainer: { marginBottom: 15 },
    dropdown: { backgroundColor: '#f7f7f7', borderWidth: 0 },
    button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    buttonDisabled: { backgroundColor: '#a9cff5' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default EditEvents;
