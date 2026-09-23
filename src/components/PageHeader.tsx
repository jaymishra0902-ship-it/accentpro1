import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

export function PageHeader({ title, description, icon }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">{title}</h1>
      </div>
      <p className="text-sm sm:text-base text-zinc-500 max-w-2xl">{description}</p>
    </div>
  );
}
