import React, { FC, PropsWithChildren, ReactNode, useContext } from 'react';

import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

const MenuContext = React.createContext<MenuAction>({});

export type MenuAction<T = boolean> = {
  isExpanded?: T;
  setExpansion?: React.Dispatch<React.SetStateAction<T>>;
};

export const Menu: FC<PropsWithChildren<MenuAction>> = ({
  children,
  isExpanded,
  setExpansion,
}) => {
  return (
    <MenuContext.Provider value={{ isExpanded, setExpansion }}>
      <nav className={'relative flex flex-col shrink-0 w-18 md:w-80'}>
        <ul
          className={classNames('flex flex-col grow gap-1 p-4 bg-white', {
            'absolute sm:border-r-2 md:border-none w-screen sm:w-80 h-full md:relative md:w-18 md:h-auto':
              isExpanded,
          })}
        >
          {children}
        </ul>
      </nav>
    </MenuContext.Provider>
  );
};

export const MenuHeader: FC<{
  icon: ReactNode;
  caption?: ReactNode;
  onClick?: () => void;
}> = ({ icon, caption, onClick }) => {
  const { isExpanded } = useContext(MenuContext);
  return (
    <li
      className={classNames('flex flex-row items-center pb-6 gap-0 md:gap-3', {
        '!gap-3': isExpanded,
      })}
    >
      <button
        onClick={onClick}
        className={
          'flex items-center rounded-md p-3 hover:bg-orange-50 hover:text-orange-500 md:pointer-events-none'
        }
      >
        {icon}
      </button>
      <span
        className={classNames('whitespace-nowrap font-bold text-lg', {
          'hidden md:block': 1,
          '!block': isExpanded,
        })}
      >
        {caption}
      </span>
    </li>
  );
};

export const MenuItem: FC<{
  icon: ReactNode;
  caption: ReactNode;
  subtitle?: ReactNode;
  className?: string;
  to?: string;
}> = ({ to = '#', caption, subtitle, icon, className }) => {
  const { isExpanded } = useContext(MenuContext);
  return (
    <li className={className}>
      <NavLink
        to={to}
        className={({ isActive }) =>
          classNames(
            'flex flex-row items-center rounded-md hover:bg-orange-50 hover:text-orange-500 gap-0 md:gap-3 p-3',
            {
              '!bg-orange-100 text-orange-500': isActive && to !== '#',
              '!gap-3': isExpanded,
            },
          )
        }
      >
        <span className='flex items-center'>{icon}</span>
        <span
          className={classNames('hidden md:flex flex-col whitespace-nowrap', {
            '!flex': isExpanded,
          })}
        >
          <span className='font-semibold'>{caption}</span>
          <span className='opacity-50'>{subtitle}</span>
        </span>
      </NavLink>
    </li>
  );
};

export const MenuSeperator: FC = () => {
  return <li className='bg-slate-200 h-[1px] my-4' />;
};

export const MenuAlert: FC<
  PropsWithChildren<{
    className?: string;
    icon: React.ReactNode;
  }>
> = ({ children, icon, className }) => {
  const { isExpanded } = useContext(MenuContext);
  return (
    <li
      className={classNames(
        'flex flex-row bg-green-100 rounded-lg px-3 py-5',
        className,
        {
          'gap-0 md:gap-4': 1,
          '!gap-4': isExpanded,
        },
      )}
    >
      <span className='text-slate-500 text-opacity-80'>{icon}</span>
      <div
        className={classNames('flex-col grow gap-4', {
          'hidden md:flex': 1,
          '!flex': isExpanded,
        })}
      >
        {children}
      </div>
    </li>
  );
};

export const MenuExtension: FC<PropsWithChildren> = ({ children }) => {
  return (
    <nav className='flex'>
      <ul className='flex flex-row-reverse items-center mb-4 grow'>
        {children}
      </ul>
    </nav>
  );
};

export const ExtenstionItem: FC<{
  icon: ReactNode;
  caption?: ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ caption, icon, className, onClick }) => {
  return (
    <li className={className}>
      <button
        className={classNames(
          'flex flex-row-reverse items-center rounded-md p-3',
          'hover:bg-orange-50 hover:text-orange-500',
        )}
        onClick={onClick}
      >
        <span className='flex items-center'>{icon}</span>
        {caption && (
          <span className={'flex flex-col mr-2 whitespace-nowrap'}>
            <span>{caption}</span>
          </span>
        )}
      </button>
    </li>
  );
};
