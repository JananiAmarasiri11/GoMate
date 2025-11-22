import { useThemeColors } from '@/hooks/use-theme-colors';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { ArrowLeft, Calendar, Clock, CreditCard, MapPin } from 'react-native-feather';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookingScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useThemeColors();
  const [selectedTransport, setSelectedTransport] = useState('');

  // Debug mobile theme changes
  useEffect(() => {
    console.log('Booking screen theme update:', { isDarkMode, backgroundColor: colors.background });
  }, [isDarkMode, colors.background]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const transportOptions = [
    { id: 'bus', name: 'Bus', price: '$25', duration: '2h 30m', icon: '🚌' },
    { id: 'train', name: 'Train', price: '$45', duration: '1h 45m', icon: '🚆' },
    { id: 'flight', name: 'Flight', price: '$120', duration: '45m', icon: '✈️' },
    { id: 'taxi', name: 'Taxi', price: '$60', duration: '1h 15m', icon: '🚖' },
  ];

  const handleBooking = () => {
    if (!selectedTransport || !from || !to || !date || !time) {
      Alert.alert('Incomplete Information', 'Please fill in all required fields.');
      return;
    }

    Alert.alert(
      'Booking Confirmed!',
      `Your ${transportOptions.find(t => t.id === selectedTransport)?.name} booking from ${from} to ${to} has been confirmed.`,
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <SafeAreaView 
      key={`booking-${isDarkMode}`} 
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft stroke={colors.text} width={24} height={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Book Transport</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={[styles.scrollView, { backgroundColor: colors.background }]}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Transport</Text>
          <View style={styles.transportGrid}>
            {transportOptions.map((transport) => (
              <TouchableOpacity
                key={transport.id}
                style={[
                  styles.transportCard,
                  { 
                    backgroundColor: selectedTransport === transport.id ? colors.primary : colors.card,
                    borderColor: selectedTransport === transport.id ? colors.primary : colors.border,
                  }
                ]}
                onPress={() => setSelectedTransport(transport.id)}
              >
                <Text style={styles.transportIcon}>{transport.icon}</Text>
                <Text style={[
                  styles.transportName,
                  { 
                    color: selectedTransport === transport.id ? '#ffffff' : colors.text
                  }
                ]}>
                  {transport.name}
                </Text>
                <Text style={[
                  styles.transportPrice,
                  { 
                    color: selectedTransport === transport.id ? '#ffffff' : colors.textSecondary
                  }
                ]}>
                  {transport.price}
                </Text>
                <Text style={[
                  styles.transportDuration,
                  { 
                    color: selectedTransport === transport.id ? '#ffffff' : colors.textMuted
                  }
                ]}>
                  {transport.duration}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Journey Details</Text>
          
          <View style={styles.inputGroup}>
            <View style={[styles.inputContainer, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, borderWidth: 1 }]}>
              <MapPin stroke={colors.textMuted} width={20} height={20} />
              <TextInput
                style={[styles.input, { color: colors.inputText }]}
                placeholder="From"
                placeholderTextColor={colors.inputPlaceholder}
                value={from}
                onChangeText={setFrom}
              />
            </View>
            
            <View style={[styles.inputContainer, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, borderWidth: 1 }]}>
              <MapPin stroke={colors.textMuted} width={20} height={20} />
              <TextInput
                style={[styles.input, { color: colors.inputText }]}
                placeholder="To"
                placeholderTextColor={colors.inputPlaceholder}
                value={to}
                onChangeText={setTo}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={[styles.inputContainer, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, borderWidth: 1 }]}>
              <Calendar stroke={colors.textMuted} width={20} height={20} />
              <TextInput
                style={[styles.input, { color: colors.inputText }]}
                placeholder="Date (DD/MM/YYYY)"
                placeholderTextColor={colors.inputPlaceholder}
                value={date}
                onChangeText={setDate}
              />
            </View>
            
            <View style={[styles.inputContainer, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, borderWidth: 1 }]}>
              <Clock stroke={colors.textMuted} width={20} height={20} />
              <TextInput
                style={[styles.input, { color: colors.inputText }]}
                placeholder="Time (HH:MM)"
                placeholderTextColor={colors.inputPlaceholder}
                value={time}
                onChangeText={setTime}
              />
            </View>
          </View>
        </View>

        {selectedTransport && (
          <View style={[styles.summarySection, { backgroundColor: colors.surface }]}>
            <Text style={[styles.summaryTitle, { color: colors.text }]}>Booking Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Transport:</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {transportOptions.find(t => t.id === selectedTransport)?.name}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Price:</Text>
              <Text style={[styles.summaryValue, { color: colors.primary }]}>
                {transportOptions.find(t => t.id === selectedTransport)?.price}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Duration:</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {transportOptions.find(t => t.id === selectedTransport)?.duration}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.bookButton, { backgroundColor: colors.primary }]}
          onPress={handleBooking}
        >
          <CreditCard stroke="#ffffff" width={20} height={20} />
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 34,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  transportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  transportCard: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  transportIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  transportName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  transportPrice: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  transportDuration: {
    fontSize: 12,
  },
  inputGroup: {
    gap: 15,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  summarySection: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});