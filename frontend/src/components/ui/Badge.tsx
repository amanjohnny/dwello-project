import clsx from 'clsx';
import type { LifestyleTag } from '../../types';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'info' | 'outline';
  className?: string;
  children: React.ReactNode;
}

export const Badge = ({ variant = 'default', className, children }: BadgeProps) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    info: 'bg-blue-100 text-blue-700',
    outline: 'bg-white border border-slate-200 text-slate-600',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

// Tag labels in Russian
const tagLabels: Record<LifestyleTag, string> = {
  'student-friendly': 'Студентам',
  'quiet': 'Тихий',
  'social': 'Социальный',
  'no-smoking': 'Без курения',
  'pets-allowed': 'Можно с питомцами',
};

const tagVariants: Record<LifestyleTag, 'info' | 'success' | 'warning' | 'default'> = {
  'student-friendly': 'info',
  'quiet': 'success',
  'social': 'warning',
  'no-smoking': 'default',
  'pets-allowed': 'success',
};

interface TagBadgeProps {
  tag: LifestyleTag;
}

export const TagBadge = ({ tag }: TagBadgeProps) => {
  return (
    <Badge variant={tagVariants[tag]}>
      {tagLabels[tag]}
    </Badge>
  );
};

interface TagsListProps {
  tags: LifestyleTag[];
  className?: string;
}

export const TagsList = ({ tags, className }: TagsListProps) => {
  return (
    <div className={clsx('flex flex-wrap gap-1.5', className)}>
      {tags.map((tag) => (
        <TagBadge key={tag} tag={tag} />
      ))}
    </div>
  );
};
