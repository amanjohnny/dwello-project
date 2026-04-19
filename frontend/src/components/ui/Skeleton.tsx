import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton = ({ 
  className, 
  variant = 'text', 
  width, 
  height 
}: SkeletonProps) => {
  const baseStyles = 'animate-pulse bg-slate-200';
  
  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={clsx(baseStyles, variants[variant], className)}
      style={{
        width: width || '100%',
        height: height || (variant === 'text' ? '1em' : undefined),
      }}
    />
  );
};

export const ListingCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <Skeleton variant="rectangular" height={200} className="w-full" />
      <div className="p-4 space-y-3">
        <Skeleton height={24} width="80%" />
        <Skeleton height={16} width="40%" />
        <Skeleton height={16} width="60%" />
        <div className="flex gap-2 pt-2">
          <Skeleton height={24} width={60} />
          <Skeleton height={24} width={60} />
        </div>
      </div>
    </div>
  );
};
