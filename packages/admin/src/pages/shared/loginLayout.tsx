import React, { FC, PropsWithChildren } from 'react';

import classNames from 'classnames';

export const LoginLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='flex flex-row h-screen'>
      <div className='flex flex-col items-center justify-center flex-1 px-6'>
        <div className='flex flex-col gap-6 sm:w-11/12 md:10/12 lg:w-9/12'>
          {children}
        </div>
      </div>
      <div className='relative flex-col items-center justify-center flex-1 hidden overflow-hidden group lg:flex bg-slate-200'>
        <div className='bg-red-500 rounded-full w-60 h-60' />
        <div className='absolute flex justify-center w-full text-2xl font-black text-red-500 select-none mt-72 h-80 bg-opacity-70 bg-slate-200 backdrop-blur-2xl' />
      </div>
    </div>
  );
};

export const FormHeader: FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => {
  return (
    <div className='flex flex-col gap-2'>
      <h1 className='flex-1 text-3xl font-bold'>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
};

export const FormRow: FC<
  PropsWithChildren<{
    className?: string;
  }>
> = ({ children, className }) => {
  return (
    <div
      className={classNames(
        'flex items-center justify-center gap-2 mt-2 whitespace-nowrap',
        className,
      )}
    >
      {children}
    </div>
  );
};

export const ErrorRow: FC<{
  errors: string[];
}> = ({ errors }) => {
  if (!errors.length) return null;
  return (
    <ul className={'flex flex-col px-4 py-2 text-red-500 rounded '}>
      {errors.map((error, i) => (
        <li key={i} className='list-disc'>
          {error}
        </li>
      ))}
    </ul>
  );
};
