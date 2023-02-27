import React, { FC, Fragment, PropsWithChildren, useState } from 'react';

import { Container, Panel } from 'components/container';
import {
  ExtenstionItem,
  Menu,
  MenuExtension,
  MenuHeader,
  MenuItem,
  MenuSeperator,
} from 'components/menu';
import { useService } from 'feret';
import { RouterService } from 'services/RouterService';
import { AuthStateManager } from 'services/AuthStateManager';

import BellIcon from 'icons/bell.svg';
import ChevronDownIcon from 'icons/chevron-down.svg';
import HelpIcon from 'icons/help.svg';
import MenuIcon from 'icons/menu-2.svg';
import MessagesIcon from 'icons/messages.svg';
import HomeIcon from 'icons/smart-home.svg';

type MenuItem = {
  type: 'menu-item' | 'seperator' | 'component';
  to?: string;
  icon?: React.ReactNode;
  component?: React.ReactNode;
  caption?: string;
  subtitle?: string;
  className?: string;
};

export const PageLayout: FC<PropsWithChildren> = ({ children }) => {
  const authStateManager = useService(AuthStateManager);
  const routerService = useService(RouterService);

  const [active, setActive] = useState(false);

  const menus: MenuItem[] = [
    {
      type: 'menu-item',
      to: routerService.dasboardRoutes.dashboard,
      icon: <HomeIcon />,
      caption: 'Dashboard',
    },
    {
      type: 'menu-item',
      icon: <MessagesIcon />,
      caption: 'Need help?',
      subtitle: 'chat with us?',
      className: 'mt-auto',
    },
  ];
  return (
    <Container>
      <Menu>
        <MenuHeader
          icon={<MenuIcon />}
          caption='Enigma'
          onClick={() => setActive((active) => !active)}
        />

        {menus.map((menu, i) => {
          if (menu.type == 'seperator') return <MenuSeperator key={i} />;

          if (menu.type == 'menu-item')
            return (
              <MenuItem
                key={i}
                to={menu.to}
                icon={menu.icon}
                caption={menu.caption}
                subtitle={menu.subtitle}
                className={menu.className}
              />
            );

          if (menu.type == 'component')
            return <Fragment key={i}>{menu.component}</Fragment>;
        })}
      </Menu>
      <Panel>
        <MenuExtension>
          <ExtenstionItem
            icon={<ChevronDownIcon />}
            caption='Aryan'
            onClick={() => authStateManager.logout()}
          />
          <ExtenstionItem icon={<BellIcon />} />
          <ExtenstionItem icon={<HelpIcon />} />
        </MenuExtension>
        {children}
      </Panel>
    </Container>
  );
};
