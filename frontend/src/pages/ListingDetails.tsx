import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Users, 
  Heart, 
  ArrowLeft, 
  Calendar, 
  Check,
  User
} from 'lucide-react';
import { Button, Card, TagsList, Skeleton } from '../components';
import { useListingsStore, useInterestsStore, useAuthStore } from '../store';
import { interestsService } from '../api';
import type { Listing } from '../types';

const housingTypeLabels = {
  room: 'Комната',
  apartment: 'Квартира',
  house: 'Дом',
  roommate: 'Ищу соседа',
};

export const ListingDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { listings } = useListingsStore();
  const { interests, addInterest } = useInterestsStore();
  const { user, isAuthenticated } = useAuthStore();
  
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isSendingInterest, setIsSendingInterest] = useState(false);

  useEffect(() => {
    const foundListing = listings.find((l) => l.id === id);
    setListing(foundListing || null);
    setIsLoading(false);

    // Check if already interested
    if (user && foundListing) {
      const alreadyInterested = interests.some(
        (i) => i.listing.id === foundListing.id && i.interestedUser.id === user.id
      );
      setIsSaved(alreadyInterested);
    }
  }, [id, listings, interests, user]);

  const handleSendInterest = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    if (!listing) return;

    setIsSendingInterest(true);
    await interestsService.sendInterest(listing);
    setIsSaved(true);
    setIsSendingInterest(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <Skeleton height={400} className="rounded-2xl mb-6" />
          <div className="space-y-4">
            <Skeleton height={32} width="60%" />
            <Skeleton height={20} width="40%" />
            <Skeleton height={100} />
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Объявление не найдено</h1>
          <p className="text-slate-500 mb-4">Объявление с таким ID не существует</p>
          <Link to="/">
            <Button>Вернуться на главную</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к объявлениям
        </Link>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Main Image */}
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-200">
            <img
              src={listing.images[selectedImage] || listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Thumbnail Grid */}
          <div className="grid grid-cols-2 gap-4">
            {listing.images.slice(1, 5).map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index + 1)}
                className={`
                  aspect-[4/3] rounded-xl overflow-hidden bg-slate-200
                  transition-all duration-200
                  ${selectedImage === index + 1 ? 'ring-2 ring-blue-600' : 'hover:opacity-90'}
                `}
              >
                <img
                  src={image}
                  alt={`${listing.title} - фото ${index + 2}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                  {housingTypeLabels[listing.housingType]}
                </span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm">
                  {listing.city}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                {listing.title}
              </h1>
              <div className="flex items-center gap-4 mt-3 text-slate-500">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{listing.city}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{listing.capacity} мест</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{listing.availableSpots} св. мест</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Удобства</h2>
              <TagsList tags={listing.tags} />
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Описание</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {listing.description}
              </p>
            </div>

            {/* Owner */}
            <Card className="p-4">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Владелец</h2>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  {listing.owner.avatar ? (
                    <img
                      src={listing.owner.avatar}
                      alt={listing.owner.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{listing.owner.name}</h3>
                  <p className="text-slate-500 text-sm">{listing.owner.city}</p>
                  {listing.owner.bio && (
                    <p className="text-slate-600 text-sm mt-2">{listing.owner.bio}</p>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20 p-6">
              <div className="text-center mb-6">
                <p className="text-slate-500 text-sm">Цена в месяц</p>
                <p className="text-3xl font-bold text-slate-900">
                  {formatPrice(listing.price)} ₸
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleSendInterest}
                  isLoading={isSendingInterest}
                  disabled={isSaved}
                >
                  {isSaved ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Интерес отправлен
                    </>
                  ) : (
                    'Отправить интерес'
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsSaved(!isSaved)}
                >
                  <Heart className={`w-5 h-5 mr-2 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                  {isSaved ? 'Сохранено' : 'Сохранить'}
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-xs text-slate-400 text-center">
                  Опубликовано {new Date(listing.createdAt).toLocaleDateString('ru-RU')}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
