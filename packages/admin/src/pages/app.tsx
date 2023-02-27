import React from 'react';

import { Redirect } from 'components/router';
import { useObserver, useService } from 'feret';
import { Route, Routes } from 'react-router-dom';
import { RouterService } from 'services/RouterService';

import { AuthStateManager } from 'services/AuthStateManager';
import Forgot from './auth/forgot/forgot';
import Login from './auth/login/login';
import Register from './auth/register/register';
import Dashboard from './panels/dashboard/dashboard';

export function App() {
  const [authStateManager, routerService] = useObserver([
    AuthStateManager,
    RouterService,
  ]);

  if (!authStateManager.isLoggedIn()) {
    return (
      <Routes key="auth">
        <Route path={routerService.authRoutes.login} element={<Login />} />
        <Route path={routerService.authRoutes.signUp} element={<Register />} />
        <Route path={routerService.authRoutes.forgot} element={<Forgot />} />
        <Route
          path='*'
          element={<Redirect to={routerService.authRoutes.login} />}
        />
      </Routes>
    );
  }
  return (
    <Routes key="dashboard">
      <Route
        path={routerService.dasboardRoutes.dashboard}
        element={<Dashboard />}
      />
      <Route
        path='*'
        element={<Redirect to={routerService.dasboardRoutes.dashboard} />}
      />
    </Routes>
  );
}
