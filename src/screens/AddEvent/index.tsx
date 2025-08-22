import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { TextInput } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DatePickerModal } from "react-native-paper-dates";
import moment from "moment";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ALERT_TYPE, Dialog, Toast } from "react-native-alert-notification";
import DropDownPicker, { ItemType } from "react-native-dropdown-picker";
import { StackNavigationProp } from '@react-navigation/stack';

import kioskApi from "../../api/kioskApi";
import { AppStackParamList } from "../../types/navigation";

// --- Type Definitions ---
type AddEventNavigationProp = StackNavigationProp<AppStackParamList, 'AddEvent'>;

interface EventDetails {
  title: string;
  location: string;
  selectedDate: string;
  printQuantity: string | null;
  logo: string | null;
  infusionsoftTag: string | null;
}

interface DropdownItem {
  label: string;
  value: string;
}

const AddEvent: React.FC = () => {
  const [eventDetails, setEventDetails] = useState<EventDetails>({
    title: "",
    location: "",
    selectedDate: moment(new Date()).format("MMMM DD, YYYY"),
    printQuantity: null,
    logo: null,
    infusionsoftTag: null,
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [datePickerVisible, setDatePickerVisible] = useState<boolean>(false);
  const [kioskId, setKioskId] = useState<string | null>(null);
  const [isIfs, setIsIfs] = useState<boolean>(false);

  // Dropdown state
  const [logoOpen, setLogoOpen] = useState(false);
  const [tagOpen, setTagOpen] = useState(false);
  const [printsOpen, setPrintsOpen] = useState(false);
  const [logoItems, setLogoItems] = useState<DropdownItem[]>([]);
  const [tagItems, setTagItems] = useState<DropdownItem[]>([]);
  const [printItems, setPrintItems] = useState<DropdownItem[]>([
    { label: "Print 1 Name Tag", value: "1" },
    { label: "Print 2 Name Tags", value: "2" },
  ]);

  const isFocused = useIsFocused();
  const navigation = useNavigation<AddEventNavigationProp>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = await AsyncStorage.getItem("kiosk_id");
        const ifs = await AsyncStorage.getItem("kiosk_is_ifs");
        
        if (id) {
          setKioskId(id);
          setIsIfs(ifs === "1");

          const logoResponse = await kioskApi.get<DropdownItem[]>(`/fetch/index.php?type=logos&kiosk_id=${id}`);
          setLogoItems(logoResponse.data);

          if (ifs === "1") {
            const tagResponse = await kioskApi.get<DropdownItem[]>(`/fetch/index.php?type=tags&kiosk_id=${id}`);
            setTagItems(tagResponse.data);
          }
        }
      } catch (error) {
        Toast.show({ type: ALERT_TYPE.WARNING, title: "Data Error", textBody: "Could not load dropdown data." });
      }
    };
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);
  
  const handleInputChange = (field: keyof EventDetails, value: string | null) => {
    setEventDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const { title, location, printQuantity, logo } = eventDetails;
    if (!title || !location || !printQuantity || !logo) {
      Dialog.show({ type: ALERT_TYPE.WARNING, title: "Error", textBody: "Please fill out all required fields." });
      return;
    }

    setIsLoading(true);
    try {
      await kioskApi.post('/events/create.php', { ...eventDetails, kiosk_id: kioskId });
      Toast.show({ type: ALERT_TYPE.SUCCESS, title: "Success", textBody: "Event created successfully." });
      navigation.goBack();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      Toast.show({ type: ALERT_TYPE.DANGER, title: "Connection Failed", textBody: `Server Error: ${errorMessage}` });
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

  return (
    <SafeAreaProvider style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.inputRow}>
          <TextInput.Icon icon="tag-multiple-outline" size={20} color="#007AFF" />
          <TextInput label="Event Title" value={eventDetails.title} onChangeText={(text) => handleInputChange('title', text)} style={styles.input} />
        </View>
        <View style={styles.inputRow}>
          <TextInput.Icon icon="map-marker" size={20} color="#007AFF" />
          <TextInput label="Event Location" value={eventDetails.location} onChangeText={(text) => handleInputChange('location', text)} style={styles.input} />
        </View>
        <TouchableWithoutFeedback onPress={() => setDatePickerVisible(true)}>
          <View style={styles.inputRow}>
            <TextInput.Icon icon="clock-outline" size={20} color="#007AFF" />
            <Text style={styles.dateText}>Event Date: {eventDetails.selectedDate}</Text>
          </View>
        </TouchableWithoutFeedback>

        <View style={[styles.dropdownContainer, { zIndex: 3000 }]}>
          <DropDownPicker open={printsOpen} value={eventDetails.printQuantity} items={printItems} setOpen={setPrintsOpen} setValue={(val) => handleInputChange('printQuantity', val(eventDetails.printQuantity))} setItems={setPrintItems as any} placeholder="Select Print Quantity" style={styles.dropdown} />
        </View>
        <View style={[styles.dropdownContainer, { zIndex: 2000 }]}>
          <DropDownPicker open={logoOpen} value={eventDetails.logo} items={logoItems} setOpen={setLogoOpen} setValue={(val) => handleInputChange('logo', val(eventDetails.logo))} setItems={setLogoItems} placeholder="Select Event Logo" style={styles.dropdown} />
        </View>
        {isIfs && (
          <View style={[styles.dropdownContainer, { zIndex: 1000 }]}>
            <DropDownPicker open={tagOpen} value={eventDetails.infusionsoftTag} items={tagItems} setOpen={setTagOpen} setValue={(val) => handleInputChange('infusionsoftTag', val(eventDetails.infusionsoftTag))} setItems={setTagItems} placeholder="Select Infusionsoft Tag" style={styles.dropdown} />
          </View>
        )}

        <TouchableOpacity onPress={handleSubmit} disabled={isLoading} style={[styles.button, isLoading && styles.buttonDisabled]}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create Event</Text>}
        </TouchableOpacity>
      </ScrollView>
      <DatePickerModal locale="en" mode="single" visible={datePickerVisible} onDismiss={() => setDatePickerVisible(false)} date={moment(eventDetails.selectedDate, "MMMM DD, YYYY").toDate()} onConfirm={onConfirmDate} validRange={{ startDate: new Date() }} />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    inputRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee', paddingHorizontal: 15 },
    input: { flex: 1, backgroundColor: 'transparent' },
    dateText: { flex: 1, paddingVertical: 20, fontSize: 16, marginLeft: 10 },
    dropdownContainer: { paddingHorizontal: 15, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
    dropdown: { borderWidth: 0, backgroundColor: 'transparent' },
    button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 25, alignItems: 'center', margin: 20 },
    buttonDisabled: { backgroundColor: '#a9cff5' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default AddEvent;
