'use client';

import { Badge } from '@/components/ui/badge';
import { RATING_CONFIG, type Rating } from '@/types/stock';

interface RatingBadgeProps {
  rating: Rating;
  className?: string;
}

/** Colored badge for stock ratings (Strong Buy → Strong Sell) */
export function RatingBadge({ rating, className = '' }: RatingBadgeProps) {
  const config = RATING_CONFIG[rating];

  return (
    <Badge variant="outline" className={`${config.color} ${config.bg} border-0 font-semibold ${className}`}>
      {config.label}
    </Badge>
  );
}
