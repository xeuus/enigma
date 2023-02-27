import 'reflect-metadata';
import './index.scss';
// sep
import { createContainer, FeretProvider } from 'feret';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ClientModule } from 'services/ClientModule';
import { App } from 'pages/app';

(async function () {
  const { createRoot, hydrateRoot } = await import('react-dom/client');
  const initialData = window.__INITIAL_DATA__;
  const shouldHydrate = typeof initialData !== 'undefined';
  const root = document.getElementById('root')!;
  const container = createContainer([ClientModule]);
  container.enableDebug();
  await container.bootSequence();
  const app = (
    <FeretProvider container={container}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </FeretProvider>
  );
  if (!shouldHydrate) return createRoot(root).render(app);
  return hydrateRoot(root, app, {
    onRecoverableError: (error) => {},
  });
})();
