import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '../store';
import { authService, listingsService } from '../api';
import { Button, Card, ListingCard, Skeleton } from '../components';
import { MessageSquare, User as UserIcon, MapPin } from 'lucide-react';
import type { User, Listing } from '../types';

export const PublicProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuthStore();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isCurrentUser = currentUser?.id === userId;

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      if (userId) {
        // Fetch user info
        const userRes = await authService.getUserById(userId);
        if (userRes.success && userRes.data) {
          setProfileUser(userRes.data);
        }

        // Fetch user's listings
        const listingsRes = await listingsService.getListings();
        if (listingsRes.success && listingsRes.data) {
          const filtered = listingsRes.data.filter((l) => l.owner.id === userId);
          setUserListings(filtered);
        }
      }
      setIsLoading(false);
    };

    fetchProfileData();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Skeleton height={120} width={120} className="rounded-full flex-shrink-0" />
              <div className="flex-1 w-full text-center md:text-left space-y-3">
                <Skeleton height={32} width="40%" />
                <Skeleton height={20} width="20%" />
                <Skeleton height={60} width="80%" />
              </div>
            </div>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <Skeleton height={300} className="rounded-2xl" />
             <Skeleton height={300} className="rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Пользователь не найден</h1>
          <p className="text-slate-500 mb-4">Возможно, профиль был удален.</p>
          <Link to="/">
            <Button>На главную</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <Card className="p-8 mb-8 relative">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
              {profileUser.avatar ? (
                <img src={profileUser.avatar} alt={profileUser.name} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400" />
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                {profileUser.name}
              </h1>

              <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500 mb-4">
                <MapPin className="w-4 h-4" />
                <span>{profileUser.city}</span>
                <span className="mx-2">•</span>
                <span>На сайте с {new Date(profileUser.createdAt).toLocaleDateString('ru-RU')}</span>
              </div>

              {profileUser.bio ? (
                <p className="text-slate-700 max-w-2xl">{profileUser.bio}</p>
              ) : (
                <p className="text-slate-400 italic">Нет описания</p>
              )}
            </div>

            <div className="mt-4 md:mt-0 flex-shrink-0 flex justify-center md:justify-end w-full md:w-auto">
              {!isCurrentUser && (
                <Link to={`/chat/${userId}`}>
                  <Button size="lg" className="gap-2 w-full md:w-auto">
                    <MessageSquare className="w-5 h-5" />
                    Написать сообщение
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </Card>

        {/* User Listings */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Объявления пользователя ({userListings.length})
          </h2>

          {userListings.length === 0 ? (
            <Card className="p-8 text-center text-slate-500">
              У этого пользователя пока нет активных объявлений.
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
