import { useParams } from 'react-router-dom';

export const PublicProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Public Profile</h1>
        <p className="text-slate-500">Profile page for user ID: {userId}</p>
      </div>
    </div>
  );
};
