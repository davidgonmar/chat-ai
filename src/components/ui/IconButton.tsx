import { cn } from '@/lib/cn';
import { cva, VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';

export const iconButtonVariants = cva(
  'bg-slate-800 hover:bg-slate-700 p-1 rounded-md transition-all duration-75 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default: '',
        bordered: 'border-2 border-white/30',
      },
    },
  }
);
interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant, className, children, ...props }, ref) => {
    return (
      <button
        {...props}
        ref={ref}
        className={cn(iconButtonVariants({ variant, className }))}
      >
        {children}
      </button>
    );
  }
);
IconButton.displayName = 'IconButton';

export default IconButton;
