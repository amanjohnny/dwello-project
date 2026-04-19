import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Users, Heart, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, TagsList, Button } from './ui';
import { useLanguageStore } from '../store';
import { t } from '../i18n';
import type { Listing } from '../types';

interface ListingCardProps {
  listing: Listing;
  onInterest?: (listing: Listing) => void;
  isInterested?: boolean;
}

export const ListingCard = ({ listing, onInterest, isInterested }: ListingCardProps) => {
  const { language } = useLanguageStore();
  const navigate = useNavigate();
  
  const housingTypeLabels = {
    room: t('room', language),
    apartment: t('apartment', language),
    house: 'Дом',
    roommate: t('roommate', language),
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₸';
  };

  const handleCardClick = () => {
    navigate(`/listing/${listing.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="h-full cursor-pointer"
      onClick={handleCardClick}
    >
      <Card hover className="overflow-hidden group h-full">
        {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={listing.images[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium text-slate-700">
            {housingTypeLabels[listing.housingType]}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 bg-blue-600/90 backdrop-blur-sm rounded-lg text-xs font-medium text-white">
            {formatPrice(listing.price)}{t('perMonth', language)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {listing.title}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-slate-500">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-sm">{listing.city}</span>
          </div>
        </div>

        <p className="text-sm text-slate-500 line-clamp-2">
          {listing.description}
        </p>

        {/* Tags */}
        <TagsList tags={listing.tags} />

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1 text-slate-500">
            <Users className="w-4 h-4" />
            <span className="text-sm">
              {listing.capacity} {listing.capacity === 1 ? 'место' : 'мест'}
              {listing.availableSpots > 0 && ` (${listing.availableSpots} ${t('availableSpots', language)})`}
            </span>
          </div>

          <div className="flex gap-2">
            <Link to={`/listing/${listing.id}`} onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="gap-1">
                <Eye className="w-3.5 h-3.5" />
                Подробнее
              </Button>
            </Link>
            <Button
              variant={isInterested ? 'primary' : 'outline'}
              size="sm"
              className="gap-1"
              onClick={(e) => {
                e.stopPropagation();
                onInterest?.(listing);
              }}
            >
              <Heart className={`w-3.5 h-3.5 ${isInterested ? 'fill-current' : ''}`} />
              {isInterested ? 'Интерес' : 'Интересно'}
            </Button>
          </div>
        </div>
      </div>
      </Card>
    </motion.div>
  );
};
