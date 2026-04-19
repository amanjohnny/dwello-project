import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, User, Menu, X, LogOut, Heart, UserCircle } from 'lucide-react';
import { useAuthStore, useLanguageStore } from '../store';
import { t } from '../i18n';
import { Button } from './ui';

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { language } = useLanguageStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="text-xl font-bold text-slate-900">Dwello</span>
          </Link>

          {/* Search Button - Opens Search Page */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <button
              onClick={() => navigate('/search')}
              className="flex w-full items-center gap-3 px-4 py-2 bg-slate-100 rounded-full text-slate-400 hover:bg-slate-200 transition-colors"
            >
              <SearchIcon className="w-4 h-4" />
              <span>{t('searchPlaceholder', language)}</span>
            </button>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/search">
                  <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors" title="Поиск">
                    <SearchIcon className="w-5 h-5" />
                  </button>
                </Link>
                <Link to="/matches">
                  <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors" title="Интересы">
                    <Heart className="w-5 h-5" />
                  </button>
                </Link>
                <Link to="/profile">
                  <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors" title="Профиль">
                    <UserCircle className="w-5 h-5" />
                  </button>
                </Link>
                <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                    title="Выйти"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <Button size="sm">Войти</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
          md:hidden absolute top-16 left-0 right-0 bg-white border-b border-slate-100 shadow-lg transition-all duration-300
          ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
      >
        <div className="p-4 space-y-4">
          {/* Mobile Search Button */}
          <button
            onClick={() => {
              setIsMenuOpen(false);
              navigate('/search');
            }}
            className="w-full flex items-center gap-3 p-3 bg-slate-100 rounded-xl text-slate-600"
          >
            <SearchIcon className="w-5 h-5" />
            Поиск
          </button>

          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-3 p-3 text-slate-700 hover:bg-slate-50 rounded-xl"
                onClick={() => setIsMenuOpen(false)}
              >
                <UserCircle className="w-5 h-5" />
                Профиль
              </Link>
              <Link
                to="/matches"
                className="flex items-center gap-3 p-3 text-slate-700 hover:bg-slate-50 rounded-xl"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="w-5 h-5" />
                Интересы
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-xl w-full"
              >
                <LogOut className="w-5 h-5" />
                Выйти
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block"
              onClick={() => setIsMenuOpen(false)}
            >
              <Button className="w-full">Войти</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
