import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-zinc-200 ${onClick ? 'cursor-pointer hover:border-zinc-400 transition-colors' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
