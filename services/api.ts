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
    } catch {
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
    } catch {
      throw new Error('Registration failed. Please try again.');
    }
  },
};

export const destinationsService = {
  getDestinations: async () => {
    try {
      // Fetch user data from DummyJSON API (we'll use users as travelers/destinations)
      const response = await api.get('/users?limit=30');
      const users = response.data.users;
      
      // Enhanced travel destinations based on real cities with API data
      const travelDestinations = [
        { city: 'Tokyo', country: 'Japan', price: 1200, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop' },
        { city: 'Paris', country: 'France', price: 980, image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop' },
        { city: 'Bali', country: 'Indonesia', price: 850, image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop' },
        { city: 'New York', country: 'USA', price: 1100, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop' },
        { city: 'London', country: 'UK', price: 950, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop' },
        { city: 'Dubai', country: 'UAE', price: 1050, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop' },
        { city: 'Rome', country: 'Italy', price: 890, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop' },
        { city: 'Barcelona', country: 'Spain', price: 870, image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&h=300&fit=crop' },
        { city: 'Singapore', country: 'Singapore', price: 920, image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop' },
        { city: 'Sydney', country: 'Australia', price: 1300, image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&h=300&fit=crop' },
        { city: 'Amsterdam', country: 'Netherlands', price: 880, image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&h=300&fit=crop' },
        { city: 'Bangkok', country: 'Thailand', price: 750, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&h=300&fit=crop' },
        { city: 'Santorini', country: 'Greece', price: 990, image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop' },
        { city: 'Prague', country: 'Czech Republic', price: 780, image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=400&h=300&fit=crop' },
        { city: 'Istanbul', country: 'Turkey', price: 820, image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&h=300&fit=crop' },
      ];
      
      const transportOptions = [
        { name: 'Airport Transfer', type: 'Car Rental', price: 45, image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop' },
        { name: 'City Bus Pass', type: 'Public Transport', price: 25, image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400&h=300&fit=crop' },
        { name: 'Train Ticket', type: 'Rail Service', price: 65, image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop' },
        { name: 'Metro Pass', type: 'Underground', price: 35, image: 'https://images.unsplash.com/photo-1520637836862-4d197d17c55a?w=400&h=300&fit=crop' },
        { name: 'Ferry Service', type: 'Water Transport', price: 40, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop' },
      ];
      
      // Combine API data with travel data for dynamic content
      const destinations = users.slice(0, 15).map((user: any, index: number) => {
        const destination = travelDestinations[index % travelDestinations.length];
        const rating = 4.0 + (user.id % 10) / 10; // Generate rating between 4.0 and 4.9
        
        let status: 'Popular' | 'Featured' | 'Trending' | 'New' = 'Popular';
        if (rating >= 4.7) status = 'Featured';
        else if (rating >= 4.5) status = 'Trending';
        else if (user.id > 25) status = 'New';
        
        return {
          id: user.id.toString(),
          name: `${destination.city}, ${destination.country}`,
          description: `Experience the beauty and culture of ${destination.city}. Perfect destination for travelers seeking adventure and memorable experiences.`,
          image: destination.image,
          status,
          category: 'destination' as const,
          price: `$${destination.price}`,
          rating: parseFloat(rating.toFixed(1)),
          country: destination.country
        };
      });
      
      // Add transport options
      const transports = users.slice(15, 20).map((user: any, index: number) => {
        const transport = transportOptions[index % transportOptions.length];
        const rating = 4.0 + (user.id % 10) / 10;
        
        return {
          id: user.id.toString(),
          name: transport.name,
          description: `Convenient ${transport.type.toLowerCase()} service for your travel needs. Book now for hassle-free transportation.`,
          image: transport.image,
          status: 'Popular' as const,
          category: 'transport' as const,
          price: `$${transport.price}`,
          rating: parseFloat(rating.toFixed(1)),
          country: 'International'
        };
      });
      
      // Combine and return
      return [...destinations, ...transports];
    } catch (error) {
      console.error('API Error:', error);
      // Fallback to mock data if API fails
      return mockTravelData;
    }
  },

  getDestinationById: async (id: string) => {
    try {
      // Fetch specific user from DummyJSON
      const response = await api.get(`/users/${id}`);
      const user = response.data;
      
      // Map to travel destination
      const travelDestinations = [
        { city: 'Tokyo', country: 'Japan', price: 1200, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop' },
        { city: 'Paris', country: 'France', price: 980, image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop' },
        { city: 'Bali', country: 'Indonesia', price: 850, image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop' },
        { city: 'New York', country: 'USA', price: 1100, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop' },
        { city: 'London', country: 'UK', price: 950, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop' },
      ];
      
      const transportOptions = [
        { name: 'Airport Transfer', type: 'Car Rental', price: 45, image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop' },
        { name: 'City Bus Pass', type: 'Public Transport', price: 25, image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400&h=300&fit=crop' },
      ];
      
      const isTransport = user.id > 15;
      const rating = 4.0 + (user.id % 10) / 10;
      let status: 'Popular' | 'Featured' | 'Trending' | 'New' = 'Popular';
      if (rating >= 4.7) status = 'Featured';
      else if (rating >= 4.5) status = 'Trending';
      
      if (isTransport) {
        const transport = transportOptions[user.id % transportOptions.length];
        return {
          id: user.id.toString(),
          name: transport.name,
          description: `Convenient ${transport.type.toLowerCase()} service for your travel needs. Book now for hassle-free transportation.`,
          image: transport.image,
          status,
          category: 'transport' as const,
          price: `$${transport.price}`,
          rating: parseFloat(rating.toFixed(1)),
          country: 'International'
        };
      } else {
        const destination = travelDestinations[user.id % travelDestinations.length];
        return {
          id: user.id.toString(),
          name: `${destination.city}, ${destination.country}`,
          description: `Experience the beauty and culture of ${destination.city}. Perfect destination for travelers seeking adventure and memorable experiences.`,
          image: destination.image,
          status,
          category: 'destination' as const,
          price: `$${destination.price}`,
          rating: parseFloat(rating.toFixed(1)),
          country: destination.country
        };
      }
    } catch (error) {
      console.error('API Error:', error);
      // Fallback to mock data if API fails
      const destination = mockTravelData.find(item => item.id === id);
      if (!destination) {
        throw new Error('Destination not found');
      }
      return destination;
    }
  },
};