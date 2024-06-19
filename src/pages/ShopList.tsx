// src/pages/ShopList.tsx
import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonLoading,
  IonButton,
  IonButtons,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/react';
import { logOutOutline, homeOutline } from 'ionicons/icons';
import axios from '../utils/axios';
import { useHistory } from 'react-router-dom';

const ShopList: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const history = useHistory();

  const fetchPosts = async (page: number) => {
    try {
      const response = await axios.get(`/puree/store?page=${page}&limit=15`);
      const newPosts = response.data.data;
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setHasMore(newPosts.length > 0);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage); // 최초 렌더링 시 데이터 로드
  }, []);

  const navigateToMain = () => {
    history.push('/home');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  };

  const loadMoreData = (ev: any) => {
    setCurrentPage((prevPage) => prevPage + 1);
    setLoading(true); // 데이터를 불러오는 중임을 표시
    fetchPosts(currentPage + 1); // 다음 페이지 데이터 요청
    setTimeout(() => ev.target.complete(), 500);
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
        {loading && currentPage === 1 ? (
          <IonLoading isOpen={loading} message={'Please wait...'} />
        ) : (
          <IonList>
            {posts.map((post) => (
              <IonItem key={post.biz_num}>
                <IonLabel>
                  <h2>{post.franchise_name}</h2>
                  <p>{post.brand_name}</p>
                  <p>{post.biz_num}</p>
                </IonLabel>
              </IonItem>
            ))}
            <IonInfiniteScroll
              onIonInfinite={loadMoreData}
              threshold="100px"
              disabled={!hasMore}
            >
              <IonInfiniteScrollContent loadingText="Loading more data..."></IonInfiniteScrollContent>
            </IonInfiniteScroll>
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ShopList;
