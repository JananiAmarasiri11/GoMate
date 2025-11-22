import axios from 'axios';

const API_BASE_URL = 'https://dummyjson.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Mock travel data based on countries API and custom data
export const mockTravelData = [
  {
    id: '1',
    name: 'Tokyo, Japan',
    description: 'Experience the bustling metropolis with ancient traditions',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop&auto=format&q=80',
    status: 'Popular' as const,
    category: 'destination' as const,
    price: '$1,200',
    rating: 4.8,
    country: 'Japan'
  },
  {
    id: '2',
    name: 'Paris, France',
    description: 'City of lights and romance, perfect for couples',
    image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop&auto=format&q=80',
    status: 'Featured' as const,
    category: 'destination' as const,
    price: '$980',
    rating: 4.7,
    country: 'France'
  },
  {
    id: '3',
    name: 'Bali, Indonesia',
    description: 'Tropical paradise with beautiful beaches and temples',
    image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop&auto=format&q=80',
    status: 'Featured' as const,
    category: 'destination' as const,
    price: '$850',
    rating: 4.6,
    country: 'Indonesia'
  },
  {
    id: '10',
    name: 'Ubud, Bali',
    description: 'Tropical paradise with stunning beaches and culture',
    image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop&auto=format&q=80',
    status: 'Trending' as const,
    category: 'destination' as const,
    price: '$750',
    rating: 4.6,
    country: 'Indonesia'
  },
  {
    id: '4',
    name: 'New York City Bus Tours',
    description: 'Hop-on hop-off bus tours around Manhattan',
    image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400&h=300&fit=crop&auto=format&q=80',
    status: 'Popular' as const,
    category: 'transport' as const,
    price: '$45',
    rating: 4.2,
    country: 'USA'
  },
  {
    id: '5',
    name: 'London Underground Pass',
    description: 'Unlimited travel on London\'s tube system',
    image: 'https://images.unsplash.com/photo-1520637836862-4d197d17c55a?w=400&h=300&fit=crop&auto=format&q=80',
    status: 'Featured' as const,
    category: 'transport' as const,
    price: '$35',
    rating: 4.4,
    country: 'United Kingdom'
  },
  {
    id: '6',
    name: 'Santorini, Greece',
    description: 'Beautiful Greek island with white-washed buildings',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop&auto=format&q=80',
    status: 'New' as const,
    category: 'destination' as const,
    price: '$890',
    rating: 4.9,
    country: 'Greece'
  },
  {
    id: '7',
    name: 'Swiss Rail Pass',
    description: 'Explore Switzerland by train with unlimited travel',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop&auto=format&q=80',
    status: 'Popular' as const,
    category: 'transport' as const,
    price: '$280',
    rating: 4.8,
    country: 'Switzerland'
  },
  {
    id: '8',
    name: 'London, UK',
    description: 'Historic city with royal palaces and iconic landmarks',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop&auto=format&q=80',
    status: 'Popular' as const,
    category: 'destination' as const,
    price: '$950',
    rating: 4.6,
    country: 'United Kingdom'
  },
  {
    id: '9',
    name: 'Dubai, UAE',
    description: 'Modern city with luxury shopping and stunning architecture',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop&auto=format&q=80',
    status: 'Featured' as const,
    category: 'destination' as const,
    price: '$1,100',
    rating: 4.5,
    country: 'UAE'
  }
];

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
}

export const authService = {
  login: async (credentials: LoginCredentials) => {
    try {
      // Using DummyJSON auth endpoint
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw new Error('Login failed. Please check your credentials.');
    }
  },

  register: async (credentials: RegisterCredentials) => {
    try {
      // Mock registration - in real app would call actual API
      const mockUser = {
        id: Date.now().toString(),
        username: credentials.username,
        email: credentials.email,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return mockUser;
    } catch (error) {
      throw new Error('Registration failed. Please try again.');
    }
  },
};

export const destinationsService = {
  getDestinations: async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockTravelData;
    } catch (error) {
      throw new Error('Failed to fetch destinations');
    }
  },

  getDestinationById: async (id: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const destination = mockTravelData.find(item => item.id === id);
      if (!destination) {
        throw new Error('Destination not found');
      }
      return destination;
    } catch (error) {
      throw new Error('Failed to fetch destination details');
    }
  },
};