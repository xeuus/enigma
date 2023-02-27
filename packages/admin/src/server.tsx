import 'reflect-metadata';
// sep
import { RouterContext, RouterContextProps } from 'components/router';
import cookieParser from 'cookie-parser';
import express from 'express';
import { createContainer, FeretProvider, TagManager } from 'feret';
import fs from 'fs';
import { createProxyServer } from 'http-proxy';
import { App } from 'pages/app';
import path from 'path';
import React from 'react';
import ReactSSR from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Config } from 'services/Config';
import { Template } from 'utils/template';
import { ServerModule } from 'services/ServerModule';
import { SSR_EMBEDDED } from 'services/constants';

const readFile = (p: string) => {
  return fs.readFileSync(path.resolve(__dirname, p), 'utf8');
};

export const runServer = () => {
  const app = express();
  const port = process.env.PORT || 3000;
  const tmp = new Template(readFile('page.html'));
  const publicDir = path.resolve(__dirname);

  const global = createContainer();

  const config = global.get(Config);

  app.use('/bundle.js', (req, res) => {
    res.statusCode = 404;
    return res.end('');
  });

  var proxy = createProxyServer({});
  app.all(config.APP_GRAPHQL_PATH, (req, res) => {
    return proxy.web(req, res, {
      target: config.APP_GRAPHQL_PROXY,
      changeOrigin: true,
      secure: false,
    });
  });

  app.use(
    '/',
    cookieParser(),
    express.static(publicDir),
    async function (req, res, next) {
      const context: RouterContextProps = { status: 200 };

      const container = createContainer([ServerModule]);
      const tagManager = container.get(TagManager);

      const cookieData = decodeURI(req.cookies['app_saved_data'] || '');

      if (cookieData) {
        const json = JSON.parse(cookieData || '{}');
        tagManager.restoreSnapshot(json);
      }

      await container.bootSequence();

      tmp.set(
        'root',
        ReactSSR.renderToString(
          <FeretProvider container={container}>
            <RouterContext.Provider value={context}>
              <StaticRouter location={req.url}>
                <App />
              </StaticRouter>
            </RouterContext.Provider>
          </FeretProvider>,
        ),
      );
      tmp.set(
        'begin_head',
        `<script>window.__INITIAL_DATA__=${JSON.stringify(
          tagManager.getSnapshot(SSR_EMBEDDED),
        )};</script>`,
      );
      res.statusCode = context.status;
      if ([301, 302].includes(context.status) && context.redirect) {
        return res.redirect(context.status, context.redirect);
      }
      return res.end(tmp.render());
    },
  );

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
};
