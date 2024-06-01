import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonItem, IonLabel, IonButton, IonLoading } from '@ionic/react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const history = useHistory();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8082/auth/token', { id, password });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      history.push('/home');
    } catch (error: any) {
      setError(error.response ? error.response.data.detail : 'An error occurred');
    }
    setLoading(false);
  };

  return (
    <IonPage>
      <IonContent className="ion-padding login-container">
        <div className="login-header">
          매장 정보 관리도, <br />
          본사와 매장 사이 소통도, <br />
          편하게 시작하세요!
        </div>
        <div className="login-form">
          <IonItem className="login-item">
            <IonLabel position="stacked">ID 입력</IonLabel>
            <IonInput
              type="text"
              value={id}
              onIonChange={e => setId(e.detail.value!)}
              className="login-input"
            />
          </IonItem>
          <IonItem className="login-item">
            <IonLabel position="stacked">비밀번호 입력</IonLabel>
            <IonInput
              type="password"
              value={password}
              onIonChange={e => setPassword(e.detail.value!)}
              className="login-input"
            />
          </IonItem>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <IonButton expand="block" onClick={handleLogin} className="login-button">로그인</IonButton>
          <IonLoading isOpen={loading} message={'Please wait...'} />
        </div>
        <div className="login-footer">
          <div className="copyright">©forSPACElab</div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
