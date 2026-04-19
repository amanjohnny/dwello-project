import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, X, Home } from 'lucide-react';
import { Button, Input, Select, Textarea, Card } from '../components';
import { listingsService } from '../api';
import { useAuthStore } from '../store';
import { KAZAKHSTAN_CITIES, type HousingType, type LifestyleTag, type KazakhstanCity } from '../types';

const housingTypes: { value: HousingType; label: string }[] = [
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

const defaultImages = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
];

export const CreateListingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState<KazakhstanCity | ''>('');
  const [price, setPrice] = useState('');
  const [housingType, setHousingType] = useState<HousingType>('room');
  const [capacity, setCapacity] = useState('1');
  const [availableSpots, setAvailableSpots] = useState('1');
  const [tags, setTags] = useState<LifestyleTag[]>([]);
  const [images, setImages] = useState<string[]>([defaultImages[0]]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const cityOptions = KAZAKHSTAN_CITIES.map((c) => ({ value: c, label: c }));

  const toggleTag = (tag: LifestyleTag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!title.trim()) {
      setError('Пожалуйста, введите название');
      return;
    }

    if (!description.trim()) {
      setError('Пожалуйста, введите описание');
      return;
    }

    if (!city) {
      setError('Пожалуйста, выберите город');
      return;
    }

    if (!price || Number(price) <= 0) {
      setError('Пожалуйста, введите корректную цену');
      return;
    }

    setIsLoading(true);

    try {
      const response = await listingsService.createListing({
        title: title.trim(),
        description: description.trim(),
        city,
        price: Number(price),
        housingType,
        capacity: Number(capacity),
        availableSpots: Number(availableSpots),
        tags,
        images,
      });

      if (response.success && response.data) {
        navigate('/');
      } else {
        setError(response.error || 'Ошибка создания объявления');
      }
    } catch (err) {
      setError('Произошла ошибка. Попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к объявлениям
        </Link>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Создать объявление</h1>
              <p className="text-sm text-slate-500">Найдите идеальных соседей или арендаторов</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <Input
              label="Название"
              placeholder="Например: Уютная комната в центре"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            {/* Description */}
            <Textarea
              label="Описание"
              placeholder="Расскажите о вашем жилье, районе, соседях..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              required
            />

            {/* City & Housing Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Город"
                value={city}
                onChange={(e) => setCity(e.target.value as KazakhstanCity)}
                options={cityOptions}
                placeholder="Выберите город"
                required
              />
              <Select
                label="Тип жилья"
                value={housingType}
                onChange={(e) => setHousingType(e.target.value as HousingType)}
                options={housingTypes}
              />
            </div>

            {/* Price & Capacity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Цена (₸/мес)"
                type="number"
                placeholder="50000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
              <Input
                label="Вместимость"
                type="number"
                min={1}
                placeholder="2"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                required
              />
              <Input
                label="Свободных мест"
                type="number"
                min={1}
                placeholder="1"
                value={availableSpots}
                onChange={(e) => setAvailableSpots(e.target.value)}
                required
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Теги (выберите подходящие)
              </label>
              <div className="flex flex-wrap gap-2">
                {lifestyleTags.map((tag) => (
                  <button
                    key={tag.value}
                    type="button"
                    onClick={() => toggleTag(tag.value)}
                    className={`
                      px-3 py-1.5 rounded-full text-sm font-medium transition-all
                      ${tags.includes(tag.value)
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

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Изображения
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-xl overflow-hidden bg-slate-100"
                  >
                    <img
                      src={img}
                      alt={`Изображение ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== index))}
                      className="absolute top-1 right-1 p-1 bg-white/90 rounded-full shadow-sm hover:bg-white"
                    >
                      <X className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                ))}
                {images.length < 4 && (
                  <button
                    type="button"
                    onClick={() => {
                      const unusedImages = defaultImages.filter(
                        (img) => !images.includes(img)
                      );
                      if (unusedImages.length > 0) {
                        setImages([...images, unusedImages[0]]);
                      }
                    }}
                    className="aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-400 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-blue-500 transition-colors"
                  >
                    <Upload className="w-6 h-6" />
                    <span className="text-xs">Добавить</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Выберите до 4 изображений для вашего объявления
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Link to="/" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Отмена
                </Button>
              </Link>
              <Button
                type="submit"
                className="flex-1"
                isLoading={isLoading}
              >
                Опубликовать
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
