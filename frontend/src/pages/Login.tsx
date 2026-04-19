import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Home } from 'lucide-react';
import { Button, Input, Card } from '../components';
import { authService } from '../api';
import { useAuthStore } from '../store';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, setLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      
      if (response.success && response.data) {
        login(response.data);
        navigate('/');
      } else {
        setError(response.error || 'Ошибка входа');
      }
    } catch (err) {
      setError('Произошла ошибка. Попробуйте снова.');
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">Dwello</span>
          </Link>
          <p className="mt-2 text-slate-500">Найди идеальное жильё в Казахстане</p>
        </div>

        <Card className="p-6">
          <h1 className="text-xl font-semibold text-slate-900 mb-6">Вход в аккаунт</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="example@mail.ru"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Пароль"
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              required
            />

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              Войти
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-500">
              Нет аккаунта?{' '}
              <Link to="/register" className="text-blue-600 hover:underline font-medium">
                Зарегистрироваться
              </Link>
            </p>
          </div>

          {/* Demo hint */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700">
              <strong>Демо режим:</strong> Введите любой email и пароль "demo123" для входа
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
