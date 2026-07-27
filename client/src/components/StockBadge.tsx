import { CheckCircle2, AlertCircle } from 'lucide-react';

interface StockBadgeProps {
  isAvailable: boolean;
  language: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function StockBadge({ 
  isAvailable, 
  language, 
  size = 'md',
  showText = true,
  className = ''
}: StockBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-2',
    lg: 'px-4 py-2 text-base gap-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  if (isAvailable) {
    return (
      <div className={`flex items-center ${sizeClasses[size]} bg-emerald-100 text-emerald-700 rounded-full font-medium ${className}`}>
        <CheckCircle2 className={iconSizes[size]} />
        {showText && (
          <span>{language === 'ka' ? 'მარაგშია' : 'In Stock'}</span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center ${sizeClasses[size]} bg-rose-100 text-rose-700 rounded-full font-medium ${className}`}>
      <AlertCircle className={iconSizes[size]} />
      {showText && (
        <span>{language === 'ka' ? 'მარაგში არ არის' : 'Out of Stock'}</span>
      )}
    </div>
  );
}
