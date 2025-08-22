import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALERT_TYPE, Dialog, Toast } from 'react-native-alert-notification';
import { useNavigation } from '@react-navigation/native';

import kioskApi from '../../../api/kioskApi';

const ChangePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      Dialog.show({ type: ALERT_TYPE.WARNING, title: 'Error', textBody: 'Please fill out both fields.' });
      return;
    }

    setIsLoading(true);
    try {
      const kioskId = await AsyncStorage.getItem('kiosk_id');
      const response = await kioskApi.post('/profile/password.php', {
        kiosk_id: kioskId,
        current_password: currentPassword,
        new_password: newPassword,
      });

      if (response.data.status === 'success') {
        Toast.show({ type: ALERT_TYPE.SUCCESS, title: 'Success', textBody: 'Password changed successfully.' });
        navigation.goBack();
      } else {
        Dialog.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: response.data.message || 'Failed to change password.' });
      }
    } catch (error) {
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Connection Error', textBody: 'Could not connect to the server.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <TextInput
          label="Current Password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
        />
        <TouchableOpacity onPress={handleChangePassword} disabled={isLoading} style={[styles.button, isLoading && styles.buttonDisabled]}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Change Password</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20 },
    input: { marginBottom: 20 },
    button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    buttonDisabled: { backgroundColor: '#a9cff5' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default ChangePassword;
