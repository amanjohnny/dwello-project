import { supabase } from "./supabase";
import type {
  Comment, Message, User, Listing, LoginCredentials, RegisterData, ApiResponse, Interest, HousingType, LifestyleTag, KazakhstanCity
} from '../types';
import { useAuthStore, useListingsStore, useInterestsStore, useCommentsStore, useMessagesStore } from '../store';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<User>> {
    if (!useAuthStore.getState().isDemoMode) {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (authError) return { success: false, error: authError.message };

      if (authData.user) {
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profileError) return { success: false, error: profileError.message };
        
        const mappedUser = { ...userProfile, avatar: userProfile.avatar_url, createdAt: userProfile.created_at };
        return { success: true, data: mappedUser as User };
      }
      return { success: false, error: 'Unknown error during login' };
    }

    await delay(800);
    const user = mockUsers.find((u) => u.email === credentials.email);
    if (user && credentials.password === 'demo123') return { success: true, data: user };
    
    const demoUser: User = { id: `user-${Date.now()}`, name: 'Демо Пользователь', email: credentials.email, city: 'Алматы', createdAt: new Date().toISOString() };
    return { success: true, data: demoUser };
  },

  async register(data: RegisterData): Promise<ApiResponse<User>> {
    if (!useAuthStore.getState().isDemoMode) {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email, password: data.password,
      });

      if (authError) return { success: false, error: authError.message };

      if (authData.user) {
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .insert({ id: authData.user.id, name: data.name, email: data.email, city: data.city })
          .select()
          .single();

        if (profileError) return { success: false, error: profileError.message };
        
        const mappedUser = { ...userProfile, avatar: userProfile.avatar_url, createdAt: userProfile.created_at };
        return { success: true, data: mappedUser as User };
      }
      return { success: false, error: 'Unknown error during registration' };
    }

    await delay(800);
    const newUser: User = { id: `user-${Date.now()}`, name: data.name, email: data.email, city: data.city, createdAt: new Date().toISOString() };
    return { success: true, data: newUser };
  },

  async logout(): Promise<ApiResponse<void>> {
    await supabase.auth.signOut();
    return { success: true };
  },

  async getCurrentUser(): Promise<ApiResponse<User | null>> {
    await delay(300);
    const { user } = useAuthStore.getState();
    return { success: true, data: user };
  },

  async getUserById(userId: string): Promise<ApiResponse<User | null>> {
    if (!useAuthStore.getState().isDemoMode) {
      const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
      if (error) return { success: false, error: error.message };
      if (!data) return { success: true, data: null };
      
      const mappedUser = { ...data, avatar: data.avatar_url, createdAt: data.created_at };
      return { success: true, data: mappedUser as User };
    }

    await delay(300);
    const user = mockUsers.find(u => u.id === userId);
    return { success: true, data: user || null };
  },

  async updateProfile(userId: string, data: Partial<User>): Promise<ApiResponse<User>> {
    if (!useAuthStore.getState().isDemoMode) {
      // КРИТИЧЕСКАЯ ОЧИСТКА: отправляем только разрешенные поля!
      const payload: any = {};
      if (data.name) payload.name = data.name;
      if (data.city) payload.city = data.city;
      if (data.phone) payload.phone = data.phone;
      if (data.bio) payload.bio = data.bio;
      
      if (data.avatar) payload.avatar_url = data.avatar;
      else if ((data as any).avatar_url) payload.avatar_url = (data as any).avatar_url;

      const { data: updatedUser, error } = await supabase
        .from('users')
        .update(payload)
        .eq('id', userId)
        .select()
        .single();

      if (error) return { success: false, error: error.message };

      const mappedUser = { 
        ...updatedUser, 
        avatar: updatedUser.avatar_url, 
        createdAt: updatedUser.created_at 
      };

      const { user, login } = useAuthStore.getState();
      if (user && user.id === userId) {
        login(mappedUser);
      }

      return { success: true, data: mappedUser as User };
    }

    await delay(500);
    const { user, login } = useAuthStore.getState();
    if (!user || user.id !== userId) return { success: false, error: 'User not found or unauthorized' };

    const updatedUser = { ...user, ...data };
    login(updatedUser);
    return { success: true, data: updatedUser };
  }
};

