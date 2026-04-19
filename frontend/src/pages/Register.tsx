import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Home, MapPin } from 'lucide-react';
import { Button, Input, Select, Card } from '../components';
import { authService } from '../api';
import { useAuthStore } from '../store';
import { KAZAKHSTAN_CITIES, type KazakhstanCity } from '../types';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { login, setLoading, setDemoMode } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [city, setCity] = useState<KazakhstanCity | ''>('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const cityOptions = KAZAKHSTAN_CITIES.map((c) => ({ value: c, label: c }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }

    if (!city) {
      setError('Пожалуйста, выберите город');
      return;
    }

    setIsLoading(true);
    setLoading(true);
    setDemoMode(false); // standard registration clears demo mode

    try {
      const response = await authService.register({
        name,
        email,
        password,
        city: city as KazakhstanCity,
      });

      if (response.success && response.data) {
        login(response.data);
        navigate('/');
      } else {
        setError(response.error || 'Ошибка регистрации');
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
          <h1 className="text-xl font-semibold text-slate-900 mb-6">Создание аккаунта</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Имя"
              type="text"
              placeholder="Ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User className="w-4 h-4" />}
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder="example@mail.ru"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
            />

            <Select
              label="Город"
              value={city}
              onChange={(e) => setCity(e.target.value as KazakhstanCity)}
              options={cityOptions}
              placeholder="Выберите ваш город"
            />

            <Input
              label="Пароль"
              type="password"
              placeholder="Минимум 6 символов"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              required
            />

            <Input
              label="Подтверждение пароля"
              type="password"
              placeholder="Повторите пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              Зарегистрироваться
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-500">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">
                Войти
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
