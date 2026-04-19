import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  show?: boolean;
}

export const FloatingActionButton = ({ show = true }: FloatingActionButtonProps) => {
  if (!show) return null;

  return (
    <Link
      to="/create-listing"
      className="fixed bottom-6 right-6 z-40 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 hover:scale-110 group"
      title="Создать объявление"
    >
      <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
    </Link>
  );
};
