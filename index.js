import '@babel/polyfill';
import React from 'react';
import { AppContainer } from 'react-hot-loader';
import { render, hydrate } from 'react-dom';

const mount = (App, isInitial = true) => {
  const r = isInitial ? hydrate : render;
  render(<AppContainer><App /></AppContainer>, document.getElementById('root'));
};

mount(require('scripts/app').default);

if (module.hot) {
  module.hot.accept('scripts/app', () => {
    mount(require('scripts/app').default, false);
  });
}
