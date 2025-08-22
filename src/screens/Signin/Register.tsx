import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-paper';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { AuthStackParamList } from '../../types/navigation';
import kioskApi from '../../api/kioskApi';

type RegisterNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

const Register: React.FC = () => {
  const [companyName, setCompanyName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigation = useNavigation<RegisterNavigationProp>();

  const handleRegister = async () => {
    if (!companyName || !email || !password) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Error',
        textBody: 'Please fill out all fields.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await kioskApi.post('/users/register.php', {
        company_name: companyName,
        email: email,
        password: password,
      });

      const data = response.data;

      if (data.status === 'success') {
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Registration Successful',
          textBody: 'You can now sign in with your new account.',
          button: 'OK',
          onPressButton: () => navigation.navigate('SignIn'),
        });
      } else {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Registration Failed',
          textBody: data.message || 'An unknown error occurred.',
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Connection Error',
        textBody: 'Could not connect to the server. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image style={styles.logo} source={require('../../assets/register.png')} />
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Get started with your event kiosk</Text>

        <View style={styles.inputContainer}>
          <TextInput
            label="Company Name"
            value={companyName}
            onChangeText={setCompanyName}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            mode="outlined"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f8fa',
    },
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 30,
    },
    inputContainer: {
        width: '100%',
    },
    input: {
        marginBottom: 15,
    },
    button: {
        width: '100%',
        padding: 15,
        backgroundColor: '#007AFF',
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonDisabled: {
        backgroundColor: '#a9cff5',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Register;
