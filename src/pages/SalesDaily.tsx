import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonIcon, IonButton, IonFooter, IonGrid, IonRow, IonCol } from '@ionic/react';
import { logOutOutline, homeOutline } from 'ionicons/icons';
import Select, { MultiValue, SingleValue, ActionMeta } from 'react-select';
import axios from '../utils/axios';
import { useHistory } from 'react-router-dom';
import { Storage } from '@ionic/storage';
import LineChart from '../components/LineChart';
import BarChart from '../components/BarChart';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import './SalesDaily.css';

const storage = new Storage();
storage.create();

const SalesDaily: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [selectedStores, setSelectedStores] = useState<{ value: string, label: string }[]>([]);
  const [storeOptions, setStoreOptions] = useState<{ value: string, label: string }[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<{ value: string, label: string }[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<{ value: 'order_amount' | 'order_count', label: string }>({ value: 'order_amount', label: '매출' });
  const history = useHistory();

  const typeOptions: { value: string; label: string }[] = [
    { value: 'Baemin', label: '배민' },
    { value: 'Baemin1', label: '배민1' },
    { value: 'Yogiyo', label: '요기요' },
    { value: 'CoupangEats', label: '쿠팡이츠' }
  ];

  const metricOptions: { value: 'order_amount' | 'order_count'; label: string }[] = [
    { value: 'order_amount', label: '매출' },
    { value: 'order_count', label: '주문수' }
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

      const response = await axios.get(`/puree/sales-daily`, {
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

  const handleMetricChange = (selectedOption: SingleValue<{ value: 'order_amount' | 'order_count'; label: string }>, actionMeta: ActionMeta<{ value: 'order_amount' | 'order_count'; label: string }>) => {
    if (selectedOption) {
      setSelectedMetric(selectedOption);
    }
  };

  const formatDateData = (dates: any) => {
    return Object.keys(dates).map(date => ({
      date,
      order_amount: dates[date].order_amount,
      order_count: dates[date].order_count
    }));
  };

  const formatTypeData = (types: any) => {
    return Object.keys(types).map(type => ({
      type,
      order_amount: types[type].order_amount,
      order_count: types[type].order_count
    }));
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
            <label style={{ marginRight: '8px' }}>시작</label>
            <DatePicker selected={startDate} onChange={(date: Date | null) => setStartDate(date)} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ marginRight: '8px' }}>종료</label>
            <DatePicker selected={endDate} onChange={(date: Date | null) => setEndDate(date)} />
          </div>
          <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
            <label style={{ marginRight: '8px' }}>매장</label>
            <Select
              options={storeOptions}
              onChange={handleStoreChange}
              isMulti
              isClearable
              placeholder="선택"
              menuPortalTarget={document.body}
              styles={{
                menuPortal: base => ({ ...base, zIndex: 9999 }),
                container: base => ({ ...base, width: 200 })
              }}
            />
          </div>
          <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
            <label style={{ marginRight: '8px' }}>유형</label>
            <Select
              options={typeOptions}
              onChange={handleTypeChange}
              isMulti
              isClearable
              placeholder="선택"
              menuPortalTarget={document.body}
              styles={{
                menuPortal: base => ({ ...base, zIndex: 9999 }),
                container: base => ({ ...base, width: 200 })
              }}
            />
          </div>
          <IonButton onClick={handleApply}>적용</IonButton>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <IonGrid>
            <IonRow>
              <IonCol>
                <div className="info-box">
                  <div className="info-box-title">전체 매출</div>
                  <div className="info-box-value">{data.total_amount.toLocaleString()} 원</div>
                </div>
              </IonCol>
              <IonCol>
                <div className="info-box">
                  <div className="info-box-title">전체 주문수</div>
                  <div className="info-box-value">{data.total_count.toLocaleString()} 건</div>
                </div>
              </IonCol>
              <IonCol>
                <div className="info-box">
                  <div className="info-box-title">전체 객단가</div>
                  <div className="info-box-value">{(data.total_amount / data.total_count).toLocaleString()} 원</div>
                </div>
              </IonCol>
              <IonCol>
                <div className="info-box">
                  <div className="info-box-title">주문 취소 금액</div>
                  <div className="info-box-value">{data.total_cancelled_amount.toLocaleString()} 원</div>
                </div>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                  <label style={{ marginRight: '8px' }}>선택</label>
                  <Select<{ value: 'order_amount' | 'order_count', label: string }>
                    value={selectedMetric}
                    options={metricOptions}
                    onChange={handleMetricChange}
                    placeholder="선택"
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: base => ({ ...base, zIndex: 9999 }),
                      container: base => ({ ...base, width: 120 })
                    }}
                  />
                </div>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <div className="chart-container">
                  <LineChart data={formatDateData(data.dates)} selectedMetric={selectedMetric.value} />
                </div>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <div className="chart-container">
                  <BarChart data={formatTypeData(data.types)} />
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
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

export default SalesDaily;
