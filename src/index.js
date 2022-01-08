import React from 'react';
import ReactDOM from 'react-dom';
import socket from 'socket.io-client';
//
import './index.css';
import App from './App';
import AuthService from './service/auth';
import TweetService from './service/tweet';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, AuthErrorEventBus } from './context/AuthContext';
import HttpClient from './network/http';
import Socket from './network/socket';
import TokenStorage from './db/token';

const baseURL = process.env.REACT_APP_BASE_URL;
const authErrorEventBus = new AuthErrorEventBus();
const tokenStorage = new TokenStorage();
const httpClient = new HttpClient(baseURL, authErrorEventBus);
const authService = new AuthService(httpClient, tokenStorage);
const socketClient = new Socket(baseURL, () => tokenStorage.getToken());
const tweetService = new TweetService(httpClient, tokenStorage, socketClient);

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
