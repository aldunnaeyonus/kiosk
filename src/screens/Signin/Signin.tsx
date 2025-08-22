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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-paper';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { sha256 } from "js-sha256";
import { RootStackParamList } from '../../types/navigation'; // Import the main RootStackParamList
import kioskApi from '../../api/kioskApi';

// Use the RootStackParamList to give the navigator access to all top-level screens
type SignInNavigationProp = StackNavigationProp<RootStackParamList>;

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigation = useNavigation<SignInNavigationProp>();

  const handleSignIn = async () => {
    if (!email || !password) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Error',
        textBody: 'Please enter both email and password.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await kioskApi.post('/users/index.php', {
        email: email,
        password: sha256(password),
      });

      const data = response.data;

      if (data.status === 'success') {
        // Store user data securely
        await AsyncStorage.multiSet([
          ['logedIn', 'true'],
          ['kiosk_id', data.kiosk_id.toString()],
          ['kiosk_is_ifs', data.kiosk_is_ifs.toString()],
          ['kiosk_comapny_name', data.kiosk_company_name],
        ]);
        
        // This navigation will now be type-safe
        navigation.reset({
          index: 0,
          routes: [{ name: 'App', params: { screen: 'EventList' } }],
        });

      } else {
        
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Sign In Failed',
          textBody: data.message || 'Invalid credentials provided.',
        });
      }
    } catch (error) {
      console.error("Sign in error:", error);
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
        <Image style={styles.logo} source={require('../../assets/login.png')} />
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <View style={styles.inputContainer}>
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
          onPress={handleSignIn}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Auth', { screen: 'Register' })}>
            <Text style={styles.footerLink}>Register</Text>
          </TouchableOpacity>
        </View>
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
    footer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    footerText: {
        fontSize: 16,
        color: 'gray',
    },
    footerLink: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: 'bold',
    },
});

export default SignIn;
