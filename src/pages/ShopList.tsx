// src/pages/ShopList.tsx
import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonFooter, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonLoading, IonButton, IonButtons, IonIcon } from '@ionic/react';
import { logOutOutline, homeOutline } from 'ionicons/icons';
import axios from '../utils/axios';
import { useHistory } from 'react-router-dom';

const ShopList: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const history = useHistory();

  useEffect(() => {
    const fetchPosts = async (page: number) => {
      setLoading(true);
      try {
        const response = await axios.get(`/channels`); // API 엔드포인트를 실제 API 주소로 변경하세요.
        setPosts(response.data);
        // setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts(currentPage);
  }, [currentPage]);

  const navigateToMain = () => {
    history.push('/home');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Shop List</IonTitle>
          <IonButtons slot="end">
            <IonIcon icon={logOutOutline} size="large" onClick={handleLogout} />
          </IonButtons>
          <IonButtons slot="start">
            <IonButton onClick={navigateToMain}>
              <IonIcon icon={homeOutline} size="large" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {loading ? (
          <IonLoading isOpen={loading} message={'Please wait...'} />
        ) : (
          <IonList>
            {posts.map(post => (
              <IonItem key={post.id}>
                <IonLabel>
                  <h2>{post.type}</h2>
                  <p>{post.accountName}</p>
                  <p>{post.siteUrl}</p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
      {/* <IonFooter>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
              Previous
            </IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
              Next
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter> */}
    </IonPage>
  );
};

export default ShopList;
