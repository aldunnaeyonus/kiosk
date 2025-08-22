import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TextInput,
  Image,
  ActivityIndicator,
  Text
} from "react-native";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { RouteProp } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { ListItem } from '@rneui/themed';
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";

import kioskApi from '../../api/kioskApi';
import { AppStackParamList } from '../../types/navigation';

// --- Type Definitions ---
interface Attendee {
  kiosk_attendee_events_attendee_fname: string;
  kiosk_attendee_events_attendee_lname: string;
  kiosk_attendee_events_attendee_email: string;
  kiosk_attendee_events_attendee_phone: string;
}

type ViewAttendeesRouteProp = RouteProp<AppStackParamList, 'ViewAttendees'>;

const ViewAttendees: React.FC = () => {
  const [search, setSearch] = useState('');
  const [masterDataSource, setMasterDataSource] = useState<Attendee[]>([]);
  const [filteredDataSource, setFilteredDataSource] = useState<Attendee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();
  const route = useRoute<ViewAttendeesRouteProp>();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await kioskApi.get<Attendee[]>(`/events/attendees.php?kiosk_id=${route.params.kiosk_id}`);
      const sortedData = response.data.sort((a, b) => 
        a.kiosk_attendee_events_attendee_fname.localeCompare(b.kiosk_attendee_events_attendee_fname)
      );
      setMasterDataSource(sortedData);
      setFilteredDataSource(sortedData);
    } catch (error) {
      Dialog.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Could not fetch attendee list.' });
    } finally {
      setIsLoading(false);
    }
  }, [route.params.kiosk_id]);

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused, fetchData]);

  const searchFilterFunction = (text: string) => {
    setSearch(text);
    if (text) {
      const newData = masterDataSource.filter(item => {
        const itemData = `${item.kiosk_attendee_events_attendee_fname} ${item.kiosk_attendee_events_attendee_lname}`.toUpperCase();
        return itemData.includes(text.toUpperCase());
      });
      setFilteredDataSource(newData);
    } else {
      setFilteredDataSource(masterDataSource);
    }
  };

  const renderItem = ({ item }: { item: Attendee }) => (
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title style={styles.title}>
          <FontAwesome name="id-badge" size={20} style={styles.icon} />
          {` ${item.kiosk_attendee_events_attendee_fname} ${item.kiosk_attendee_events_attendee_lname}`}
        </ListItem.Title>
        <ListItem.Subtitle style={styles.subtitle}>
          <FontAwesome name="envelope-o" size={15} style={styles.icon} />
          {` ${item.kiosk_attendee_events_attendee_email} | `}
          <FontAwesome name="mobile" size={15} style={styles.icon} />
          {` ${item.kiosk_attendee_events_attendee_phone}`}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInputStyle}
        onChangeText={searchFilterFunction}
        value={search}
        placeholder="Search by Attendee Name"
      />
      {isLoading ? (
        <ActivityIndicator size="large" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={filteredDataSource}
          keyExtractor={(item) => item.kiosk_attendee_events_attendee_email}
          renderItem={renderItem}
          ListEmptyComponent={<Image source={require('../../assets/emptyList.png')} style={styles.emptyImage} />}
          onRefresh={fetchData}
          refreshing={isLoading}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    textInputStyle: { height: 50, borderWidth: 1, paddingLeft: 20, margin: 15, borderColor: '#dedede', borderRadius: 25, fontSize: 16 },
    emptyImage: { width: 250, height: 250, alignSelf: 'center', marginTop: 50, opacity: 0.5 },
    title: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
    subtitle: { fontSize: 14, color: '#5A5A5A' },
    icon: { color: "#5A5A5A", marginRight: 8 },
});

export default ViewAttendees;
