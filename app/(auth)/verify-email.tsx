import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { emailService } from '@/services/emailService';
import { storageService } from '@/services/storage';
import { loginSuccess } from '@/store/slices/authSlice';
import { Mail, CheckCircle, XCircle, RefreshCw } from 'react-native-feather';

export default function EmailVerificationScreen() {
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // If user is already verified, redirect to main app
    if (user?.isEmailVerified) {
      router.replace('/(tabs)');
    }
  }, [user?.isEmailVerified]);

  const handleVerifyEmail = async () => {
    if (!verificationCode.trim()) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    setIsVerifying(true);
    try {
      console.log('🔍 Verifying email with code:', verificationCode);
      
      const result = await emailService.verifyEmail(verificationCode);
      
      if (result.success) {
        // Update user verification status
        if (user) {
          const verifiedUser = { ...user, isEmailVerified: true };
          await storageService.saveUser(verifiedUser);
          dispatch(loginSuccess(verifiedUser));
        }

        Alert.alert(
          '✅ Email Verified!',
          'Your email has been successfully verified. You now have full access to all GoMate features!',
          [
            {
              text: 'Continue to App',
              onPress: () => router.replace('/(tabs)')
            }
          ]
        );
      } else {
        Alert.alert('❌ Verification Failed', result.message);
      }
    } catch (error) {
      console.error('Verification error:', error);
      Alert.alert('Error', 'An error occurred during verification. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendEmail = async () => {
    if (!user?.email) {
      Alert.alert('Error', 'No email address found');
      return;
    }

    setIsResending(true);
    try {
      const result = await emailService.resendVerificationEmail(user.email);
      Alert.alert(
        result.success ? '✅ Email Sent' : '❌ Failed',
        result.message
      );
    } catch (error) {
      console.error('Resend error:', error);
      Alert.alert('Error', 'Failed to resend email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleSkipForNow = () => {
    Alert.alert(
      'Skip Verification?',
      'You can skip email verification for now, but some features may be limited. You can verify your email later from your profile.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          style: 'default',
          onPress: () => router.replace('/(tabs)')
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Mail width={60} height={60} color="#007AFF" />
        </View>
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          We've sent a verification email to:
        </Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.instructionsContainer}>
        <Text style={styles.instructions}>
          📧 Check your email inbox (and spam folder)
        </Text>
        <Text style={styles.instructions}>
          🔗 Click the verification link in the email
        </Text>
        <Text style={styles.instructions}>
          📝 Or enter the verification code below:
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Verification Code</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter verification code"
          value={verificationCode}
          onChangeText={setVerificationCode}
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={20}
        />
      </View>

      <TouchableOpacity
        style={[styles.verifyButton, isVerifying && styles.disabledButton]}
        onPress={handleVerifyEmail}
        disabled={isVerifying}
      >
        {isVerifying ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <CheckCircle width={20} height={20} color="white" />
            <Text style={styles.verifyButtonText}>Verify Email</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.secondaryButton, isResending && styles.disabledButton]}
          onPress={handleResendEmail}
          disabled={isResending}
        >
          {isResending ? (
            <ActivityIndicator color="#007AFF" />
          ) : (
            <>
              <RefreshCw width={16} height={16} color="#007AFF" />
              <Text style={styles.secondaryButtonText}>Resend Email</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkipForNow}
        >
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.demoInfo}>
        <Text style={styles.demoTitle}>🧪 Demo Information:</Text>
        <Text style={styles.demoText}>
          • Check browser console for "email" content
        </Text>
        <Text style={styles.demoText}>
          • Codes starting with 'a' or containing '123' will work
        </Text>
        <Text style={styles.demoText}>
          • Current user token: {user?.verificationToken}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  instructionsContainer: {
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  instructions: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: 'white',
  },
  verifyButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  actionsContainer: {
    marginBottom: 30,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  skipButton: {
    alignItems: 'center',
    padding: 10,
  },
  skipButtonText: {
    color: '#666',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  disabledButton: {
    opacity: 0.6,
  },
  demoInfo: {
    backgroundColor: '#FFF3CD',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFECB5',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    color: '#856404',
    marginBottom: 4,
  },
});