import { X, SlidersHorizontal } from 'lucide-react';
import { Button, Input, Select, Badge } from './ui';
import { useListingsStore, useUIStore } from '../store';
import { KAZAKHSTAN_CITIES, type HousingType, type LifestyleTag } from '../types';

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

export const FilterPanel = () => {
  const { filters, updateFilters, resetFilters } = useListingsStore();
  const { isFilterPanelOpen, closeFilterPanel } = useUIStore();

  const cityOptions = [
    { value: '', label: 'Все города' },
    ...KAZAKHSTAN_CITIES.map((city) => ({ value: city, label: city })),
  ];

  const toggleTag = (tag: LifestyleTag) => {
    const currentTags = filters.tags;
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];
    updateFilters({ tags: newTags });
  };

  const activeFiltersCount = 
    (filters.city ? 1 : 0) +
    (filters.housingType ? 1 : 0) +
    (filters.priceMin > 0 || filters.priceMax < 1000000 ? 1 : 0) +
    (filters.capacity > 1 ? 1 : 0) +
    filters.tags.length;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed bottom-6 right-6 z-40 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        onClick={() => useUIStore.getState().toggleFilterPanel()}
      >
        <SlidersHorizontal className="w-6 h-6" />
        {activeFiltersCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      <div
        className={`
          fixed md:relative inset-0 z-50 md:z-auto
          bg-white md:bg-transparent
          transition-all duration-300
          ${isFilterPanelOpen ? 'opacity-100 visible' : 'opacity-0 invisible md:opacity-100 md:visible'}
        `}
      >
        {/* Overlay for mobile */}
        <div 
          className="md:hidden absolute inset-0 bg-black/50"
          onClick={closeFilterPanel}
        />
        
        <div className={`
          relative md:static
          h-full md:h-auto w-full md:w-auto
          bg-white md:bg-slate-50
          p-4 md:p-0
          overflow-y-auto md:overflow-visible
          transform transition-transform duration-300
          ${isFilterPanelOpen ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}
          md:transform-none
          max-w-md md:max-w-none mx-auto md:mx-0
        `}>
          <div className="md:hidden flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Фильтры</h2>
            <button onClick={closeFilterPanel}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* City Filter */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-2">Город</h3>
              <Select
                value={filters.city}
                onChange={(e) => updateFilters({ city: e.target.value })}
                options={cityOptions}
                placeholder="Все города"
              />
            </div>

            {/* Housing Type Filter */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-2">Тип жилья</h3>
              <Select
                value={filters.housingType}
                onChange={(e) => updateFilters({ housingType: e.target.value as HousingType | '' })}
                options={housingTypes}
                placeholder="Все типы"
              />
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-2">Цена (₸)</h3>
              <div className="flex gap-3">
                <Input
                  type="number"
                  placeholder="От"
                  value={filters.priceMin || ''}
                  onChange={(e) => updateFilters({ priceMin: Number(e.target.value) })}
                />
                <Input
                  type="number"
                  placeholder="До"
                  value={filters.priceMax === 1000000 ? '' : filters.priceMax}
                  onChange={(e) => updateFilters({ priceMax: Number(e.target.value) || 1000000 })}
                />
              </div>
            </div>

            {/* Capacity */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-2">Вместимость</h3>
              <Input
                type="number"
                min={1}
                value={filters.capacity}
                onChange={(e) => updateFilters({ capacity: Number(e.target.value) })}
                placeholder="Минимум человек"
              />
            </div>

            {/* Lifestyle Tags */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-2">Образ жизни</h3>
              <div className="flex flex-wrap gap-2">
                {lifestyleTags.map((tag) => (
                  <button
                    key={tag.value}
                    onClick={() => toggleTag(tag.value)}
                    className={`
                      px-3 py-1.5 rounded-full text-sm font-medium transition-all
                      ${filters.tags.includes(tag.value)
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

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2">
                {filters.city && (
                  <Badge variant="info">
                    {filters.city}
                    <button onClick={() => updateFilters({ city: '' })} className="ml-1">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {filters.housingType && (
                  <Badge variant="info">
                    {housingTypes.find(h => h.value === filters.housingType)?.label}
                    <button onClick={() => updateFilters({ housingType: '' })} className="ml-1">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {filters.tags.map((tag) => (
                  <Badge key={tag} variant="info">
                    {lifestyleTags.find(t => t.value === tag)?.label}
                    <button onClick={() => toggleTag(tag)} className="ml-1">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <Button
                variant="outline"
                className="flex-1"
                onClick={resetFilters}
              >
                Сбросить
              </Button>
              <Button
                className="flex-1 md:hidden"
                onClick={closeFilterPanel}
              >
                Применить
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
