import React, { useState, useEffect, useRef } from 'react';
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
import { router, useLocalSearchParams } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { otpService } from '@/services/otpService';
import { storageService } from '@/services/storage';
import { loginSuccess } from '@/store/slices/authSlice';
import { Mail, CheckCircle, Clock, RefreshCw } from 'react-native-feather';

export default function OTPVerificationScreen() {
  const params = useLocalSearchParams();
  const { email, firstName, lastName } = params as { email: string; firstName: string; lastName: string };
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Start countdown timer
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits are entered
    if (value && index === 5 && newOtp.every(digit => digit !== '')) {
      handleVerifyOTP(newOtp.join(''));
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (otpCode?: string) => {
    const codeToVerify = otpCode || otp.join('');
    
    if (codeToVerify.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit code');
      return;
    }

    setIsVerifying(true);
    try {
      console.log('🔍 Verifying OTP:', codeToVerify);
      
      const result = await otpService.verifyOTP(email, codeToVerify);
      
      if (result.success) {
        // Create verified user
        const verifiedUser = {
          id: Date.now().toString(),
          email,
          firstName,
          lastName,
          username: email.split('@')[0], // Use email prefix as username
          isEmailVerified: true,
          createdAt: new Date().toISOString()
        };

        // Save user and update auth state
        await storageService.saveUser(verifiedUser);
        dispatch(loginSuccess(verifiedUser));

        Alert.alert(
          '✅ Verification Successful!',
          'Your email has been verified successfully. Welcome to GoMate!',
          [
            {
              text: 'Continue',
              onPress: () => router.replace('/(tabs)')
            }
          ]
        );
      } else {
        Alert.alert('❌ Verification Failed', result.message);
        
        // Clear OTP inputs on failure
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error('Verification error:', error);
      Alert.alert('Error', 'An error occurred during verification. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      const result = await otpService.resendOTP(email, firstName, lastName);
      
      if (result.success) {
        Alert.alert(
          '✅ OTP Sent',
          `A new verification code has been sent to ${email}. Check your console for the code.`,
          [{ text: 'OK' }]
        );
        
        // Reset timer and state
        setTimeRemaining(300);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        
        // Display the new OTP in console
        if (result.otpCode) {
          console.log('🆕 NEW OTP CODE:', result.otpCode);
        }
      } else {
        Alert.alert('❌ Failed', result.message);
      }
    } catch (error) {
      console.error('Resend error:', error);
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Mail width={60} height={60} color="#007AFF" />
        </View>
        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit code to:
        </Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      <View style={styles.otpContainer}>
        <Text style={styles.otpLabel}>Enter 6-digit code</Text>
        <View style={styles.otpInputContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[
                styles.otpInput,
                digit ? styles.otpInputFilled : null
              ]}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
              selectTextOnFocus
            />
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.verifyButton, isVerifying && styles.disabledButton]}
        onPress={() => handleVerifyOTP()}
        disabled={isVerifying || otp.some(digit => digit === '')}
      >
        {isVerifying ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <CheckCircle width={20} height={20} color="white" />
            <Text style={styles.verifyButtonText}>Verify Code</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.timerContainer}>
        <Clock width={16} height={16} color="#666" />
        <Text style={styles.timerText}>
          {timeRemaining > 0 
            ? `Code expires in ${formatTime(timeRemaining)}`
            : 'Code has expired'
          }
        </Text>
      </View>

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn't receive the code?</Text>
        <TouchableOpacity
          style={[styles.resendButton, (!canResend || isResending) && styles.disabledButton]}
          onPress={handleResendOTP}
          disabled={!canResend || isResending}
        >
          {isResending ? (
            <ActivityIndicator color="#007AFF" size="small" />
          ) : (
            <>
              <RefreshCw width={16} height={16} color={canResend ? "#007AFF" : "#ccc"} />
              <Text style={[
                styles.resendButtonText, 
                !canResend && styles.disabledText
              ]}>
                Resend Code
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.changeEmailButton}
        onPress={() => router.back()}
      >
        <Text style={styles.changeEmailText}>Wrong email? Go back</Text>
      </TouchableOpacity>

      <View style={styles.demoInfo}>
        <Text style={styles.demoTitle}>🧪 Demo Information:</Text>
        <Text style={styles.demoText}>
          • Check browser console for the actual OTP code
        </Text>
        <Text style={styles.demoText}>
          • OTP expires in 5 minutes
        </Text>
        <Text style={styles.demoText}>
          • Maximum 3 attempts per code
        </Text>
        <Text style={styles.demoText}>
          • Auto-verification when 6 digits are entered
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
    marginBottom: 40,
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
  otpContainer: {
    marginBottom: 30,
  },
  otpLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: 'white',
  },
  otpInputFilled: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
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
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  timerText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resendText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resendButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  changeEmailButton: {
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
  },
  changeEmailText: {
    color: '#666',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  disabledButton: {
    opacity: 0.6,
  },
  disabledText: {
    color: '#ccc',
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