/**
 * OTP Email Service
 * Simulates sending OTP codes via email for verification
 */

interface OTPData {
  email: string;
  firstName: string;
  lastName: string;
}

interface OTPVerificationResult {
  success: boolean;
  message: string;
}

interface OTPResponse {
  success: boolean;
  message: string;
  otpCode?: string; // For demo purposes only
}

class OTPService {
  private otpStorage: Map<string, { code: string; expiresAt: number; attempts: number }> = new Map();
  private readonly OTP_EXPIRY_MINUTES = 5;
  private readonly MAX_ATTEMPTS = 3;

  /**
   * Generate a 6-digit OTP code
   */
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send OTP to user's email
   */
  async sendOTP(data: OTPData): Promise<OTPResponse> {
    try {
      const otpCode = this.generateOTP();
      const expiresAt = Date.now() + (this.OTP_EXPIRY_MINUTES * 60 * 1000);

      // Store OTP with expiry and attempt tracking
      this.otpStorage.set(data.email, {
        code: otpCode,
        expiresAt,
        attempts: 0
      });

      console.log('📧 SENDING OTP EMAIL (DEMO)');
      console.log('============================');
      console.log(`To: ${data.email}`);
      console.log(`Subject: Your GoMate Verification Code`);
      console.log('');
      console.log(`Hi ${data.firstName} ${data.lastName}!`);
      console.log('');
      console.log(`Your verification code is: ${otpCode}`);
      console.log('');
      console.log(`This code will expire in ${this.OTP_EXPIRY_MINUTES} minutes.`);
      console.log(`For security, don't share this code with anyone.`);
      console.log('');
      console.log('If you didn\'t request this code, please ignore this email.');
      console.log('');
      console.log('Best regards,');
      console.log('The GoMate Team');
      console.log('============================');

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      return {
        success: true,
        message: `OTP sent successfully to ${data.email}`,
        otpCode // Only for demo - remove in production
      };

    } catch (error) {
      console.error('❌ Failed to send OTP:', error);
      return {
        success: false,
        message: 'Failed to send OTP. Please try again.'
      };
    }
  }

  /**
   * Verify OTP code
   */
  async verifyOTP(email: string, enteredCode: string): Promise<OTPVerificationResult> {
    try {
      const otpData = this.otpStorage.get(email);

      if (!otpData) {
        return {
          success: false,
          message: 'No OTP found. Please request a new code.'
        };
      }

      // Check if OTP has expired
      if (Date.now() > otpData.expiresAt) {
        this.otpStorage.delete(email);
        return {
          success: false,
          message: 'OTP has expired. Please request a new code.'
        };
      }

      // Check if maximum attempts exceeded
      if (otpData.attempts >= this.MAX_ATTEMPTS) {
        this.otpStorage.delete(email);
        return {
          success: false,
          message: 'Too many incorrect attempts. Please request a new code.'
        };
      }

      // Increment attempt counter
      otpData.attempts++;

      // Verify the code
      if (enteredCode === otpData.code) {
        // Success - remove OTP from storage
        this.otpStorage.delete(email);
        console.log('✅ OTP verified successfully for:', email);
        
        return {
          success: true,
          message: 'Email verified successfully!'
        };
      } else {
        // Update storage with incremented attempts
        this.otpStorage.set(email, otpData);
        
        const remainingAttempts = this.MAX_ATTEMPTS - otpData.attempts;
        return {
          success: false,
          message: remainingAttempts > 0 
            ? `Incorrect code. ${remainingAttempts} attempts remaining.`
            : 'Incorrect code. Maximum attempts reached.'
        };
      }

    } catch (error) {
      console.error('❌ OTP verification failed:', error);
      return {
        success: false,
        message: 'Verification failed. Please try again.'
      };
    }
  }

  /**
   * Resend OTP
   */
  async resendOTP(email: string, firstName: string, lastName: string): Promise<OTPResponse> {
    // Clear existing OTP
    this.otpStorage.delete(email);
    
    // Send new OTP
    return this.sendOTP({ email, firstName, lastName });
  }

  /**
   * Check if OTP is still valid (not expired)
   */
  isOTPValid(email: string): boolean {
    const otpData = this.otpStorage.get(email);
    if (!otpData) return false;
    
    return Date.now() <= otpData.expiresAt;
  }

  /**
   * Get remaining time for OTP expiry (in seconds)
   */
  getRemainingTime(email: string): number {
    const otpData = this.otpStorage.get(email);
    if (!otpData) return 0;
    
    const remaining = Math.max(0, otpData.expiresAt - Date.now());
    return Math.floor(remaining / 1000);
  }

  /**
   * Get remaining attempts
   */
  getRemainingAttempts(email: string): number {
    const otpData = this.otpStorage.get(email);
    if (!otpData) return 0;
    
    return Math.max(0, this.MAX_ATTEMPTS - otpData.attempts);
  }

  /**
   * Clear OTP for email (cleanup)
   */
  clearOTP(email: string): void {
    this.otpStorage.delete(email);
  }
}

export const otpService = new OTPService();
export default otpService;