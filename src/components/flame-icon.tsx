import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LucideProps } from 'lucide-react';

export function FlameIcon({ className, ...props }: LucideProps) {
  return <Flame className={cn('text-accent', className)} {...props} />;
}
