import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonIcon, IonButton, IonFooter } from '@ionic/react';
import { logOutOutline, homeOutline } from 'ionicons/icons';
import Select, { MultiValue } from 'react-select';
import axios from '../utils/axios';
import { useHistory } from 'react-router-dom';
import { Storage } from '@ionic/storage';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import './SalesDailyByStore.css';

const storage = new Storage();
storage.create();

const SalesDailyByStore: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [selectedStores, setSelectedStores] = useState<{ value: string, label: string }[]>([]);
  const [storeOptions, setStoreOptions] = useState<{ value: string, label: string }[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<{ value: string, label: string }[]>([]);
  const history = useHistory();

  const typeOptions = [
    { value: 'Baemin', label: '배민' },
    { value: 'Baemin1', label: '배민1' },
    { value: 'Yogiyo', label: '요기요' },
    { value: 'CoupangEats', label: '쿠팡이츠' }
  ];

  useEffect(() => {
    // Fetch store options from API
    const fetchStoreOptions = async () => {
      try {
        const response = await axios.get(`/puree/store-list`);
        const storeList = response.data.data;
        const options = storeList.map((store: string) => ({
          value: store,
          label: store
        }));
        setStoreOptions(options);
      } catch (error) {
        console.error('Error fetching store options:', error);
      }
    };

    fetchStoreOptions();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const start = moment(startDate).format('YYYY-MM-DD');
      const end = moment(endDate).format('YYYY-MM-DD');

      const stores = selectedStores.map(store => store.value);
      const types = selectedTypes.map(type => type.value);

      const cachedData = await storage.get(`sales-daily-by-store-${start}-${end}`);

      // if (cachedData) {
      //   console.log('Cached Data:', cachedData);
      //   setData(cachedData.data);
      // } else {
      //   const response = await axios.get(`/puree/sales-daily-by-store?start_date`, {
      //     params: {
      //       start_date: start,
      //       end_date: end,
      //       shops: storeValues,
      //       app_types: typeValues
      //     }
      //   });
      //   console.log('API Response:', response.data);
      //   setData(response.data.data);
      //   await storage.set(`sales-daily-by-store-${start}-${end}`, response.data);
      // }

      const response = await axios.get(`/puree/sales-daily-by-store`, {
            params: {
              start_date: start,
              end_date: end,
              shops: stores,
              app_types: types
            },
            paramsSerializer: params => {
              return Object.entries(params)
                .map(([key, value]) => Array.isArray(value) ? value.map(v => `${key}=${encodeURIComponent(v)}`).join('&') : `${key}=${encodeURIComponent(value)}`)
                .join('&');
            }
          });
      console.log('API Response:', response.data);
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('데이터를 가져오는 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  const calculateOrderActivation = (dateCount: number) => (dateCount * 100 / 2).toFixed(1) + '%';
  const calculateCancelRate = (cancelCount: number, orderCount: number) => {
    if (orderCount === 0) {
      return '0.0%';
    }
    return ((cancelCount * 100) / orderCount).toFixed(1) + '%';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  };

  const navigateToMain = () => {
    history.push('/home');
  };

  const handleApply = () => {
    if (startDate && endDate) {
      fetchData();
    }
  };

  const safeValue = (value: number) => {
    return isNaN(value) || !isFinite(value) ? 0 : value;
  };

  const handleStoreChange = (selectedOptions: MultiValue<{ value: string, label: string }>) => {
    setSelectedStores(selectedOptions as { value: string, label: string }[]);
  };

  const handleTypeChange = (selectedOptions: MultiValue<{ value: string, label: string }>) => {
    setSelectedTypes(selectedOptions as { value: string, label: string }[]);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sales Daily</IonTitle>
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
        <div className="table-container">
          <div style={{ marginBottom: '16px' }}>
            <label>시작 날짜: </label>
            <DatePicker selected={startDate} onChange={(date: Date | null) => setStartDate(date)} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label>종료 날짜: </label>
            <DatePicker selected={endDate} onChange={(date: Date | null) => setEndDate(date)} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label>매장 선택: </label>
            <Select
              options={storeOptions}
              onChange={handleStoreChange}
              isMulti
              isClearable
              placeholder="매장을 선택하세요"
              menuPortalTarget={document.body}
              styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label>유형 선택: </label>
            <Select
              options={typeOptions}
              onChange={handleTypeChange}
              isMulti
              isClearable
              placeholder="유형을 선택하세요"
              menuPortalTarget={document.body}
              styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
            />
          </div>
          <IonButton onClick={handleApply}>적용</IonButton>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>매장</th>
                  <th>매출</th>
                  <th>일평균매출</th>
                  <th>주문발생일</th>
                  <th>주문수</th>
                  <th>객단가</th>
                  <th>주문취소율</th>
                  <th>주문취소금액</th>
                </tr>
              </thead>
              <tbody>
                {data.filter(item => 
                  selectedStores.length === 0 || selectedStores.some(store => store.value === item.memo)
                ).map(item => (
                  <tr key={item.memo}>
                    <td>{item.memo}</td>
                    <td>{safeValue(item.order_amount).toLocaleString()}</td>
                    <td>{safeValue(item.order_amount / item.date_count).toLocaleString()}</td>
                    <td className="center">{safeValue(item.date_count)}</td>
                    <td className="center">{safeValue(item.order_count)}</td>
                    <td>{safeValue(Math.floor(item.order_amount / item.order_count)).toLocaleString()}</td>
                    <td className="center">{calculateCancelRate(safeValue(item.order_cancel_count), safeValue(item.order_count))}</td>
                    <td>{safeValue(item.order_cancel_amount).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </IonContent>
      <IonFooter>
        <IonToolbar>
          {/* 페이지네이션 UI가 필요하다면 여기에 추가 */}
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default SalesDailyByStore;
