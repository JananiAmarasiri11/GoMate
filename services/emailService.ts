/**
 * Email Verification Service
 * Handles email verification functionality for user registration
 */

interface EmailVerificationData {
  email: string;
  verificationToken: string;
  firstName: string;
  lastName: string;
}

interface VerificationResult {
  success: boolean;
  message: string;
}

class EmailService {
  private baseUrl = 'http://localhost:3001/api'; // Your backend URL
  
  /**
   * Send verification email to user
   */
  async sendVerificationEmail(data: EmailVerificationData): Promise<VerificationResult> {
    try {
      // In a real app, this would call your backend API
      console.log('📧 Sending verification email...');
      console.log('To:', data.email);
      console.log('Token:', data.verificationToken);
      
      // Simulate API call
      const response = await this.simulateEmailSend(data);
      
      if (response.success) {
        console.log('✅ Verification email sent successfully');
        return {
          success: true,
          message: 'Verification email sent successfully!'
        };
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      return {
        success: false,
        message: 'Failed to send verification email. Please try again.'
      };
    }
  }

  /**
   * Verify email token
   */
  async verifyEmail(token: string): Promise<VerificationResult> {
    try {
      console.log('🔍 Verifying email token:', token);
      
      // In a real app, this would validate the token with your backend
      const isValid = await this.simulateTokenVerification(token);
      
      if (isValid) {
        console.log('✅ Email verified successfully');
        return {
          success: true,
          message: 'Email verified successfully! Your account is now active.'
        };
      } else {
        return {
          success: false,
          message: 'Invalid or expired verification token.'
        };
      }
    } catch (error) {
      console.error('❌ Email verification failed:', error);
      return {
        success: false,
        message: 'Email verification failed. Please try again.'
      };
    }
  }

  /**
   * Resend verification email
   */
  async resendVerificationEmail(email: string): Promise<VerificationResult> {
    try {
      // Generate new token
      const newToken = Math.random().toString(36).substring(2, 15);
      
      console.log('🔄 Resending verification email to:', email);
      console.log('New token:', newToken);
      
      // Simulate resending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: 'Verification email has been resent!'
      };
    } catch (error) {
      console.error('❌ Failed to resend email:', error);
      return {
        success: false,
        message: 'Failed to resend email. Please try again.'
      };
    }
  }

  /**
   * Check if email is verified
   */
  async checkEmailVerificationStatus(email: string): Promise<boolean> {
    try {
      // In a real app, check with your backend
      console.log('🔍 Checking verification status for:', email);
      
      // For demo, return random status
      const isVerified = Math.random() > 0.5;
      console.log('Status:', isVerified ? 'Verified' : 'Not verified');
      
      return isVerified;
    } catch (error) {
      console.error('❌ Failed to check verification status:', error);
      return false;
    }
  }

  // DEMO/SIMULATION METHODS
  private async simulateEmailSend(data: EmailVerificationData): Promise<{ success: boolean }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate email template
    const emailTemplate = `
    📧 EMAIL VERIFICATION (DEMO)
    ============================
    
    Hi ${data.firstName} ${data.lastName}!
    
    Welcome to GoMate! Please verify your email address by clicking the link below:
    
    🔗 Verification Link: 
    http://localhost:8086/verify-email?token=${data.verificationToken}
    
    Or copy and paste this verification code: ${data.verificationToken}
    
    This link will expire in 24 hours.
    
    If you didn't create this account, please ignore this email.
    
    Best regards,
    The GoMate Team
    ============================
    `;
    
    console.log(emailTemplate);
    
    // Simulate 95% success rate
    return { success: Math.random() > 0.05 };
  }

  private async simulateTokenVerification(token: string): Promise<boolean> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo, tokens starting with 'a' or containing '123' are valid
    return token.startsWith('a') || token.includes('123') || token.length > 10;
  }
}

export const emailService = new EmailService();
export default emailService;