import React from 'react';
import ReactDOM from 'react-dom';
import socket from 'socket.io-client';
//
import './index.css';
import App from './App';
import AuthService from './service/auth';
import TweetService from './service/tweet';
import { BrowserRouter } from 'react-router-dom';
import {
  AuthProvider,
  AuthErrorEventBus,
  fetchToken,
  fetchCsrfToken,
} from './context/AuthContext';
import HttpClient from './network/http';
import Socket from './network/socket';

const baseURL = process.env.REACT_APP_BASE_URL;\
console.log(baseURL);
const authErrorEventBus = new AuthErrorEventBus();
const httpClient = new HttpClient(
  baseURL,
  authErrorEventBus, //
  () => fetchCsrfToken()
);
const authService = new AuthService(httpClient);
const socketClient = new Socket(baseURL, () => fetchToken());
const tweetService = new TweetService(httpClient, socketClient);

const socketIO = socket(baseURL);
socketIO.on('connect-error', (error) => {
  console.log('socket error', error);
});

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider
        authService={authService}
        authErrorEventBus={authErrorEventBus}
      >
        <App tweetService={tweetService} />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
