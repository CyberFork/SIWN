import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom'
import Router from './router/Router'
import routes from './router/index'
import store from './store'
import {Provider} from 'react-redux'
import './index.scss';
import {ConfigProvider} from 'antd'
import enGB from 'antd/lib/locale/en_GB'
import './Layout.scss';
import './media.scss'
import './mock'

const root = ReactDOM.createRoot(document.getElementById('root'));
Router(routes);

root.render(
  <ConfigProvider locale={enGB}>
      <Provider store={store}>
          <BrowserRouter>
              <Router.View/>
          </BrowserRouter>
      </Provider>
  </ConfigProvider>
);