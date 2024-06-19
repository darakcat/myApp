import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonButtons, IonIcon } from '@ionic/react';
import { logOutOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

const Home: React.FC = () => {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  };

  const navigateToShop = () => {
    history.push('/shop');
  };

  const navigateToSalesDaily = () => {
    history.push('/sales-daily');
  };

  const navigateToSalesDailyByStore = () => {
    history.push('/sales-daily-by-store');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
          <IonButtons slot="end">
            <IonIcon icon={logOutOutline} size="large" onClick={handleLogout} />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>Welcome to the Main Page!</h2>
        <div className="button-container">
          <IonButton onClick={navigateToShop}>Shop List</IonButton>
          <IonButton onClick={navigateToSalesDaily}>Sales Daily</IonButton>
          <IonButton onClick={navigateToSalesDailyByStore}>Sales Daily By Store</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
