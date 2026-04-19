import type { Comment, Message } from "../types";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  User, 
  Listing, 
  Interest, 
  SearchFilters, 
  HousingType, 
  LifestyleTag,
  KazakhstanCity 
} from '../types';

// Mock data for demo purposes
const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Уютная комната в центре Алматы',
    description: 'Светлая и просторная комната в самом сердце города. Рядом метро, магазины и кафе. Идеально для студентов и молодых специалистов.',
    city: 'Алматы',
    price: 85000,
    housingType: 'room',
    capacity: 2,
    tags: ['student-friendly', 'quiet'],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    ],
    availableSpots: 1,
    owner: {
      id: 'u1',
      name: 'Айгуль К.',
      email: 'aigul@example.com',
      city: 'Алматы',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      bio: 'Владелец квартиры, сдаю уже 3 года. Люблю порядок и уют.',
      createdAt: '2024-01-15',
    },
    createdAt: '2024-03-01',
    updatedAt: '2024-03-01',
  },
  {
    id: '2',
    title: 'Современная квартира-студия в Астане',
    description: 'Новая квартира с евроремонтом в престижном районе. Панорамные окна, вся техника включена. Рядом ЭКСПО и Байтерек.',
    city: 'Астана',
    price: 150000,
    housingType: 'apartment',
    capacity: 2,
    tags: ['quiet', 'no-smoking'],
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
    ],
    availableSpots: 1,
    owner: {
      id: 'u2',
      name: 'Нурлан Б.',
      email: 'nurlan@example.com',
      city: 'Астана',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      bio: 'Бизнесмен, сдаю квартиру в аренду. Ответственный арендодатель.',
      createdAt: '2024-02-01',
    },
    createdAt: '2024-03-05',
    updatedAt: '2024-03-05',
  },
  {
    id: '3',
    title: 'Ищу соседа в 3-комнатную квартиру',
    description: 'Ищу спокойного соседа в просторную квартиру. Две комнаты свободны. Отличный район, развитая инфраструктура.',
    city: 'Шымкент',
    price: 45000,
    housingType: 'roommate',
    capacity: 3,
    tags: ['social', 'student-friendly', 'pets-allowed'],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
    ],
    availableSpots: 2,
    owner: {
      id: 'u3',
      name: 'Динара М.',
      email: 'dinara@example.com',
      city: 'Шымкент',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      bio: 'Молодая мама, ищу соседей для совместной аренды.',
      createdAt: '2024-01-20',
    },
    createdAt: '2024-03-10',
    updatedAt: '2024-03-10',
  },
  {
    id: '4',
    title: 'Дом в пригороде с садом',
    description: 'Просторный дом с собственным участком. Тихий район, свежий воздух. Идеально для семьи или компании друзей.',
    city: 'Алматы',
    price: 250000,
    housingType: 'house',
    capacity: 6,
    tags: ['quiet', 'pets-allowed'],
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    ],
    availableSpots: 4,
    owner: {
      id: 'u4',
      name: 'Ерлан А.',
      email: 'erlan@example.com',
      city: 'Алматы',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      bio: 'Владелец загородного дома, сдаю на лето и выходные.',
      createdAt: '2024-02-10',
    },
    createdAt: '2024-03-12',
    updatedAt: '2024-03-12',
  },
  {
    id: '5',
    title: 'Комната в студенческом общежитии',
    description: 'Экономичный вариант для студентов. Общежитие в кампусе университета, все рядом.',
    city: 'Караганда',
    price: 25000,
    housingType: 'room',
    capacity: 3,
    tags: ['student-friendly', 'social'],
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800',
    ],
    availableSpots: 2,
    owner: {
      id: 'u5',
      name: 'Алексей П.',
      email: 'alexey@example.com',
      city: 'Караганда',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      bio: 'Студент, сдаю дополнительное место в комнате.',
      createdAt: '2024-03-01',
    },
    createdAt: '2024-03-15',
    updatedAt: '2024-03-15',
  },
  {
    id: '6',
    title: 'Элитная квартира в центре Астаны',
    description: 'Роскошная квартира в ЖК Премьера. Консьерж, охрана, подземная парковка. Вид на набережную.',
    city: 'Астана',
    price: 350000,
    housingType: 'apartment',
    capacity: 2,
    tags: ['quiet', 'no-smoking'],
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
    ],
    availableSpots: 1,
    owner: {
      id: 'u6',
      name: 'Мадина С.',
      email: 'madina@example.com',
      city: 'Астана',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      bio: 'Бизнес-леди, инвестирую в недвижимость.',
      createdAt: '2024-01-05',
    },
    createdAt: '2024-03-08',
    updatedAt: '2024-03-08',
  },
];

// Default search filters
const defaultFilters: SearchFilters = {
  city: '',
  keyword: '',
  housingType: '',
  priceMin: 0,
  priceMax: 1000000,
  capacity: 1,
  tags: [],
};