export const listingsService = {
  async getListings(): Promise<ApiResponse<Listing[]>> {
    if (!useAuthStore.getState().isDemoMode) {
      const { data, error } = await supabase.from('listings').select('*, owner:users(*)');
      if (error) return { success: false, error: error.message };
      
      const mappedData = (data || []).map(item => ({
        ...item,
        housingType: item.housing_type,
        availableSpots: item.available_spots,
        tags: item.tags || [],
        images: item.image_urls && item.image_urls.length > 0 ? item.image_urls : ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
        createdAt: item.created_at,
        owner: item.owner ? { ...item.owner, avatar: item.owner.avatar_url, createdAt: item.owner.created_at } : null
      }));

      return { success: true, data: mappedData as Listing[] };
    }

    await delay(500);
    const { listings } = useListingsStore.getState();
    return { success: true, data: listings };
  },

  async getListingById(id: string): Promise<ApiResponse<Listing | null>> {
    if (!useAuthStore.getState().isDemoMode) {
      const { data, error } = await supabase.from('listings').select('*, owner:users(*)').eq('id', id).single();
      if (error) return { success: false, error: error.message };
      if (!data) return { success: true, data: null };

      const mappedData = {
        ...data,
        housingType: data.housing_type,
        availableSpots: data.available_spots,
        tags: data.tags || [],
        images: data.image_urls && data.image_urls.length > 0 ? data.image_urls : ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
        createdAt: data.created_at,
        owner: data.owner ? { ...data.owner, avatar: data.owner.avatar_url, createdAt: data.owner.created_at } : null
      };

      return { success: true, data: mappedData as Listing };
    }

    await delay(300);
    const { listings } = useListingsStore.getState();
    const listing = listings.find((l) => l.id === id);
    return { success: true, data: listing || null };
  },

  async createListing(listingData: Partial<Listing>): Promise<ApiResponse<Listing>> {
    await delay(800);
    
    const authUser = useAuthStore.getState().user;
    if (!authUser) return { success: false, error: 'Not authenticated' };

    if (!useAuthStore.getState().isDemoMode) {
      const payload = {
        title: listingData.title || '',
        description: listingData.description || '',
        city: listingData.city || 'Алматы',
        price: listingData.price || 0,
        housing_type: listingData.housingType || 'room',
        capacity: listingData.capacity || 1,
        tags: listingData.tags || [],
        image_urls: listingData.images && listingData.images.length > 0 ? listingData.images : ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
        available_spots: listingData.availableSpots || 1,
        owner_id: authUser.id,
      };

      const { data, error } = await supabase.from('listings').insert(payload).select('*, owner:users(*)').single();
      if (error) return { success: false, error: error.message };

      const mappedData = {
        ...data,
        housingType: data.housing_type,
        availableSpots: data.available_spots,
        tags: data.tags || [],
        images: data.image_urls || payload.image_urls,
        createdAt: data.created_at,
        owner: data.owner ? { ...data.owner, avatar: data.owner.avatar_url, createdAt: data.owner.created_at } : null
      };

      useListingsStore.getState().addListing(mappedData as Listing);
      return { success: true, data: mappedData as Listing };
    }

    const newListing: Listing = {
      id: `listing-${Date.now()}`, title: listingData.title || '', description: listingData.description || '', city: listingData.city || 'Алматы', price: listingData.price || 0, housingType: listingData.housingType || 'room', capacity: listingData.capacity || 1, tags: listingData.tags || [], images: listingData.images || ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'], availableSpots: listingData.availableSpots || 1, owner: authUser, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    useListingsStore.getState().addListing(newListing);
    return { success: true, data: newListing };
  },

  async updateListing(id: string, listingData: Partial<Listing>): Promise<ApiResponse<Listing>> {
    return { success: false, error: 'Not implemented' };
  },

  async deleteListing(id: string): Promise<ApiResponse<void>> {
    return { success: false, error: 'Not implemented' };
  }
};

export const interestsService = {
  async getInterests(): Promise<ApiResponse<Interest[]>> {
    if (!useAuthStore.getState().isDemoMode) {
      const authUser = useAuthStore.getState().user;
      if (!authUser) return { success: true, data: [] };

      const { data, error } = await supabase
        .from('interests')
        .select('*, listings(*, users(*)), users(*)')
        .eq('user_id', authUser.id);

      if (error) return { success: false, error: error.message };

      const mappedData = (data || []).map(item => {
        const listingObj = Array.isArray(item.listings) ? item.listings[0] : item.listings;
        const userObj = Array.isArray(item.users) ? item.users[0] : item.users;
        const ownerObj = listingObj?.users ? (Array.isArray(listingObj.users) ? listingObj.users[0] : listingObj.users) : null;

        return {
          id: item.id,
          status: item.status,
          createdAt: item.created_at,
          listing: listingObj ? {
              ...listingObj,
              housingType: listingObj.housing_type,
              availableSpots: listingObj.available_spots,
              images: listingObj.image_urls || ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
              createdAt: listingObj.created_at,
              owner: ownerObj ? { ...ownerObj, avatar: ownerObj.avatar_url, createdAt: ownerObj.created_at } : null
          } : null,
          interestedUser: userObj ? { ...userObj, avatar: userObj.avatar_url, createdAt: userObj.created_at } : null
        };
      }).filter(i => i.listing !== null);

      const store = useInterestsStore.getState() as any;
      if (store.setInterests) store.setInterests(mappedData);

      return { success: true, data: mappedData as Interest[] };
    }
    
    await delay(300);
    const { interests } = useInterestsStore.getState();
    return { success: true, data: interests };
  },

  async getMyListingsInterests(): Promise<ApiResponse<Interest[]>> {
    if (!useAuthStore.getState().isDemoMode) {
        const authUser = useAuthStore.getState().user;
        if (!authUser) return { success: true, data: [] };

        const { data, error } = await supabase
          .from('interests')
          .select('*, listings(*, users(*)), users(*)');

        if (error) return { success: false, error: error.message };

        const filteredData = (data || []).filter(item => {
            const listingObj = Array.isArray(item.listings) ? item.listings[0] : item.listings;
            return listingObj && listingObj.owner_id === authUser.id;
        });

        const mappedData = filteredData.map(item => {
            const listingObj = Array.isArray(item.listings) ? item.listings[0] : item.listings;
            const userObj = Array.isArray(item.users) ? item.users[0] : item.users;
            const ownerObj = listingObj?.users ? (Array.isArray(listingObj.users) ? listingObj.users[0] : listingObj.users) : null;

            return {
                id: item.id,
                status: item.status,
                createdAt: item.created_at,
                listing: listingObj ? {
                    ...listingObj,
                    housingType: listingObj.housing_type,
                    availableSpots: listingObj.available_spots,
                    images: listingObj.image_urls || ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
                    createdAt: listingObj.created_at,
                    owner: ownerObj ? { ...ownerObj, avatar: ownerObj.avatar_url, createdAt: ownerObj.created_at } : null
                } : null,
                interestedUser: userObj ? { ...userObj, avatar: userObj.avatar_url, createdAt: userObj.created_at } : null
            };
        });

        return { success: true, data: mappedData as Interest[] };
    }

    await delay(300);
    const authUser = useAuthStore.getState().user;
    const { interests } = useInterestsStore.getState();
    if (!authUser) return { success: true, data: [] };
    const myListingsInterests = interests.filter((interest) => interest.listing.owner.id === authUser.id);
    return { success: true, data: myListingsInterests };
  },

  async sendInterest(listing: Listing): Promise<ApiResponse<Interest>> {
    const authUser = useAuthStore.getState().user;
    if (!authUser) return { success: false, error: 'Not authenticated' };
    if (listing.owner.id === authUser.id) return { success: false, error: 'Нельзя откликнуться на собственное объявление' };

    if (!useAuthStore.getState().isDemoMode) {
       const payload = { listing_id: listing.id, user_id: authUser.id, status: 'pending' };
       const { data, error } = await supabase.from('interests').insert(payload).select().single();
       if (error) return { success: false, error: error.message };

       const mappedData: Interest = {
           id: data.id,
           status: data.status,
           createdAt: data.created_at,
           listing: listing,
           interestedUser: authUser
       };

       useInterestsStore.getState().addInterest(mappedData.listing);
       return { success: true, data: mappedData };
    }

    await delay(500);
    const newInterest: Interest = { id: `interest-${Date.now()}`, listing, interestedUser: authUser, status: 'pending', createdAt: new Date().toISOString() };
    useInterestsStore.getState().addInterest(listing);
    return { success: true, data: newInterest };
  },

  async updateInterestStatus(interestId: string, status: 'pending' | 'accepted' | 'rejected'): Promise<ApiResponse<Interest>> {
    if (!useAuthStore.getState().isDemoMode) {
       const { error } = await supabase.from('interests').update({ status: status }).eq('id', interestId);
       if (error) return { success: false, error: error.message };

       useInterestsStore.getState().updateInterestStatus(interestId, status);
       const { interests } = useInterestsStore.getState();
       return { success: true, data: interests.find((i) => i.id === interestId)! };
    }

    await delay(300);
    useInterestsStore.getState().updateInterestStatus(interestId, status);
    return { success: true, data: useInterestsStore.getState().interests.find((i) => i.id === interestId)! };
  }
};

export const searchService = {
  async searchListings(params: any): Promise<ApiResponse<Listing[]>> {
    return { success: true, data: [] };
  }
};

// ВОССТАНОВЛЕННЫЕ СЕРВИСЫ
export const commentsService = {
  async getCommentsByListingId(listingId: string): Promise<ApiResponse<Comment[]>> {
    if (!useAuthStore.getState().isDemoMode) {
      const { data, error } = await supabase.from('comments').select('*, user:users(*)').eq('listing_id', listingId);
      if (error) return { success: false, error: error.message };
      
      const mappedData = (data || []).map(item => ({
        ...item,
        createdAt: item.created_at,
        user: item.user ? { ...item.user, avatar: item.user.avatar_url, createdAt: item.user.created_at } : null
      }));
      
      return { success: true, data: mappedData as Comment[] };
    }

    await delay(300);
    const { comments } = useCommentsStore.getState();
    const listingComments = comments.filter((c) => c.listing_id === listingId);
    return { success: true, data: listingComments };
  },

  async addComment(listingId: string, content: string): Promise<ApiResponse<Comment>> {
    const authUser = useAuthStore.getState().user;
    if (!authUser) return { success: false, error: 'Not authenticated' };

    if (!useAuthStore.getState().isDemoMode) {
      const { data, error } = await supabase.from('comments').insert({ listing_id: listingId, user_id: authUser.id, content }).select('*, user:users(*)').single();
      if (error) return { success: false, error: error.message };
      
      const mappedData = { ...data, createdAt: data.created_at, user: data.user ? { ...data.user, avatar: data.user.avatar_url, createdAt: data.user.created_at } : null };
      return { success: true, data: mappedData as Comment };
    }

    await delay(500);
    const newComment: Comment = { id: `comment-${Date.now()}`, listing_id: listingId, user_id: authUser.id, user: authUser, content, createdAt: new Date().toISOString() };
    useCommentsStore.getState().addComment(newComment);
    return { success: true, data: newComment };
  }
};

export const messagesService = {
  async getMessages(userId1: string, userId2: string): Promise<ApiResponse<Message[]>> {
    if (!useAuthStore.getState().isDemoMode) {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
        .order('created_at', { ascending: true });

      if (error) return { success: false, error: error.message };
      
      const mappedData = (data || []).map(item => ({ ...item, createdAt: item.created_at }));
      return { success: true, data: mappedData as Message[] };
    }

    await delay(300);
    const { messages } = useMessagesStore.getState();
    const chatMessages = messages.filter(
      (m) => (m.sender_id === userId1 && m.receiver_id === userId2) || (m.sender_id === userId2 && m.receiver_id === userId1)
    ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    return { success: true, data: chatMessages };
  },

  async sendMessage(receiverId: string, content: string): Promise<ApiResponse<Message>> {
    const authUser = useAuthStore.getState().user;
    if (!authUser) return { success: false, error: 'Not authenticated' };

    if (!useAuthStore.getState().isDemoMode) {
      const { data, error } = await supabase.from('messages').insert({ sender_id: authUser.id, receiver_id: receiverId, content }).select().single();
      if (error) return { success: false, error: error.message };
      
      const mappedData = { ...data, createdAt: data.created_at };
      return { success: true, data: mappedData as Message };
    }

    await delay(300);
    const newMessage: Message = { id: `msg-${Date.now()}`, sender_id: authUser.id, receiver_id: receiverId, content, createdAt: new Date().toISOString() };
    useMessagesStore.getState().addMessage(newMessage);
    return { success: true, data: newMessage };
  }
};