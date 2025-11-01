import React from 'react';
import { cn } from '../../utils/cn';

const LoadingSkeleton = ({ className, variant = 'default' }) => {
  const variants = {
    default: 'h-4 bg-gray-700 rounded animate-pulse',
    text: 'h-4 bg-gray-700 rounded animate-pulse',
    heading: 'h-8 bg-gray-700 rounded animate-pulse',
    image: 'h-48 bg-gray-700 rounded animate-pulse',
    card: 'h-64 bg-gray-700 rounded-lg animate-pulse',
    button: 'h-10 bg-gray-700 rounded animate-pulse',
  };

  return <div className={cn(variants[variant], className)} />;
};

export const SkeletonText = ({ lines = 3, className }) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <LoadingSkeleton key={i} variant="text" className={i === lines - 1 ? 'w-3/4' : 'w-full'} />
    ))}
  </div>
);

export const SkeletonCard = ({ className }) => (
  <div className={cn('p-4 space-y-4', className)}>
    <LoadingSkeleton variant="image" className="w-full" />
    <LoadingSkeleton variant="heading" className="w-2/3" />
    <SkeletonText lines={2} />
  </div>
);

export const SkeletonGrid = ({ items = 4, className }) => (
  <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
    {Array.from({ length: items }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default LoadingSkeleton;

