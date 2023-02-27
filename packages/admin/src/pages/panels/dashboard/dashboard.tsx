import React, { FC } from 'react';

import { PageLayout } from 'pages/shared/pageLayout';
import { useObserver } from 'feret';
import { AuthStateManager } from 'services/AuthStateManager';

export const Dashboard: FC = () => {
  const [auth] = useObserver([AuthStateManager]);
  return (
    <PageLayout>
      <h1 className='mb-5 text-4xl font-medium'>Dashboard</h1>
      <div>{auth.getUser()?.email}</div>
    </PageLayout>
  );
};

export default Dashboard;
