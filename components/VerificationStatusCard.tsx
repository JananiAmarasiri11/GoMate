import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Mail, AlertCircle } from 'react-native-feather';
import { router } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function VerificationStatusCard() {
  const user = useSelector((state: RootState) => state.auth.user);

  // Don't show if user is verified or not logged in
  if (!user || user.isEmailVerified) {
    return null;
  }

  const handleVerifyPress = () => {
    router.push({
      pathname: '/(auth)/otp-verification',
      params: {
        email: user.email,
        firstName: user.firstName || 'User',
        lastName: user.lastName || ''
      }
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <AlertCircle width={24} height={24} color="#FF9500" />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>Email Verification Pending</Text>
        <Text style={styles.subtitle}>
          Complete verification to access all features
        </Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <TouchableOpacity 
        style={styles.verifyButton}
        onPress={handleVerifyPress}
      >
        <Mail width={16} height={16} color="white" />
        <Text style={styles.verifyButtonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF3CD',
    borderColor: '#FFECB5',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
    padding: 4,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#856404',
    marginBottom: 4,
  },
  email: {
    fontSize: 12,
    color: '#996515',
    fontWeight: '500',
  },
  verifyButton: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});