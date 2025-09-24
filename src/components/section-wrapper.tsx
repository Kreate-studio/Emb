import { cn } from '@/lib/utils';
import React from 'react';

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

const SectionWrapper = ({
  children,
  className,
  id,
  ...props
}: SectionProps) => {
  return (
    <section
      id={id}
      className={cn(
        'relative py-16 md:py-28 lg:py-32 overflow-hidden',
        className
      )}
      {...props}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {children}
      </div>
    </section>
  );
};

export default SectionWrapper;
