import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '../store';
import { Button } from '../components';
import { MessageSquare } from 'lucide-react';

export const PublicProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuthStore();

  const isCurrentUser = user?.id === userId;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Public Profile</h1>
          <p className="text-slate-500">Profile page for user ID: {userId}</p>
        </div>

        {!isCurrentUser && (
          <Link to={`/chat/${userId}`} className="inline-block">
            <Button className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Написать сообщение
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
