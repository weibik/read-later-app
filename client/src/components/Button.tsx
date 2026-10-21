import type { ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  type?: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

const variants: Record<'primary' | 'ghost', string> = {
  primary: 'bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700',
  ghost:
    'border border-gray-300 bg-white px-3 py-1.5 text-gray-700 hover:bg-gray-50',
};

function Button({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  disabled,
  className = '',
}: ButtonProps) {
  return (
    <button
      className={`rounded-lg text-sm font-medium focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-indigo-500 ${variants[variant]} ${className}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
