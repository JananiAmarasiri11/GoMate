import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Mail, X } from 'react-native-feather';
import { router } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { emailService } from '@/services/emailService';

interface EmailVerificationBannerProps {
  onDismiss?: () => void;
}

export default function EmailVerificationBanner({ onDismiss }: EmailVerificationBannerProps) {
  const user = useSelector((state: RootState) => state.auth.user);

  // Don't show banner if user is verified or not logged in
  if (!user || user.isEmailVerified) {
    return null;
  }

  const handleVerifyPress = () => {
    router.push('/(auth)/verify-email');
  };

  const handleResendPress = async () => {
    try {
      const result = await emailService.resendVerificationEmail(user.email);
      Alert.alert(
        result.success ? '✅ Email Sent' : '❌ Failed',
        result.message
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to resend email. Please try again.');
    }
  };

  return (
    <View style={styles.banner}>
      <View style={styles.iconContainer}>
        <Mail width={20} height={20} color="#FF9500" />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>Email Verification Required</Text>
        <Text style={styles.subtitle}>
          Please verify your email to access all features
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.verifyButton}
          onPress={handleVerifyPress}
        >
          <Text style={styles.verifyButtonText}>Verify</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.resendButton}
          onPress={handleResendPress}
        >
          <Text style={styles.resendButtonText}>Resend</Text>
        </TouchableOpacity>

        {onDismiss && (
          <TouchableOpacity 
            style={styles.dismissButton}
            onPress={onDismiss}
          >
            <X width={16} height={16} color="#666" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FFF3CD',
    borderColor: '#FFECB5',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#856404',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  verifyButton: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  resendButton: {
    borderWidth: 1,
    borderColor: '#FF9500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  resendButtonText: {
    color: '#FF9500',
    fontSize: 11,
    fontWeight: '500',
  },
  dismissButton: {
    padding: 4,
  },
});