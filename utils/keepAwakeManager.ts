import * as KeepAwake from 'expo-keep-awake';
import { Platform } from 'react-native';

/**
 * Safely handles keep-awake functionality with proper error handling
 */
export class KeepAwakeManager {
  private static isInitialized = false;

  /**
   * Initialize keep-awake with proper error handling
   */
  static initialize() {
    if (this.isInitialized) return;

    try {
      // Only initialize on native platforms
      if (Platform.OS !== 'web') {
        // Don't deactivate on initialization to avoid the error
        this.isInitialized = true;
        console.log('KeepAwake initialized successfully');
      } else {
        // On web, just mark as initialized without doing anything
        this.isInitialized = true;
        console.log('KeepAwake skipped for web platform');
      }
    } catch (error) {
      console.warn('KeepAwake initialization failed:', error);
      // Continue without keep-awake functionality
      this.isInitialized = true;
    }
  }

  /**
   * Safely activate keep-awake
   */
  static activate() {
    try {
      if (Platform.OS !== 'web') {
        KeepAwake.activateKeepAwake();
        console.log('Keep-awake activated');
      }
    } catch (error) {
      console.warn('Failed to activate keep-awake:', error);
    }
  }

  /**
   * Safely deactivate keep-awake
   */
  static deactivate() {
    try {
      if (Platform.OS !== 'web') {
        KeepAwake.deactivateKeepAwake();
        console.log('Keep-awake deactivated');
      }
    } catch (error) {
      console.warn('Failed to deactivate keep-awake:', error);
    }
  }

  /**
   * Check if keep-awake functionality is available
   */
  static isSupported(): boolean {
    return Platform.OS !== 'web' && KeepAwake !== undefined;
  }
}