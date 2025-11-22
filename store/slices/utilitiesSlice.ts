import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WeatherData {
  location: string;
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy';
  humidity: number;
  windSpeed: number;
  visibility: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  forecast: DayForecast[];
  lastUpdated: string;
}

export interface DayForecast {
  day: string;
  high: number;
  low: number;
  condition: 'sunny' | 'cloudy' | 'rainy';
}

export interface CurrencyRates {
  [key: string]: {
    [key: string]: number;
  };
  lastUpdated?: string;
}

export interface ConversionResult {
  amount: number;
  from: string;
  to: string;
  result: number;
  rate: number;
}

export interface FavoriteItem {
  type: 'weather' | 'currency';
  data: any;
  id: string;
  addedAt: string;
}

interface UtilitiesState {
  weatherData: WeatherData | null;
  isLoadingWeather: boolean;
  weatherError: string | null;
  currencyRates: CurrencyRates;
  isLoadingCurrency: boolean;
  currencyError: string | null;
  conversionResult: ConversionResult | null;
  favorites: FavoriteItem[];
  lastUpdated: string | null;
  isLoading: boolean;
  error: string | null;
  selectedCurrency: string;
  searchFilters: SearchFilters;
  recentSearches: RecentSearch[];
  savedSearches: SavedSearch[];
}

const initialState: UtilitiesState = {
  weatherData: null,
  isLoadingWeather: false,
  weatherError: null,
  currencyRates: {},
  isLoadingCurrency: false,
  currencyError: null,
  conversionResult: null,
  favorites: [],
};

const utilitiesSlice = createSlice({
  name: 'utilities',
  initialState,
  reducers: {
    // Weather actions
    fetchWeatherStart: (state) => {
      state.isLoadingWeather = true;
      state.weatherError = null;
    },
    fetchWeatherSuccess: (state, action: PayloadAction<WeatherData>) => {
      state.isLoadingWeather = false;
      state.weatherData = action.payload;
    },
    fetchWeatherFailure: (state, action: PayloadAction<string>) => {
      state.isLoadingWeather = false;
      state.weatherError = action.payload;
    },
    
    // Currency actions
    fetchCurrencyRatesStart: (state) => {
      state.isLoadingCurrency = true;
      state.currencyError = null;
    },
    fetchCurrencyRatesSuccess: (state, action: PayloadAction<CurrencyRates>) => {
      state.isLoadingCurrency = false;
      state.currencyRates = action.payload;
    },
    fetchCurrencyRatesFailure: (state, action: PayloadAction<string>) => {
      state.isLoadingCurrency = false;
      state.currencyError = action.payload;
    },
    
    convertCurrency: (state, action: PayloadAction<{ amount: number; from: string; to: string }>) => {
      const { amount, from, to } = action.payload;
      const rates = state.currencyRates[from];
      if (rates && rates[to]) {
        const rate = rates[to];
        state.conversionResult = {
          amount,
          from,
          to,
          result: amount * rate,
          rate,
        };
      }
    },
    
    addToFavorites: (state, action: PayloadAction<{ type: 'weather' | 'currency'; data: any }>) => {
      const { type, data } = action.payload;
      const newFavorite: FavoriteItem = {
        id: Date.now().toString(),
        type,
        data,
        addedAt: new Date().toISOString(),
      };
      state.favorites.push(newFavorite);
    },
    
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(fav => fav.id !== action.payload);
    },
  },
});

export const {
  fetchWeatherStart,
  fetchWeatherSuccess,
  fetchWeatherFailure,
  fetchCurrencyRatesStart,
  fetchCurrencyRatesSuccess,
  fetchCurrencyRatesFailure,
  convertCurrency,
  addToFavorites,
  removeFromFavorites,
} = utilitiesSlice.actions;

export default utilitiesSlice.reducer;