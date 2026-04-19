import type { 
  User, 
  Listing, 
  LoginCredentials, 
  RegisterData, 
  ApiResponse,
  Interest,
  HousingType,
  LifestyleTag,
  KazakhstanCity
} from '../types';
import { useAuthStore, useListingsStore, useInterestsStore } from '../store';

// Simulated delay for API calls
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock user database
const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Айгуль К.',
    email: 'aigul@example.com',
    city: 'Алматы',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    bio: 'Владелец квартиры, сдаю уже 3 года. Люблю порядок и уют.',
    createdAt: '2024-01-15',
  },
];

// Auth Service
export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<User>> {
    await delay(800);
    
    // Mock authentication - in production, this would call the backend
    const user = mockUsers.find((u) => u.email === credentials.email);
    
    if (user && credentials.password === 'demo123') {
      return { success: true, data: user };
    }
    
    // For demo, create a user on login
    const demoUser: User = {
      id: `user-${Date.now()}`,
      name: 'Демо Пользователь',
      email: credentials.email,
      city: 'Алматы',
      createdAt: new Date().toISOString(),
    };
    
    return { success: true, data: demoUser };
  },

  async register(data: RegisterData): Promise<ApiResponse<User>> {
    await delay(800);
    
    // Mock registration
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      city: data.city,
      createdAt: new Date().toISOString(),
    };
    
    return { success: true, data: newUser };
  },

  async logout(): Promise<ApiResponse<void>> {
    await delay(300);
    return { success: true };
  },

  async getCurrentUser(): Promise<ApiResponse<User | null>> {
    await delay(300);
    const { user } = useAuthStore.getState();
    return { success: true, data: user };
  },
};

// Listings Service
export const listingsService = {
  async getListings(): Promise<ApiResponse<Listing[]>> {
    await delay(500);
    const { listings } = useListingsStore.getState();
    return { success: true, data: listings };
  },

  async getListingById(id: string): Promise<ApiResponse<Listing | null>> {
    await delay(300);
    const { listings } = useListingsStore.getState();
    const listing = listings.find((l) => l.id === id);
    return { success: true, data: listing || null };
  },

  async createListing(listingData: Partial<Listing>): Promise<ApiResponse<Listing>> {
    await delay(800);
    
    const authUser = useAuthStore.getState().user;
    if (!authUser) {
      return { success: false, error: 'Not authenticated' };
    }

    const newListing: Listing = {
      id: `listing-${Date.now()}`,
      title: listingData.title || '',
      description: listingData.description || '',
      city: listingData.city || 'Алматы',
      price: listingData.price || 0,
      housingType: listingData.housingType || 'room',
      capacity: listingData.capacity || 1,
      tags: listingData.tags || [],
      images: listingData.images || ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
      availableSpots: listingData.availableSpots || 1,
      owner: authUser,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    useListingsStore.getState().addListing(newListing);
    
    return { success: true, data: newListing };
  },

  async updateListing(id: string, listingData: Partial<Listing>): Promise<ApiResponse<Listing>> {
    await delay(500);
    
    const { listings } = useListingsStore.getState();
    const index = listings.findIndex((l) => l.id === id);
    
    if (index === -1) {
      return { success: false, error: 'Listing not found' };
    }

    const updatedListing = {
      ...listings[index],
      ...listingData,
      updatedAt: new Date().toISOString(),
    };

    const newListings = [...listings];
    newListings[index] = updatedListing;
    useListingsStore.getState().setListings(newListings);

    return { success: true, data: updatedListing };
  },

  async deleteListing(id: string): Promise<ApiResponse<void>> {
    await delay(500);
    
    const { listings } = useListingsStore.getState();
    const newListings = listings.filter((l) => l.id !== id);
    useListingsStore.getState().setListings(newListings);

    return { success: true };
  },
};

// Interests Service
export const interestsService = {
  async getInterests(): Promise<ApiResponse<Interest[]>> {
    await delay(300);
    const { interests } = useInterestsStore.getState();
    return { success: true, data: interests };
  },

  async getMyListingsInterests(): Promise<ApiResponse<Interest[]>> {
    await delay(300);
    
    const authUser = useAuthStore.getState().user;
    const { interests } = useInterestsStore.getState();
    
    if (!authUser) {
      return { success: true, data: [] };
    }

    const myListingsInterests = interests.filter(
      (interest) => interest.listing.owner.id === authUser.id
    );

    return { success: true, data: myListingsInterests };
  },

  async sendInterest(listing: Listing): Promise<ApiResponse<Interest>> {
    await delay(500);
    
    const authUser = useAuthStore.getState().user;
    if (!authUser) {
      return { success: false, error: 'Not authenticated' };
    }

    const newInterest: Interest = {
      id: `interest-${Date.now()}`,
      listing,
      interestedUser: authUser,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    useInterestsStore.getState().addInterest(listing);

    return { success: true, data: newInterest };
  },

  async updateInterestStatus(
    interestId: string, 
    status: 'pending' | 'accepted' | 'rejected'
  ): Promise<ApiResponse<Interest>> {
    await delay(300);
    
    useInterestsStore.getState().updateInterestStatus(interestId, status);
    
    const { interests } = useInterestsStore.getState();
    const interest = interests.find((i) => i.id === interestId);
    
    return { success: true, data: interest! };
  },
};

// Search Service
export const searchService = {
  async searchListings(params: {
    city?: string;
    keyword?: string;
    housingType?: HousingType | '';
    priceMin?: number;
    priceMax?: number;
    capacity?: number;
    tags?: LifestyleTag[];
  }): Promise<ApiResponse<Listing[]>> {
    await delay(400);
    
    const { listings } = useListingsStore.getState();
    
    const filtered = listings.filter((listing) => {
      if (params.city && listing.city !== params.city) return false;
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase();
        if (!listing.title.toLowerCase().includes(keyword) &&
            !listing.description.toLowerCase().includes(keyword)) {
          return false;
        }
      }
      if (params.housingType && listing.housingType !== params.housingType) return false;
      if (params.priceMin && listing.price < params.priceMin) return false;
      if (params.priceMax && listing.price > params.priceMax) return false;
      if (params.capacity && listing.capacity < params.capacity) return false;
      if (params.tags && params.tags.length > 0) {
        if (!params.tags.some((tag) => listing.tags.includes(tag))) return false;
      }
      return true;
    });

    return { success: true, data: filtered };
  },
};
