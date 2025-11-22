import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ArrowLeft, 
  Sun, 
  DollarSign, 
  Cloud,
  CloudRain,
  Sunrise,
  Wind,
  Eye,
  Droplet,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus
} from 'react-native-feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { RootState, AppDispatch } from '@/store';
import { 
  fetchWeatherStart,
  fetchWeatherSuccess,
  fetchCurrencyRatesStart,
  fetchCurrencyRatesSuccess,
  convertCurrency,
  addToFavorites,
  removeFromFavorites
} from '../store/slices/utilitiesSlice';
import { addNotification } from '@/store/slices/notificationsSlice';

export default function UtilitiesScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { colors } = useThemeColors();
  
  const { 
    weatherData, 
    isLoadingWeather, 
    currencyRates, 
    isLoadingCurrency,
    conversionResult,
    favorites
  } = useSelector((state: RootState) => state.utilities);
  
  const [activeTab, setActiveTab] = useState<'weather' | 'currency'>('weather');
  const [weatherLocation, setWeatherLocation] = useState('Jakarta');
  const [currencyAmount, setCurrencyAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('IDR');
  const [refreshing, setRefreshing] = useState(false);

  const handleFetchWeather = useCallback(async () => {
    dispatch(fetchWeatherStart());
    // Simulate API call with mock data
    const mockWeatherData = {
      location: weatherLocation,
      temperature: Math.floor(Math.random() * 15) + 20,
      condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)] as 'sunny' | 'cloudy' | 'rainy',
      humidity: Math.floor(Math.random() * 40) + 40,
      windSpeed: Math.floor(Math.random() * 20) + 5,
      visibility: Math.floor(Math.random() * 5) + 8,
      uvIndex: Math.floor(Math.random() * 8) + 1,
      sunrise: '06:30',
      sunset: '18:45',
      forecast: [
        { day: 'Today', high: 32, low: 24, condition: 'sunny' as 'sunny' | 'cloudy' | 'rainy' },
        { day: 'Tomorrow', high: 29, low: 22, condition: 'cloudy' as 'sunny' | 'cloudy' | 'rainy' },
        { day: 'Wed', high: 28, low: 21, condition: 'rainy' as 'sunny' | 'cloudy' | 'rainy' },
        { day: 'Thu', high: 31, low: 23, condition: 'sunny' as 'sunny' | 'cloudy' | 'rainy' },
        { day: 'Fri', high: 30, low: 22, condition: 'cloudy' as 'sunny' | 'cloudy' | 'rainy' },
      ],
      lastUpdated: new Date().toISOString(),
    };
    dispatch(fetchWeatherSuccess(mockWeatherData));
  }, [dispatch, weatherLocation]);

  const handleFetchCurrencyRates = useCallback(async () => {
    dispatch(fetchCurrencyRatesStart());
    const mockRates = {
      USD: { IDR: 15860, EUR: 0.85, GBP: 0.73, JPY: 149.5, SGD: 1.35, AUD: 1.53, CAD: 1.37, CHF: 0.88 },
      EUR: { USD: 1.18, IDR: 18714, GBP: 0.86, JPY: 176.3, SGD: 1.59, AUD: 1.80, CAD: 1.61, CHF: 1.04 },
      IDR: { USD: 0.000063, EUR: 0.000053, GBP: 0.000046, JPY: 0.0094, SGD: 0.000085, AUD: 0.000096, CAD: 0.000087, CHF: 0.000055 },
    };
    dispatch(fetchCurrencyRatesSuccess(mockRates));
  }, [dispatch]);

  useEffect(() => {
    // Load initial data
    handleFetchWeather();
    handleFetchCurrencyRates();
    
    dispatch(addNotification({
      title: 'Utilities Ready!',
      message: 'Check weather and convert currencies for your travels.',
      type: 'info',
    }));
  }, [dispatch, weatherLocation, handleFetchWeather, handleFetchCurrencyRates]);



  const handleConvertCurrency = () => {
    const amount = parseFloat(currencyAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to convert.');
      return;
    }

    if (fromCurrency === toCurrency) {
      Alert.alert('Same Currency', 'Please select different currencies to convert.');
      return;
    }

    dispatch(convertCurrency({
      amount,
      from: fromCurrency,
      to: toCurrency,
    }));

    dispatch(addNotification({
      title: 'Currency Converted!',
      message: `${amount} ${fromCurrency} converted to ${toCurrency}`,
      type: 'success',
    }));
  };

  const handleAddToFavorites = (type: 'weather' | 'currency', data: any) => {
    dispatch(addToFavorites({ type, data }));
    dispatch(addNotification({
      title: 'Added to Favorites!',
      message: `${type === 'weather' ? 'Weather location' : 'Currency pair'} saved to favorites.`,
      type: 'success',
    }));
  };



  const onRefresh = async () => {
    setRefreshing(true);
    if (activeTab === 'weather') {
      await handleFetchWeather();
    } else {
      await handleFetchCurrencyRates();
    }
    setRefreshing(false);
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun stroke={colors.warning} width={24} height={24} />;
      case 'cloudy':
        return <Cloud stroke={colors.textSecondary} width={24} height={24} />;
      case 'rainy':
        return <CloudRain stroke={colors.primary} width={24} height={24} />;
      default:
        return <Sun stroke={colors.warning} width={24} height={24} />;
    }
  };

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currency === 'IDR' ? 0 : 2,
      maximumFractionDigits: currency === 'IDR' ? 0 : 4,
    }).format(value);
  };

  const currencies = ['USD', 'EUR', 'IDR', 'GBP', 'JPY', 'SGD', 'AUD', 'CAD', 'CHF'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft stroke={colors.text} width={24} height={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Travel Utilities</Text>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={onRefresh}
          disabled={refreshing}
        >
          <RefreshCw 
            stroke={refreshing ? colors.textMuted : colors.primary} 
            width={24} 
            height={24} 
          />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'weather' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setActiveTab('weather')}
        >
          <Sun stroke={activeTab === 'weather' ? '#ffffff' : colors.textSecondary} width={20} height={20} />
          <Text style={[
            styles.tabText,
            { color: activeTab === 'weather' ? '#ffffff' : colors.textSecondary }
          ]}>
            Weather
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'currency' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setActiveTab('currency')}
        >
          <DollarSign stroke={activeTab === 'currency' ? '#ffffff' : colors.textSecondary} width={20} height={20} />
          <Text style={[
            styles.tabText,
            { color: activeTab === 'currency' ? '#ffffff' : colors.textSecondary }
          ]}>
            Currency
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {activeTab === 'weather' ? (
          <>
            {/* Weather Search */}
            <View style={[styles.searchSection, { backgroundColor: colors.surface }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Weather Forecast</Text>
              <View style={styles.searchRow}>
                <TextInput
                  style={[styles.searchInput, { 
                    backgroundColor: colors.inputBackground, 
                    color: colors.inputText,
                    borderColor: colors.inputBorder
                  }]}
                  placeholder="Enter location"
                  placeholderTextColor={colors.inputPlaceholder}
                  value={weatherLocation}
                  onChangeText={setWeatherLocation}
                />
                <TouchableOpacity
                  style={[styles.searchButton, { backgroundColor: colors.primary }]}
                  onPress={handleFetchWeather}
                  disabled={isLoadingWeather}
                >
                  <Text style={styles.searchButtonText}>
                    {isLoadingWeather ? 'Loading...' : 'Search'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Current Weather */}
            {weatherData && (
              <>
                <View style={[styles.weatherCard, { backgroundColor: colors.surface }]}>
                  <View style={styles.weatherHeader}>
                    <View>
                      <Text style={[styles.locationText, { color: colors.text }]}>
                        {weatherData.location}
                      </Text>
                      <Text style={[styles.temperatureText, { color: colors.text }]}>
                        {weatherData.temperature}°C
                      </Text>
                      <Text style={[styles.conditionText, { color: colors.textSecondary }]}>
                        {weatherData.condition ? 
                          weatherData.condition.charAt(0).toUpperCase() + weatherData.condition.slice(1) : 
                          'Unknown'
                        }
                      </Text>
                    </View>
                    <View style={styles.weatherIcon}>
                      {getWeatherIcon(weatherData.condition || 'sunny')}
                      <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={() => handleAddToFavorites('weather', { location: weatherData.location })}
                      >
                        <Text style={[styles.favoriteText, { color: colors.primary }]}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.weatherDetails}>
                    <View style={styles.weatherDetailItem}>
                      <Droplet stroke={colors.primary} width={16} height={16} />
                      <Text style={[styles.weatherDetailText, { color: colors.textSecondary }]}>
                        {weatherData.humidity}%
                      </Text>
                    </View>
                    <View style={styles.weatherDetailItem}>
                      <Wind stroke={colors.textMuted} width={16} height={16} />
                      <Text style={[styles.weatherDetailText, { color: colors.textSecondary }]}>
                        {weatherData.windSpeed} km/h
                      </Text>
                    </View>
                    <View style={styles.weatherDetailItem}>
                      <Eye stroke={colors.textMuted} width={16} height={16} />
                      <Text style={[styles.weatherDetailText, { color: colors.textSecondary }]}>
                        {weatherData.visibility} km
                      </Text>
                    </View>
                    <View style={styles.weatherDetailItem}>
                      <Sunrise stroke={colors.warning} width={16} height={16} />
                      <Text style={[styles.weatherDetailText, { color: colors.textSecondary }]}>
                        {weatherData.sunrise}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* 5-Day Forecast */}
                <View style={[styles.forecastSection, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>5-Day Forecast</Text>
                  {weatherData.forecast && weatherData.forecast.map((day, index) => (
                    <View key={index} style={styles.forecastItem}>
                      <Text style={[styles.forecastDay, { color: colors.text }]}>{day.day || 'Unknown'}</Text>
                      <View style={styles.forecastWeather}>
                        {getWeatherIcon(day.condition || 'sunny')}
                        <Text style={[styles.forecastCondition, { color: colors.textSecondary }]}>
                          {day.condition || 'Unknown'}
                        </Text>
                      </View>
                      <View style={styles.forecastTemps}>
                        <Text style={[styles.forecastHigh, { color: colors.text }]}>{day.high || 0}°</Text>
                        <Text style={[styles.forecastLow, { color: colors.textMuted }]}>{day.low || 0}°</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </>
            )}
          </>
        ) : (
          <>
            {/* Currency Converter */}
            <View style={[styles.currencySection, { backgroundColor: colors.surface }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Currency Converter</Text>
              
              <View style={styles.conversionRow}>
                <View style={styles.currencyInput}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Amount</Text>
                  <TextInput
                    style={[styles.amountInput, { 
                      backgroundColor: colors.inputBackground, 
                      color: colors.inputText,
                      borderColor: colors.inputBorder
                    }]}
                    placeholder="Enter amount"
                    placeholderTextColor={colors.inputPlaceholder}
                    value={currencyAmount}
                    onChangeText={setCurrencyAmount}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.currencySelectors}>
                <View style={styles.currencySelector}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>From</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.currencyOptions}>
                      {currencies.map((currency) => (
                        <TouchableOpacity
                          key={currency}
                          style={[
                            styles.currencyOption,
                            { 
                              backgroundColor: fromCurrency === currency ? colors.primary : colors.card,
                              borderColor: fromCurrency === currency ? colors.primary : colors.border,
                            }
                          ]}
                          onPress={() => setFromCurrency(currency)}
                        >
                          <Text style={[
                            styles.currencyOptionText,
                            { color: fromCurrency === currency ? '#ffffff' : colors.text }
                          ]}>
                            {currency}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                <View style={styles.currencySelector}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>To</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.currencyOptions}>
                      {currencies.map((currency) => (
                        <TouchableOpacity
                          key={currency}
                          style={[
                            styles.currencyOption,
                            { 
                              backgroundColor: toCurrency === currency ? colors.primary : colors.card,
                              borderColor: toCurrency === currency ? colors.primary : colors.border,
                            }
                          ]}
                          onPress={() => setToCurrency(currency)}
                        >
                          <Text style={[
                            styles.currencyOptionText,
                            { color: toCurrency === currency ? '#ffffff' : colors.text }
                          ]}>
                            {currency}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.convertButton, { backgroundColor: colors.primary }]}
                onPress={handleConvertCurrency}
                disabled={isLoadingCurrency}
              >
                <Text style={styles.convertButtonText}>
                  {isLoadingCurrency ? 'Converting...' : 'Convert'}
                </Text>
              </TouchableOpacity>

              {/* Conversion Result */}
              {conversionResult && (
                <View style={[styles.resultCard, { backgroundColor: colors.card }]}>
                  <Text style={[styles.sectionTitle, { color: colors.text, fontSize: 16 }]}>
                    {formatCurrency(conversionResult.amount, conversionResult.from)} =
                  </Text>
                  <Text style={[styles.sectionTitle, { color: colors.primary, fontWeight: 'bold', fontSize: 18 }]}>
                    {formatCurrency(conversionResult.result, conversionResult.to)}
                  </Text>
                  <Text style={[styles.resultRate, { color: colors.textSecondary }]}>
                    1 {conversionResult.from} = {conversionResult.rate.toFixed(4)} {conversionResult.to}
                  </Text>
                  <TouchableOpacity
                    style={styles.savePairButton}
                    onPress={() => handleAddToFavorites('currency', {
                      from: conversionResult.from,
                      to: conversionResult.to,
                    })}
                  >
                    <Text style={[styles.savePairText, { color: colors.primary }]}>Save Pair</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Exchange Rates */}
            {currencyRates && (
              <View style={[styles.ratesSection, { backgroundColor: colors.surface }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Exchange Rates</Text>
                <Text style={[styles.ratesSubtitle, { color: colors.textSecondary }]}>
                  Base: {fromCurrency}
                </Text>
                
                {currencyRates[fromCurrency] && Object.entries(currencyRates[fromCurrency]).map(([currency, rate]) => (
                  <View key={currency} style={styles.rateItem}>
                    <View style={styles.rateInfo}>
                      <Text style={[styles.rateCurrency, { color: colors.text }]}>{currency}</Text>
                      <Text style={[styles.rateValue, { color: colors.textSecondary }]}>
                        {typeof rate === 'number' ? rate.toFixed(4) : rate}
                      </Text>
                    </View>
                    <View style={styles.rateTrend}>
                      {Math.random() > 0.5 ? (
                        <TrendingUp stroke={colors.success} width={16} height={16} />
                      ) : (
                        <TrendingDown stroke={colors.error} width={16} height={16} />
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        )}

        {/* Favorites */}
        {favorites.length > 0 && (
          <View style={[styles.favoritesSection, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Favorites</Text>
            {favorites.map((favorite, index) => (
              <View key={index} style={[styles.favoriteItem, { borderColor: colors.border }]}>
                <Text style={[styles.favoriteType, { color: colors.primary }]}>
                  {favorite.type.toUpperCase()}
                </Text>
                <Text style={[styles.favoriteData, { color: colors.text }]}>
                  {JSON.stringify(favorite.data)}
                </Text>
                <TouchableOpacity
                  onPress={() => dispatch(removeFromFavorites(index.toString()))}
                >
                  <Minus stroke={colors.error} width={16} height={16} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
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
  refreshButton: {
    padding: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 25,
    gap: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  searchSection: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  searchButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  weatherCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  temperatureText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  conditionText: {
    fontSize: 16,
  },
  weatherIcon: {
    alignItems: 'center',
  },
  favoriteButton: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  favoriteText: {
    fontSize: 12,
    fontWeight: '600',
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weatherDetailItem: {
    alignItems: 'center',
    gap: 4,
  },
  weatherDetailText: {
    fontSize: 12,
  },
  forecastSection: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
  },
  forecastItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  forecastDay: {
    width: 80,
    fontSize: 14,
    fontWeight: '600',
  },
  forecastWeather: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  forecastCondition: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  forecastTemps: {
    flexDirection: 'row',
    gap: 8,
  },
  forecastHigh: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  forecastLow: {
    fontSize: 14,
  },
  currencySection: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  conversionRow: {
    marginBottom: 20,
  },
  currencyInput: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  amountInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  currencySelectors: {
    marginBottom: 20,
  },
  currencySelector: {
    marginBottom: 16,
  },
  currencyOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  currencyOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  currencyOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  convertButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  convertButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultCard: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 14,
    marginBottom: 8,
  },
  resultAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultRate: {
    fontSize: 12,
    marginBottom: 12,
  },
  savePairButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  savePairText: {
    fontSize: 12,
    fontWeight: '600',
  },
  ratesSection: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
  },
  ratesSubtitle: {
    fontSize: 12,
    marginBottom: 16,
  },
  rateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rateInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rateCurrency: {
    fontSize: 14,
    fontWeight: '600',
  },
  rateValue: {
    fontSize: 14,
  },
  rateTrend: {
    marginLeft: 12,
  },
  favoritesSection: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  favoriteType: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 12,
    minWidth: 80,
  },
  favoriteData: {
    flex: 1,
    fontSize: 12,
  },
});