import { useEffect } from 'react';
import { SearchX } from 'lucide-react';
import { ListingCard, ListingCardSkeleton, FloatingActionButton } from '../components';
import { useListingsStore, useInterestsStore, useAuthStore, useLanguageStore } from '../store';
import { t } from '../i18n';
import { interestsService, listingsService } from '../api';
import type { Listing } from '../types';

export const HomePage = () => {
  const { filteredListings, isLoading, filters, setListings } = useListingsStore();
  const { interests } = useInterestsStore();
  const { isAuthenticated, user } = useAuthStore();
  const { language } = useLanguageStore();

  useEffect(() => {
    const loadListings = async () => {
      const response = await listingsService.getListings();
      if (response.success && response.data) {
        setListings(response.data);
      }
    };

    loadListings();
  }, [setListings]);

  const handleInterest = async (listing: Listing) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    if (user?.id === listing.owner.id) {
      return;
    }

    const alreadyInterested = interests.some(
      (i) => i.listing.id === listing.id && i.interestedUser.id === useAuthStore.getState().user?.id
    );

    if (alreadyInterested) {
      return;
    }

    await interestsService.sendInterest(listing);
  };

  const isListingInterested = (listingId: string) => {
    const userId = useAuthStore.getState().user?.id;
    return interests.some((i) => i.listing.id === listingId && i.interestedUser.id === userId);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            {filters.city ? `${t('findRoommate', language)} ${filters.city}` : t('allListings', language)}
          </h1>
          <p className="text-slate-500 mt-1">
            {filteredListings.length} {filteredListings.length === 1 ? 'объявление' : 
              filteredListings.length >= 2 && filteredListings.length <= 4 ? 'объявления' : 'объявлений'}
          </p>
        </div>

        {/* Listings Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onInterest={handleInterest}
                isInterested={isListingInterested(listing.id)}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <SearchX className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Ничего не найдено
            </h2>
            <p className="text-slate-500 max-w-md mb-6">
              Попробуйте использовать поиск с фильтрами
            </p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton show={isAuthenticated} />
    </div>
  );
};
