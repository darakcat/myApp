// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { IonApp } from '@ionic/react';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <IonApp>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </IonApp>
);
