import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Mail, 
  Calendar, 
  Edit, 
  Home, 
  Heart,
  Settings,
  LogOut,
  Plus,
  Eye,
  Trash2,
  Phone,
  Globe,
  Inbox
} from 'lucide-react';
import { Button, Card, Badge, Input, Textarea, Select } from '../components';
import { useAuthStore, useListingsStore, useInterestsStore, useLanguageStore, useSettingsStore } from '../store';
import { t } from '../i18n';
import { listingsService } from '../api';
import { KAZAKHSTAN_CITIES, type KazakhstanCity } from '../types';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, login } = useAuthStore();
  const { listings } = useListingsStore();
  const { interests } = useInterestsStore();
  const { language, setLanguage } = useLanguageStore();
  const { notifications, emailSubscription, toggleNotifications, toggleEmailSubscription } = useSettingsStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedCity, setEditedCity] = useState<KazakhstanCity | ''>(user?.city || '');
  const [editedBio, setEditedBio] = useState(user?.bio || '');
  const [editedPhone, setEditedPhone] = useState(user?.phone || '');
  const [editedAvatar, setEditedAvatar] = useState(user?.avatar || '');
  const [avatarError, setAvatarError] = useState('');
  const [activeTab, setActiveTab] = useState<'listings' | 'clientInterests' | 'interests' | 'settings'>('listings');

  // Get user's listings
  const userListings = listings.filter((l) => l.owner.id === user?.id);
  
  // Get user's interests (listings they are interested in)
  const userInterests = interests.filter((i) => i.interestedUser.id === user?.id);
  const myListingsInterests = interests.filter((i) => i.listing.owner.id === user?.id);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setAvatarError('Только изображения (PNG, JPG, JPEG)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('Файл должен быть меньше 5МБ');
      return;
    }

    setEditedAvatar(URL.createObjectURL(file));
  };

  const handleSaveProfile = () => {
    if (user && editedName) {
      login({
        ...user,
        name: editedName,
        city: editedCity as KazakhstanCity,
        bio: editedBio,
        phone: editedPhone,
        avatar: editedAvatar,
      });
      setIsEditing(false);
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    if (confirm('Вы уверены, что хотите удалить это объявление?')) {
      await listingsService.deleteListing(listingId);
    }
  };

  const cityOptions = KAZAKHSTAN_CITIES.map((c) => ({ value: c, label: c }));

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-blue-100 rounded-2xl flex items-center justify-center overflow-hidden relative group">
                {(isEditing ? editedAvatar : user.avatar) ? (
                  <img
                    src={(isEditing ? editedAvatar : user.avatar) as string}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-blue-600" />
                )}
                {isEditing && (
                  <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Edit className="w-6 h-6 mb-1" />
                    <span className="text-xs">Сменить</span>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                )}
              </div>
              {isEditing && avatarError && (
                <p className="text-xs text-red-500 mt-2 text-center max-w-[128px]">
                  {avatarError}
                </p>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    label="Имя"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                  <Select
                    label="Город"
                    value={editedCity}
                    onChange={(e) => setEditedCity(e.target.value as KazakhstanCity)}
                    options={cityOptions}
                    placeholder="Выберите город"
                  />
                  <Input
                    label="Телефон"
                    type="tel"
                    placeholder="+7 (777) 123-45-67"
                    value={editedPhone}
                    onChange={(e) => setEditedPhone(e.target.value)}
                    icon={<Phone className="w-4 h-4" />}
                  />
                  <Textarea
                    label="О себе"
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    placeholder="Расскажите о себе..."
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile}>Сохранить</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Отмена</Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
                      <div className="flex items-center gap-2 mt-1 text-slate-500">
                        <MapPin className="w-4 h-4" />
                        <span>{user.city}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-slate-500">
                        <Mail className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2 mt-1 text-slate-500">
                          <Phone className="w-4 h-4" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      Редактировать
                    </Button>
                  </div>
                  
                  {user.bio && (
                    <p className="mt-4 text-slate-600">{user.bio}</p>
                  )}
                  
                  <div className="flex items-center gap-2 mt-4 text-slate-400 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>На Dwello с {new Date(user.createdAt).toLocaleDateString('ru-RU')}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{userListings.length}</div>
            <div className="text-sm text-slate-500">{t('myListings', language)}</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{userInterests.length}</div>
            <div className="text-sm text-slate-500">{t('myInterests', language)}</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {userInterests.filter((i) => i.status === 'accepted').length}
            </div>
            <div className="text-sm text-slate-500">Принято</div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('listings')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all
              ${activeTab === 'listings'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
              }
            `}
          >
            <Home className="w-4 h-4" />
            {t('myListings', language)}
          </button>
          <button
            onClick={() => setActiveTab('clientInterests')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all
              ${activeTab === 'clientInterests'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
              }
            `}
          >
            <Inbox className="w-4 h-4" />
            Отклики клиентов
          </button>
          <button
            onClick={() => setActiveTab('interests')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all
              ${activeTab === 'interests'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
              }
            `}
          >
            <Heart className="w-4 h-4" />
            {t('myInterests', language)}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all
              ${activeTab === 'settings'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
              }
            `}
          >
            <Settings className="w-4 h-4" />
            {t('settings', language)}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'listings' && (
          <div className="space-y-4">
            {userListings.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="w-8 h-8 text-slate-400" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 mb-2">
                  Пока нет объявлений
                </h2>
                <p className="text-slate-500 mb-4">
                  Создайте свое первое объявление
                </p>
                <Link to="/create-listing">
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Создать объявление
                  </Button>
                </Link>
              </Card>
            ) : (
              userListings.map((listing) => (
                <Card key={listing.id} className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/listing/${listing.id}`}
                        className="font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                      >
                        {listing.title}
                      </Link>
                      <p className="text-sm text-slate-500 mt-1">
                        {listing.city} • {listing.price.toLocaleString()} ₸/мес
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="info">{listing.housingType}</Badge>
                        <Badge variant="default">{listing.capacity} мест</Badge>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link to={`/listing/${listing.id}`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Eye className="w-3 h-3" />
                          Просмотр
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-red-500 hover:bg-red-50"
                        onClick={() => handleDeleteListing(listing.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                        Удалить
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'clientInterests' && (
          <div className="space-y-4">
            {myListingsInterests && myListingsInterests.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Inbox className="w-8 h-8 text-slate-400" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 mb-2">
                  Пока нет откликов
                </h2>
                <p className="text-slate-500 mb-4">
                  Когда кто-то откликнется на ваше объявление, вы увидите это здесь
                </p>
              </Card>
            ) : (
              myListingsInterests && myListingsInterests.map((interest) => (
                <Card key={interest.id} className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={interest.listing.images[0]}
                      alt={interest.listing.title}
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/listing/${interest.listing.id}`}
                        className="font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                      >
                        {interest.listing.title}
                      </Link>
                      <p className="text-sm text-slate-500 mt-1">
                        От: <Link to={`/profile/${interest.interestedUser.id}`} className="text-blue-600 hover:underline">{interest.interestedUser.name}</Link>
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant={interest.status === 'accepted' ? 'success' :
                                  interest.status === 'rejected' ? 'default' : 'warning'}
                        >
                          {interest.status === 'pending' ? 'Ожидает' :
                           interest.status === 'accepted' ? 'Принято' : 'Отклонено'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'interests' && (
          <div className="space-y-4">
            {userInterests.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-slate-400" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 mb-2">
                  Пока нет интересов
                </h2>
                <p className="text-slate-500 mb-4">
                  Начните просматривать объявления
                </p>
                <Link to="/">
                  <Button>Найти жильё</Button>
                </Link>
              </Card>
            ) : (
              userInterests.map((interest) => (
                <Card key={interest.id} className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={interest.listing.images[0]}
                      alt={interest.listing.title}
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/listing/${interest.listing.id}`}
                        className="font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                      >
                        {interest.listing.title}
                      </Link>
                      <p className="text-sm text-slate-500 mt-1">
                        {interest.listing.city} • {interest.listing.price.toLocaleString()} ₸/мес
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge 
                          variant={interest.status === 'accepted' ? 'success' : 
                                  interest.status === 'rejected' ? 'default' : 'warning'}
                        >
                          {interest.status === 'pending' ? 'Ожидает' : 
                           interest.status === 'accepted' ? 'Принято' : 'Отклонено'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">{t('accountSettings', language)}</h2>
            <div className="space-y-4">
              {/* Language Settings */}
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium text-slate-900">{t('interfaceLanguage', language)}</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLanguage('ru')}
                    className={`
                      flex-1 py-2.5 px-4 rounded-xl font-medium transition-all duration-200
                      ${language === 'ru' 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 scale-105' 
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }
                    `}
                  >
                    Русский
                  </button>
                  <button
                    onClick={() => setLanguage('kk')}
                    className={`
                      flex-1 py-2.5 px-4 rounded-xl font-medium transition-all duration-200
                      ${language === 'kk' 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 scale-105' 
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }
                    `}
                  >
                    Қазақша
                  </button>
                </div>
              </div>
              
              {/* Notifications Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <h3 className="font-medium text-slate-900">{t('notifications', language)}</h3>
                  <p className="text-sm text-slate-500">{t('notificationsDesc', language)}</p>
                </div>
                <button 
                  onClick={toggleNotifications}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${notifications ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <span 
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${notifications ? 'right-1' : 'left-1'}`} 
                  />
                </button>
              </div>
              
              {/* Email Subscription Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <h3 className="font-medium text-slate-900">{t('emailSubscription', language)}</h3>
                  <p className="text-sm text-slate-500">{t('emailSubscriptionDesc', language)}</p>
                </div>
                <button 
                  onClick={toggleEmailSubscription}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${emailSubscription ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <span 
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${emailSubscription ? 'right-1' : 'left-1'}`} 
                  />
                </button>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <Button
                  variant="outline"
                  className="w-full gap-2 text-red-600 hover:bg-red-50 hover:border-red-200"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  {t('logout', language)}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
