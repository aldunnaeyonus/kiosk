import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { ListItem } from '@rneui/themed';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import ViewShot, { captureRef, releaseCapture } from 'react-native-view-shot';

import kioskApi from '../../api/kioskApi';
import { AppStackParamList } from '../../types/navigation';
import { printWithNameTag } from '../../services/printingServices';

// --- Type Definitions ---
interface Attendee {
  id: string;
  fname: string;
  lname: string;
  email: string;
  phone: string;
  checked_in: string;
}

type CheckinsNavigationProp = StackNavigationProp<AppStackParamList, 'Checkins'>;
type CheckinsRouteProp = RouteProp<AppStackParamList, 'Checkins'>;

const Checkins: React.FC = () => {
  const [search, setSearch] = useState('');
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [filteredAttendees, setFilteredAttendees] = useState<Attendee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);
  
  const navigation = useNavigation<CheckinsNavigationProp>();
  const route = useRoute<CheckinsRouteProp>();
  const isFocused = useIsFocused();
  const printViewRef = useRef<ViewShot>(null);

  const { kiosk_event, kiosk_id, event_logo, prints, owner_id } = route.params;

  const fetchAttendees = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await kioskApi.get<Attendee[]>(`/events/attendees.php?kiosk_id=${kiosk_id}`);
      const sortedData = response.data.sort((a, b) => a.fname.localeCompare(b.fname));
      setAttendees(sortedData);
      setFilteredAttendees(sortedData);
    } catch (error) {
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Could not fetch attendees.' });
    } finally {
      setIsLoading(false);
    }
  }, [kiosk_id]);

  useEffect(() => {
    if (isFocused) {
      fetchAttendees();
    }
  }, [isFocused, fetchAttendees]);

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text) {
      const newData = attendees.filter(item => {
        const fullName = `${item.fname} ${item.lname}`.toUpperCase();
        return fullName.includes(text.toUpperCase());
      });
      setFilteredAttendees(newData);
    } else {
      setFilteredAttendees(attendees);
    }
  };

  const handleCheckIn = async (attendee: Attendee) => {
    setIsPrinting(true);
    try {
      await kioskApi.post('/events/checkin.php', {
        id: kiosk_id,
        ifs_id: attendee.id,
        pin: owner_id,
        fattendee: attendee.fname,
        lattendee: attendee.lname,
        email: attendee.email,
        phone: attendee.phone,
      });

      await printWithNameTag(printViewRef, { fname: attendee.fname, lname: attendee.lname, logo: event_logo }, prints || 1);
      
      Toast.show({ type: ALERT_TYPE.SUCCESS, title: 'Checked In', textBody: `${attendee.fname} is checked in.` });
      fetchAttendees(); // Refresh list to show updated status
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred.";
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: message });
    } finally {
      setIsPrinting(false);
    }
  };

  const renderItem = ({ item }: { item: Attendee }) => (
    <ListItem bottomDivider disabled={item.checked_in === '1' || isPrinting}>
      <ListItem.Content>
        <ListItem.Title style={item.checked_in === '1' ? styles.checkedInText : styles.itemText}>
          {item.fname} {item.lname}
        </ListItem.Title>
      </ListItem.Content>
      {item.checked_in !== '1' && (
        <TouchableOpacity onPress={() => handleCheckIn(item)} disabled={isPrinting}>
          <FontAwesome name="print" size={24} color={isPrinting ? '#ccc' : '#007AFF'} />
        </TouchableOpacity>
      )}
    </ListItem>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Attendee..."
        value={search}
        onChangeText={handleSearch}
      />
      {isLoading ? (
        <ActivityIndicator size="large" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={filteredAttendees}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>No attendees found.</Text>}
        />
      )}
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => navigation.navigate('AddAttendee', { searchText: search, kiosk_id, pin: owner_id, prints, logo: event_logo })}
      >
        <Text style={styles.addButtonText}>Add New Attendee</Text>
      </TouchableOpacity>
      
      {/* Off-screen view for printing */}
      <ViewShot ref={printViewRef} style={{ position: 'absolute', left: -2000 }} />
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    searchInput: { height: 50, borderWidth: 1, paddingLeft: 20, margin: 15, borderColor: '#dedede', borderRadius: 25, fontSize: 16 },
    itemText: { fontSize: 18 },
    checkedInText: { fontSize: 18, color: '#ccc', textDecorationLine: 'line-through' },
    emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: 'gray' },
    addButton: { backgroundColor: '#007AFF', padding: 15, alignItems: 'center', margin: 20, borderRadius: 25 },
    addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default Checkins;
