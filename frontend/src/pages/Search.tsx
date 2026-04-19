import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, X, SlidersHorizontal, MapPin } from 'lucide-react';
import { ListingCard, ListingCardSkeleton, Button, Input, Select } from '../components';
import { useListingsStore, useInterestsStore, useAuthStore } from '../store';
import { interestsService } from '../api';
import { KAZAKHSTAN_CITIES, type HousingType, type LifestyleTag, type Listing } from '../types';

const housingTypes: { value: HousingType | ''; label: string }[] = [
  { value: '', label: 'Все типы' },
  { value: 'room', label: 'Комната' },
  { value: 'apartment', label: 'Квартира' },
  { value: 'house', label: 'Дом' },
  { value: 'roommate', label: 'Ищу соседа' },
];

const lifestyleTags: { value: LifestyleTag; label: string }[] = [
  { value: 'student-friendly', label: 'Студентам' },
  { value: 'quiet', label: 'Тихий' },
  { value: 'social', label: 'Социальный' },
  { value: 'no-smoking', label: 'Без курения' },
  { value: 'pets-allowed', label: 'Можно с питомцами' },
];

export const SearchPage = () => {
  const navigate = useNavigate();
  const { listings, filters, updateFilters, resetFilters, filterListings, filteredListings } = useListingsStore();
  const { interests } = useInterestsStore();
  const { isAuthenticated } = useAuthStore();
  
  const [showFilters, setShowFilters] = useState(true);
  const [localKeyword, setLocalKeyword] = useState(filters.keyword);
  const [localCity, setLocalCity] = useState(filters.city);
  const [localHousingType, setLocalHousingType] = useState<HousingType | ''>(filters.housingType);
  const [localPriceMin, setLocalPriceMin] = useState(filters.priceMin);
  const [localPriceMax, setLocalPriceMax] = useState(filters.priceMax === 1000000 ? '' : filters.priceMax.toString());
  const [localCapacity, setLocalCapacity] = useState(filters.capacity);
  const [localTags, setLocalTags] = useState<LifestyleTag[]>(filters.tags);

  const cityOptions = [
    { value: '', label: 'Все города' },
    ...KAZAKHSTAN_CITIES.map((city) => ({ value: city, label: city })),
  ];

  const handleSearch = () => {
    updateFilters({
      keyword: localKeyword,
      city: localCity,
      housingType: localHousingType,
      priceMin: localPriceMin,
      priceMax: localPriceMax ? Number(localPriceMax) : 1000000,
      capacity: localCapacity,
      tags: localTags,
    });
  };

  const handleReset = () => {
    setLocalKeyword('');
    setLocalCity('');
    setLocalHousingType('');
    setLocalPriceMin(0);
    setLocalPriceMax('');
    setLocalCapacity(1);
    setLocalTags([]);
    resetFilters();
  };

  const toggleTag = (tag: LifestyleTag) => {
    setLocalTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleInterest = async (listing: Listing) => {
    if (!isAuthenticated) {
      navigate('/login');
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

  // Apply search when filters change
  useEffect(() => {
    handleSearch();
  }, []);

  const activeFiltersCount = 
    (localCity ? 1 : 0) +
    (localHousingType ? 1 : 0) +
    (localPriceMin > 0 || localPriceMax ? 1 : 0) +
    (localCapacity > 1 ? 1 : 0) +
    localTags.length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Header */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Keyword Search */}
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Поиск по названию или описанию..."
                  value={localKeyword}
                  onChange={(e) => setLocalKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* City Select */}
            <Select
              value={localCity}
              onChange={(e) => setLocalCity(e.target.value)}
              options={cityOptions}
              placeholder="Город"
              className="w-full md:w-48"
            />

            {/* Search Button */}
            <Button onClick={handleSearch} className="gap-2">
              <SearchIcon className="w-4 h-4" />
              Найти
            </Button>
          </div>

          {/* Filter Toggle */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all
                ${showFilters ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
              `}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Фильтры
              {activeFiltersCount > 0 && (
                <span className={`
                  ml-1 px-1.5 py-0.5 rounded text-xs
                  ${showFilters ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'}
                `}>
                  {activeFiltersCount}
                </span>
              )}
              {showFilters ? <X className="w-4 h-4 ml-1" /> : null}
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Housing Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Тип жилья</label>
                <Select
                  value={localHousingType}
                  onChange={(e) => setLocalHousingType(e.target.value as HousingType | '')}
                  options={housingTypes}
                  placeholder="Все типы"
                />
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Цена (₸)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="От"
                    value={localPriceMin || ''}
                    onChange={(e) => setLocalPriceMin(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="До"
                    value={localPriceMax}
                    onChange={(e) => setLocalPriceMax(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Вместимость</label>
                <input
                  type="number"
                  min={1}
                  value={localCapacity}
                  onChange={(e) => setLocalCapacity(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Теги</label>
                <div className="flex flex-wrap gap-1">
                  {lifestyleTags.map((tag) => (
                    <button
                      key={tag.value}
                      type="button"
                      onClick={() => toggleTag(tag.value)}
                      className={`
                        px-2 py-1 rounded-full text-xs font-medium transition-all
                        ${localTags.includes(tag.value)
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }
                      `}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {localCity && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  <MapPin className="w-3 h-3" />
                  {localCity}
                  <button onClick={() => setLocalCity('')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {localHousingType && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {housingTypes.find(h => h.value === localHousingType)?.label}
                  <button onClick={() => setLocalHousingType('')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {localTags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {lifestyleTags.find(t => t.value === tag)?.label}
                  <button onClick={() => toggleTag(tag)}><X className="w-3 h-3" /></button>
                </span>
              ))}
              <button
                onClick={handleReset}
                className="text-sm text-slate-500 hover:text-slate-700 underline"
              >
                Сбросить все
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-slate-900">
            Найдено: {filteredListings.length} {filteredListings.length === 1 ? 'объявление' : 
              filteredListings.length >= 2 && filteredListings.length <= 4 ? 'объявления' : 'объявлений'}
          </h1>
        </div>

        {/* Listings Grid */}
        {filteredListings.length > 0 ? (
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
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Ничего не найдено</h2>
            <p className="text-slate-500 mb-4">Попробуйте изменить параметры поиска</p>
            <Button variant="outline" onClick={handleReset}>Сбросить фильтры</Button>
          </div>
        )}
      </div>
    </div>
  );
};
