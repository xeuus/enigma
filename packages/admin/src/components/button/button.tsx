import classNames from 'classnames';
import React, { FC, PropsWithChildren } from 'react';

export const Button: FC<
  PropsWithChildren<{
    className?: string;
    tooltip?: string;
    type?: 'primary' | 'secondary' | 'succeed' | 'danger';
    onClick?: () => void;
    disabled?: boolean;
  }>
> = ({ children, tooltip, className, onClick, disabled, type = 'primary' }) => {
  return (
    <button
      onClick={onClick}
      className={classNames(
        'flex items-center justify-center h-10 gap-2 px-4 disabled:opacity-80 focus:ring-2 focus:ring-blue-500 focus:outline-none',
        {
          'text-white bg-green-500 hover:bg-green-600': type === 'succeed',
          'text-white bg-red-500 hover:bg-red-600': type === 'danger',
          'text-white bg-blue-500 hover:bg-blue-600': type === 'primary',
          'text-black bg-white ring-1 ring-slate-300 hover:bg-slate-300':
            type === 'secondary',
          
        },
        className,
      )}
      title={tooltip}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
