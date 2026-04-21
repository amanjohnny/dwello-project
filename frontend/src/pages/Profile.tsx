import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User as UserIcon, Mail, Calendar, Phone, Edit2, Plus, LogOut, Layout, Heart, Users, Camera, Loader2
} from 'lucide-react';
import { Button, Card, Badge, Input, Textarea, ListingCard } from '../components';
import { useAuthStore, useListingsStore, useInterestsStore } from '../store';
import { authService, listingsService, interestsService } from '../api';
import { supabase } from '../api/supabase';
import type { User, Interest } from '../types';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, logout, login } = useAuthStore();
  const { listings, setListings } = useListingsStore();
  const { interests } = useInterestsStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const [activeTab, setActiveTab] = useState<'listings' | 'interests' | 'client-interests'>('listings');
  const [clientInterests, setClientInterests] = useState<Interest[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadProfileData = async () => {
      // Загружаем объявления
      const listRes = await listingsService.getListings();
      if (listRes.success && listRes.data) {
        setListings(listRes.data);
      }
      // Загружаем мои отклики
      await interestsService.getInterests();
      // Загружаем отклики клиентов (исправлено)
      const clientRes = await interestsService.getMyListingsInterests();
      if (clientRes.success && clientRes.data) {
        setClientInterests(clientRes.data);
      }
    };

    loadProfileData();
    // Инициализируем форму только если мы не в процессе редактирования
    if (!isEditing) {
      setEditedUser(user);
    }
  }, [user, navigate, setListings]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const response = await authService.updateProfile(user.id, { avatar: publicUrl });
      if (response.success && response.data) {
        login(response.data);
      }
    } catch (error: any) {
      alert('Ошибка загрузки: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    const response = await authService.updateProfile(user.id, editedUser);
    if (response.success && response.data) {
      login(response.data);
      setIsEditing(false);
    } else {
      alert('Ошибка сохранения: ' + response.error);
    }
    setIsSaving(false);
  };

  if (!user) return null;

  const userListings = listings.filter((l) => l.owner.id === user.id);
  const myInterests = interests.filter((i) => i.interestedUser.id === user.id);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-sm transition-opacity group-hover:opacity-75">
                    {isUploading ? <Loader2 className="w-8 h-8 animate-spin" /> : 
                      (user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <UserIcon className="w-16 h-16 text-blue-600" />)}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                </div>
                
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-slate-500 text-sm mb-4">{user.city}</p>
                
                <div className="w-full space-y-3 text-left mb-6">
                  <div className="flex items-center gap-3 text-slate-600 text-sm">
                    <Mail className="w-4 h-4" /> <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 text-sm">
                    <Phone className="w-4 h-4" /> <span>{user.phone || 'Не указан'}</span>
                  </div>
                </div>

                <Button variant="outline" onClick={() => setIsEditing(true)} className="w-full mb-2">
                  <Edit2 className="w-4 h-4 mr-2" /> Изменить данные
                </Button>
                <Button variant="outline" onClick={() => { authService.logout(); logout(); navigate('/'); }} className="w-full text-red-500">
                  <LogOut className="w-4 h-4 mr-2" /> Выйти
                </Button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {isEditing && (
              <Card className="p-6 mb-8 border-2 border-blue-100">
                <h3 className="font-bold mb-4">Редактирование профиля</h3>
                <div className="space-y-4">
                  <Input label="Имя" value={editedUser.name || ''} onChange={(e) => setEditedUser({...editedUser, name: e.target.value})} />
                  <Input label="Телефон" value={editedUser.phone || ''} onChange={(e) => setEditedUser({...editedUser, phone: e.target.value})} />
                  <Textarea label="О себе" value={editedUser.bio || ''} onChange={(e) => setEditedUser({...editedUser, bio: e.target.value})} />
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile} isLoading={isSaving}>Сохранить</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Отмена</Button>
                  </div>
                </div>
              </Card>
            )}

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              <button onClick={() => setActiveTab('listings')} className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${activeTab === 'listings' ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                Мои объявления ({userListings.length})
              </button>
              <button onClick={() => setActiveTab('interests')} className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${activeTab === 'interests' ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                Мои отклики ({myInterests.length})
              </button>
              <button onClick={() => setActiveTab('client-interests')} className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${activeTab === 'client-interests' ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                Отклики клиентов ({clientInterests.length})
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeTab === 'listings' && userListings.map(l => <ListingCard key={l.id} listing={l} />)}
              {activeTab === 'interests' && myInterests.map(i => <ListingCard key={i.id} listing={i.listing} isInterested />)}
              {activeTab === 'client-interests' && clientInterests.map(i => (
                <Card key={i.id} className="p-4 flex items-center justify-between col-span-full">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-full overflow-hidden">
                      {i.interestedUser.avatar && <img src={i.interestedUser.avatar} className="w-full h-full object-cover" />}
                    </div>
                    <div>
                      <h4 className="font-bold">{i.interestedUser.name}</h4>
                      <p className="text-sm text-slate-500">Пост: {i.listing.title}</p>
                    </div>
                  </div>
                  <Badge variant={i.status === 'accepted' ? 'success' : 'warning'}>{i.status === 'pending' ? 'Ожидает' : 'Принято'}</Badge>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};