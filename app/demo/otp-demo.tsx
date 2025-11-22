import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { otpService } from '@/services/otpService';
import { TestTube2, Send, Phone } from 'react-native-feather';

export default function OTPDemoScreen() {
  const [email, setEmail] = useState('demo@test.com');
  const [firstName, setFirstName] = useState('Demo');
  const [lastName, setLastName] = useState('User');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email.trim() || !firstName.trim()) {
      Alert.alert('Error', 'Please fill in email and first name');
      return;
    }

    setIsLoading(true);
    try {
      const result = await otpService.sendOTP({
        email: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim()
      });

      if (result.success) {
        Alert.alert(
          '✅ OTP Sent!',
          `Check the console for your OTP code.\n\nCode: ${result.otpCode}`,
          [
            {
              text: 'Go to Verification',
              onPress: () => {
                router.push({
                  pathname: '/(auth)/otp-verification',
                  params: {
                    email: email.trim(),
                    firstName: firstName.trim(),
                    lastName: lastName.trim()
                  }
                });
              }
            },
            { text: 'Stay Here', style: 'cancel' }
          ]
        );
      } else {
        Alert.alert('❌ Failed', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const quickTests = [
    {
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      label: 'John Doe'
    },
    {
      email: 'sarah@gmail.com',
      firstName: 'Sarah',
      lastName: 'Smith',
      label: 'Sarah Smith'
    },
    {
      email: 'test@company.com',
      firstName: 'Test',
      lastName: 'User',
      label: 'Test User'
    }
  ];

  const fillQuickTest = (test: typeof quickTests[0]) => {
    setEmail(test.email);
    setFirstName(test.firstName);
    setLastName(test.lastName);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <TestTube2 width={40} height={40} color="#007AFF" />
          </View>
          <Text style={styles.title}>OTP System Demo</Text>
          <Text style={styles.subtitle}>
            Test the One-Time Password verification system
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Test OTP Sending</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email address"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>First Name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter first name"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter last name"
              autoCapitalize="words"
            />
          </View>

          <TouchableOpacity
            style={[styles.sendButton, isLoading && styles.disabledButton]}
            onPress={handleSendOTP}
            disabled={isLoading}
          >
            <Send width={20} height={20} color="white" />
            <Text style={styles.sendButtonText}>
              {isLoading ? 'Sending OTP...' : 'Send OTP Code'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickTestContainer}>
          <Text style={styles.sectionTitle}>Quick Test Data</Text>
          <Text style={styles.quickTestSubtitle}>
            Tap to auto-fill test data
          </Text>
          
          {quickTests.map((test, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickTestButton}
              onPress={() => fillQuickTest(test)}
            >
              <View style={styles.quickTestIcon}>
                <Phone width={16} height={16} color="#007AFF" />
              </View>
              <View style={styles.quickTestInfo}>
                <Text style={styles.quickTestName}>{test.label}</Text>
                <Text style={styles.quickTestEmail}>{test.email}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>🧪 How It Works:</Text>
          <Text style={styles.infoText}>
            1. Enter email and name details above
          </Text>
          <Text style={styles.infoText}>
            2. Tap "Send OTP Code" to generate a 6-digit code
          </Text>
          <Text style={styles.infoText}>
            3. Check the browser console for the OTP code
          </Text>
          <Text style={styles.infoText}>
            4. Navigate to verification screen to enter the code
          </Text>
          <Text style={styles.infoText}>
            5. Code expires in 5 minutes with 3 attempts max
          </Text>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back to App</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  quickTestContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickTestSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  quickTestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  quickTestIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quickTestInfo: {
    flex: 1,
  },
  quickTestName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  quickTestEmail: {
    fontSize: 14,
    color: '#666',
  },
  infoContainer: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#2E7D32',
    marginBottom: 6,
    lineHeight: 20,
  },
  backButton: {
    alignItems: 'center',
    padding: 15,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});