// Auth Store
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemoMode: boolean;
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setDemoMode: (isDemoMode: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isDemoMode: false,
      login: (user) => {
        set({ user, isAuthenticated: true, isLoading: false });
        if (get().isDemoMode) {
          useListingsStore.getState().setListings(mockListings);
        } else {
          useListingsStore.getState().setListings([]);
          useCommentsStore.getState().setComments([]);
          useMessagesStore.getState().setMessages([]);
          useInterestsStore.getState().setInterests([]);
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false, isLoading: false });
        useListingsStore.getState().setListings(mockListings);
        // Do not reset demo mode on logout to keep existing flow happy,
        // but reset data to safe default.
      },
      setLoading: (isLoading) => set({ isLoading }),
      setDemoMode: (isDemoMode) => set({ isDemoMode }),
    }),
    {
      name: 'dwello-auth',
    }
  )
);

// Listings Store
interface ListingsState {
  listings: Listing[];
  filteredListings: Listing[];
  isLoading: boolean;
  filters: SearchFilters;
  setListings: (listings: Listing[]) => void;
  addListing: (listing: Listing) => void;
  updateFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  filterListings: () => void;
  setLoading: (loading: boolean) => void;
}

export const useListingsStore = create<ListingsState>()((set, get) => ({
  listings: mockListings,
  filteredListings: mockListings,
  isLoading: false,
  filters: defaultFilters,

  setListings: (listings) => {
    set({ listings });
    get().filterListings();
  },

  addListing: (listing) => {
    const newListings = [listing, ...get().listings];
    set({ listings: newListings });
    get().filterListings();
  },

  updateFilters: (newFilters) => {
    set({ filters: { ...get().filters, ...newFilters } });
    get().filterListings();
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
    get().filterListings();
  },

  filterListings: () => {
    const { listings, filters } = get();
    const filtered = listings.filter((listing) => {
      // City filter
      if (filters.city && listing.city !== filters.city) return false;
      
      // Keyword filter
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        const matchesKeyword = 
          listing.title.toLowerCase().includes(keyword) ||
          listing.description.toLowerCase().includes(keyword) ||
          listing.city.toLowerCase().includes(keyword);
        if (!matchesKeyword) return false;
      }
      
      // Housing type filter
      if (filters.housingType && listing.housingType !== filters.housingType) return false;
      
      // Price filter
      if (listing.price < filters.priceMin || listing.price > filters.priceMax) return false;
      
      // Capacity filter
      if (listing.capacity < filters.capacity) return false;
      
      // Tags filter
      if (filters.tags.length > 0) {
        const hasAllTags = filters.tags.every((tag) => listing.tags.includes(tag));
        if (!hasAllTags) return false;
      }
      
      return true;
    });
    set({ filteredListings: filtered });
  },

  setLoading: (isLoading) => set({ isLoading }),
}));

// Interests Store
interface InterestsState {
  interests: Interest[];
  myListingsInterests: Interest[];
  setInterests: (interests: Interest[]) => void;
  addInterest: (listing: Listing) => void;
  updateInterestStatus: (interestId: string, status: 'pending' | 'accepted' | 'rejected') => void;
}

export const useInterestsStore = create<InterestsState>()((set, get) => ({
  interests: [],
  myListingsInterests: [],
  setInterests: (interests) => set({ interests }),

  addInterest: (listing) => {
    const authUser = useAuthStore.getState().user;
    if (!authUser) return;

    const newInterest: Interest = {
      id: `interest-${Date.now()}`,
      listing,
      interestedUser: authUser,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    set({ interests: [...get().interests, newInterest] });
  },

  updateInterestStatus: (interestId, status) => {
    const updatedInterests = get().interests.map((interest) =>
      interest.id === interestId ? { ...interest, status } : interest
    );
    set({ interests: updatedInterests });
  },
}));

// UI Store for global UI state
interface UIState {
  isFilterPanelOpen: boolean;
  toggleFilterPanel: () => void;
  closeFilterPanel: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isFilterPanelOpen: false,
  toggleFilterPanel: () => set((state) => ({ isFilterPanelOpen: !state.isFilterPanelOpen })),
  closeFilterPanel: () => set({ isFilterPanelOpen: false }),
}));

// Language Store
export type Language = 'ru' | 'kk';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'kk',
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'dwello-language',
    }
  )
);

// Settings Store (for toggle switches)
interface SettingsState {
  notifications: boolean;
  emailSubscription: boolean;
  toggleNotifications: () => void;
  toggleEmailSubscription: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      notifications: true,
      emailSubscription: false,
      toggleNotifications: () => set((state) => ({ notifications: !state.notifications })),
      toggleEmailSubscription: () => set((state) => ({ emailSubscription: !state.emailSubscription })),
    }),
    {
      name: 'dwello-settings',
    }
  )
);

// Comments Store
interface CommentsState {
  comments: Comment[];
  addComment: (comment: Comment) => void;
  setComments: (comments: Comment[]) => void;
}

export const useCommentsStore = create<CommentsState>()((set, get) => ({
  comments: [],
  addComment: (comment) => set({ comments: [...get().comments, comment] }),
  setComments: (comments) => set({ comments }),
}));

// Messages Store
interface MessagesState {
  messages: Message[];
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
}

export const useMessagesStore = create<MessagesState>()((set, get) => ({
  messages: [],
  addMessage: (message) => set({ messages: [...get().messages, message] }),
  setMessages: (messages) => set({ messages }),
}));
