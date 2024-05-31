// src/pages/Login.tsx
import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonItem, IonLabel, IonButton, IonLoading } from '@ionic/react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Login: React.FC = () => {
  const [id, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const history = useHistory();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8082/auth/token-manager', { id, password });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      // 로그인 성공 후 페이지 이동 또는 상태 업데이트
      history.push('/home');
    } catch (error: any) {
      setError(error.response ? error.response.data.detail : 'An error occurred');
    }
    setLoading(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">ID</IonLabel>
          <IonInput
            type="text"
            value={id}
            onIonChange={e => setEmail(e.detail.value!)}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Password</IonLabel>
          <IonInput
            type="password"
            value={password}
            onIonChange={e => setPassword(e.detail.value!)}
          />
        </IonItem>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <IonButton expand="block" onClick={handleLogin}>Login</IonButton>
        <IonLoading isOpen={loading} message={'Please wait...'} />
      </IonContent>
    </IonPage>
  );
};

export default Login;
