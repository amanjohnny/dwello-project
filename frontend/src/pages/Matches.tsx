import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Users, Clock, Check, X, User, ArrowRight } from 'lucide-react';
import { Button, Card, Badge } from '../components';
import { useAuthStore, useInterestsStore, useListingsStore } from '../store';
import { interestsService } from '../api';
import type { Interest, InterestStatus } from '../types';

const statusLabels: Record<InterestStatus, { label: string; variant: 'warning' | 'success' | 'default' }> = {
  pending: { label: 'Ожидает', variant: 'warning' },
  accepted: { label: 'Принято', variant: 'success' },
  rejected: { label: 'Отклонено', variant: 'default' },
};

export const MatchesPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { interests } = useInterestsStore();
  const { listings } = useListingsStore();
  
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent');
  const [myListingsInterests, setMyListingsInterests] = useState<Interest[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Get interests for my listings (received)
    const userListings = listings.filter((l) => l.owner.id === user?.id);
    const receivedInterests = interests.filter((i) =>
      userListings.some((l) => l.id === i.listing.id)
    );
    setMyListingsInterests(receivedInterests);
  }, [isAuthenticated, user, interests, listings, navigate]);

  const sentInterests = interests.filter((i) => i.interestedUser.id === user?.id);

  const handleUpdateStatus = async (interestId: string, status: InterestStatus) => {
    await interestsService.updateInterestStatus(interestId, status);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Интересы</h1>
          <p className="text-slate-500 mt-1">Отслеживайте ваши отклики и отклики на ваши объявления</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('sent')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all
              ${activeTab === 'sent'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
              }
            `}
          >
            <Heart className="w-4 h-4" />
            Мои отклики
            {sentInterests.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-xs">
                {sentInterests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('received')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all
              ${activeTab === 'received'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
              }
            `}
          >
            <Users className="w-4 h-4" />
            На мои объявления
            {myListingsInterests.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-xs">
                {myListingsInterests.length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        {activeTab === 'sent' ? (
          /* Sent Interests */
          <div className="space-y-4">
            {sentInterests.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-slate-400" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 mb-2">
                  Пока нет откликов
                </h2>
                <p className="text-slate-500 mb-4">
                  Начните просматривать объявления и отправлять интерес
                </p>
                <Link to="/">
                  <Button>Найти жильё</Button>
                </Link>
              </Card>
            ) : (
              sentInterests.map((interest) => (
                <Card key={interest.id} className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Listing Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <img
                          src={interest.listing.images[0]}
                          alt={interest.listing.title}
                          className="w-20 h-20 rounded-xl object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/listing/${interest.listing.id}`}
                            className="font-semibold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1"
                          >
                            {interest.listing.title}
                          </Link>
                          <p className="text-sm text-slate-500">
                            {interest.listing.city} • {interest.listing.price.toLocaleString()} ₸/мес
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant={statusLabels[interest.status].variant}>
                              {statusLabels[interest.status].label}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 sm:flex-col">
                      <Link to={`/listing/${interest.listing.id}`}>
                        <Button variant="outline" size="sm" className="w-full gap-1">
                          Подробнее
                          <ArrowRight className="w-3 h-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        ) : (
          /* Received Interests */
          <div className="space-y-4">
            {myListingsInterests.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-slate-400" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 mb-2">
                  Пока нет откликов
                </h2>
                <p className="text-slate-500 mb-4">
                  Опубликуйте объявление, чтобы получать отклики
                </p>
                <Link to="/create-listing">
                  <Button>Создать объявление</Button>
                </Link>
              </Card>
            ) : (
              myListingsInterests.map((interest) => (
                <Card key={interest.id} className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="w-20 h-20 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          {interest.interestedUser.avatar ? (
                            <img
                              src={interest.interestedUser.avatar}
                              alt={interest.interestedUser.name}
                              className="w-full h-full rounded-xl object-cover"
                            />
                          ) : (
                            <User className="w-8 h-8 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900">
                            {interest.interestedUser.name}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {interest.interestedUser.city}
                          </p>
                          <p className="text-sm text-slate-600 mt-1">
                            Интересуется: <strong>{interest.listing.title}</strong>
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant={statusLabels[interest.status].variant}>
                              {statusLabels[interest.status].label}
                            </Badge>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(interest.createdAt).toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {interest.status === 'pending' && (
                      <div className="flex gap-2 sm:flex-col">
                        <Button
                          size="sm"
                          className="gap-1"
                          onClick={() => handleUpdateStatus(interest.id, 'accepted')}
                        >
                          <Check className="w-3 h-3" />
                          Принять
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() => handleUpdateStatus(interest.id, 'rejected')}
                        >
                          <X className="w-3 h-3" />
                          Отклонить
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
