import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { ALERT_TYPE, Dialog, Toast } from 'react-native-alert-notification';

import kioskApi from '../../api/kioskApi';
import { AppStackParamList } from '../../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';

// --- Type Definitions ---
interface Event {
  kiosk_event_id: string;
  kiosk_event_name: string;
  kiosk_event_owner_id: string;
  kiosk_event_status: string;
  kiosk_event_logo: string;
  kiosk_event_print: string;
  kiosk_event_location: string;
  kiosk_event_timestring: string;
  kiosk_event_attendees: number;
  kiosk_event_timestamp: number;
}

type EventListsNavigationProp = StackNavigationProp<AppStackParamList, 'EventList'>;

const EventLists: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [kioskId, setKioskId] = useState<string | null>(null);
  const [kioskName, setKioskName] = useState<string | null>(null);
  const [filteredDataSource, setFilteredDataSource] = useState<Event[]>([]);
  const [masterDataSource, setMasterDataSource] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();
  const navigation = useNavigation<EventListsNavigationProp>();

  const fetchEvents = useCallback(async () => {
    if (!kioskId) return;
    setIsLoading(true);
    try {
      const response = await kioskApi.get<Event[]>(`/events/index.php?kiosk_id=${kioskId}&active=${selectedIndex}`);
      const sortedData = response.data.sort((a, b) => b.kiosk_event_timestamp - a.kiosk_event_timestamp);
      setMasterDataSource(sortedData);
      setFilteredDataSource(sortedData);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Could not fetch events.' });
    } finally {
      setIsLoading(false);
    }
  }, [kioskId, selectedIndex]);

  useEffect(() => {
    const loadInitialData = async () => {
      const id = await AsyncStorage.getItem("kiosk_id");
      const name = await AsyncStorage.getItem("kiosk_comapny_name");
      setKioskId(id);
      setKioskName(name);
    };
    loadInitialData();
  }, []);
  
  useEffect(() => {
    if (isFocused && kioskId) {
      fetchEvents();
    }
  }, [isFocused, kioskId, fetchEvents]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: `${kioskName || 'Kiosk'} Event List`,
      headerRight: () => (
        <FontAwesome
          style={{ paddingRight: 20 }}
          size={28}
          color="black"
          name={"sliders"}
          onPress={() => navigation.navigate("KioskSettings")}
        />
      ),
    });
  }, [navigation, kioskName]);

  const handleSingleIndexSelect = (index: number) => {
    setSelectedIndex(index);
  };

  const searchFilterFunction = (text: string) => {
    setSearch(text);
    if (text) {
      const newData = masterDataSource.filter(item => {
        const itemData = item.kiosk_event_name ? item.kiosk_event_name.toUpperCase() : '';
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
    } else {
      setFilteredDataSource(masterDataSource);
    }
  };
  
  const archiveEvent = async (eventId: string) => {
      try {
          await kioskApi.post('/events/close.php', { kiosk_id: eventId });
          Toast.show({ type: ALERT_TYPE.SUCCESS, title: 'Success', textBody: 'Event archived.' });
          fetchEvents(); // Refresh list
      } catch (error) {
          Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Could not archive event.' });
      }
  };

  const renderItem = ({ item }: { item: Event }) => (
    <TouchableOpacity onPress={() => {
        if (item.kiosk_event_status === "0") {
            Alert.alert("Event Actions", "Choose an action:", [
                { text: "Kiosk Mode", onPress: () => navigation.navigate('Checkins', { kiosk_event: item.kiosk_event_name }) },
                { text: "Admin Mode", onPress: () => navigation.navigate('Checkins', { kiosk_event: item.kiosk_event_name }) },
                { text: "Edit Mode", onPress: () => navigation.navigate('EditEvent') },
                { text: "Archive Event", style: 'destructive', onPress: () => archiveEvent(item.kiosk_event_id) },
                { text: "Cancel", style: "cancel" },
            ]);
        } else {
            navigation.navigate('ViewAttendees', { kiosk_id: item.kiosk_event_id, kiosk_event: item.kiosk_event_name });
        }
    }}>
      <View style={styles.listItem}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.itemTitle, item.kiosk_event_status !== "0" && { color: 'red' }]}>{item.kiosk_event_name}</Text>
          <Text style={styles.itemSubtitle}>{item.kiosk_event_location}</Text>
          <Text style={styles.itemDate}>{item.kiosk_event_timestring}</Text>
        </View>
        <View style={styles.attendeeCount}>
          <FontAwesome name="users" size={15} style={{ marginRight: 5 }} />
          <Text>{item.kiosk_event_attendees}</Text>
        </View>
        {item.kiosk_event_status === "0" && <FontAwesome name="chevron-right" size={20} color="#5A5A5A" />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInputStyle}
        value={search}
        onChangeText={searchFilterFunction}
        placeholder="Search Events"
      />
      <View style={styles.segmentedControlContainer}>
        <SegmentedControlTab
          values={["Active Events", "Closed Events"]}
          selectedIndex={selectedIndex}
          onTabPress={handleSingleIndexSelect}
          tabStyle={styles.tabStyle}
          activeTabStyle={styles.activeTabStyle}
          tabTextStyle={styles.tabTextStyle}
        />
      </View>
      
      {isLoading ? (
        <ActivityIndicator style={{ flex: 1 }} size="large" />
      ) : (
        <FlatList
          data={filteredDataSource}
          keyExtractor={(item) => item.kiosk_event_id}
          renderItem={renderItem}
          ListEmptyComponent={<Image source={require('../../assets/emptyList.png')} style={styles.emptyImage} />}
          onRefresh={fetchEvents}
          refreshing={isLoading}
        />
      )}

      <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('AddEvent')}>
        <Text style={styles.createButtonText}>Create New Event</Text>
        <FontAwesome name="send" size={15} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    textInputStyle: { height: 50, borderWidth: 1, paddingLeft: 20, margin: 15, borderColor: '#dedede', borderRadius: 25, fontSize: 16 },
    segmentedControlContainer: { paddingHorizontal: 40, marginBottom: 15 },
    tabStyle: { borderColor: '#007AFF' },
    activeTabStyle: { backgroundColor: '#007AFF' },
    tabTextStyle: { color: '#007AFF' },
    listItem: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', alignItems: 'center' },
    itemTitle: { fontWeight: 'bold', fontSize: 18 },
    itemSubtitle: { fontSize: 14, color: '#808080', paddingTop: 5 },
    itemDate: { fontSize: 14, fontWeight: 'bold', color: '#808080', paddingTop: 5 },
    attendeeCount: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#efefef', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15, marginRight: 15 },
    emptyImage: { width: 250, height: 250, alignSelf: 'center', marginTop: 50, opacity: 0.5 },
    createButton: { flexDirection: 'row', backgroundColor: '#007AFF', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 25, alignSelf: 'center', margin: 20, alignItems: 'center' },
    createButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginRight: 10 },
});

export default EventLists;
