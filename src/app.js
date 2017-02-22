/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import session from 'express-session';
import flash from 'express-flash';
import expressGraphQL from 'express-graphql';
import PrettyError from 'pretty-error';
import passport from './passport';
import schema from './schema';
import accountRoutes from './routes/account';

import webpackConfig from '../webpack.config';

const app = express();

  // Step 1: Create & configure a webpack compiler

const compiler = webpack(webpackConfig);

// Step 2: Attach the dev middleware to the compiler & the server
app.use(webpackDevMiddleware(compiler, {
  noInfo: true, publicPath: webpackConfig.output.publicPath,
}));

// Step 3: Attach the hot middleware to the compiler & the server
app.use(webpackHotMiddleware(compiler, {
  log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000,
}));

app.set('trust proxy', 'loopback');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  name: 'sid',
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(accountRoutes);

app.use('/graphql', expressGraphQL(req => ({
  schema,
  context: {
    user: req.user,
  },
  graphiql: process.env.NODE_ENV !== 'production',
  pretty: process.env.NODE_ENV !== 'production',
})));

app.use('/src', express.static(path.join(__dirname, '/client/src/')))

app.get('/', (req, res) => {
  if (req.user) {
    res.send(`<p>Welcome, ${req.user.email}! (<a href="/logout">logout</a>)</p>`);
  } else {
    res.sendFile(path.join(__dirname, '/client/index.html'));
  }
});

const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => {
  process.stderr.write(pe.render(err));
  next();
});

export default app;
