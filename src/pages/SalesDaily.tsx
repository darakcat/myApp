// src/pages/SalesDaily.tsx
import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonIcon, IonButton, IonFooter } from '@ionic/react';
import { logOutOutline, homeOutline } from 'ionicons/icons';
import Select from 'react-select';
import axios from '../utils/axios';
import { useHistory } from 'react-router-dom';
import LineChart from '../components/LineChart';
import BarChart from '../components/BarChart';
import { Storage } from '@ionic/storage';

const storage = new Storage();
storage.create();

// 지난주의 월요일 날짜를 계산하는 함수
const getLastWeekMonday = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const lastMonday = new Date(today);
  lastMonday.setDate(today.getDate() - (dayOfWeek + 6) % 7 - 7);
  return lastMonday;
};

// 월요일을 생성하는 함수
const getMondays = (year: number) => {
  const mondays = [];
  const date = new Date(year, 0, 1);
  // 첫 번째 월요일 찾기
  while (date.getDay() !== 1) {
    date.setDate(date.getDate() + 1);
  }
  // 모든 월요일 찾기
  while (date.getFullYear() === year) {
    mondays.push(new Date(date));
    date.setDate(date.getDate() + 7);
  }
  return mondays;
};

const SalesDaily: React.FC = () => {
  const lastWeekMonday = getLastWeekMonday();
  const initialYear = lastWeekMonday.getFullYear().toString();
  const initialMonth = (lastWeekMonday.getMonth() + 1).toString().padStart(2, '0');
  const initialDay = lastWeekMonday.getDate().toString().padStart(2, '0');

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [year, setYear] = useState<string>(initialYear);
  const [month, setMonth] = useState<string>(initialMonth);
  const [day, setDay] = useState<string>(initialDay);
  const [dayOptions, setDayOptions] = useState<{ value: string; label: string }[]>([]);
  const history = useHistory();

  const yearOptions = Array.from({ length: 10 }, (_, i) => {
    const value = (2020 + i).toString();
    return { value, label: value };
  });

  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const value = (i + 1).toString().padStart(2, '0');
    return { value, label: value };
  });

  useEffect(() => {
    const fetchDayOptions = () => {
      const mondays = getMondays(parseInt(year)).filter(monday => (monday.getMonth() + 1).toString().padStart(2, '0') === month);
      const options = mondays.map(monday => {
        const value = monday.getDate().toString().padStart(2, '0');
        const month = (monday.getMonth() + 1).toString().padStart(2, '0');
        return { value: `${year}-${month}-${value}`, label: `${year}-${month}-${value}` };
      });
      setDayOptions(options);
      // 기본 날짜 설정
      if (options.length > 0) {
        const [defaultOption] = options;
        const [defaultYear, defaultMonth, defaultDay] = defaultOption.value.split('-');
        setYear(defaultYear);
        setMonth(defaultMonth);
        setDay(defaultDay);
      }
    };

    fetchDayOptions();
  }, [year, month]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const date = `${year}-${month}-${day}`;
        const cachedData = await storage.get(`sales-daily-${date}`);
        if (cachedData) {
          setData(cachedData);
          console.log('Cached Data:', cachedData);
        } else {
          const response = await axios.get(`/sales/daily?date=${date}`);
          console.log('API Response:', response.data);
          setData(response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year, month, day]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  };

  const navigateToMain = () => {
    history.push('/main');
  };

  const handleDateChange = (selectedOption: { value: string; label: string } | null) => {
    if (selectedOption) {
      const [selectedYear, selectedMonth, selectedDay] = selectedOption.value.split('-');
      setYear(selectedYear);
      setMonth(selectedMonth);
      setDay(selectedDay);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sailes Daily</IonTitle>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <Select
            options={yearOptions}
            value={yearOptions.find(option => option.value === year)}
            onChange={(selectedOption) => setYear(selectedOption?.value || initialYear)}
            placeholder="Year"
          />
          <Select
            options={monthOptions}
            value={monthOptions.find(option => option.value === month)}
            onChange={(selectedOption) => setMonth(selectedOption?.value || initialMonth)}
            placeholder="Month"
          />
          <Select
            options={dayOptions}
            value={dayOptions.find(option => option.value === `${year}-${month}-${day}`)}
            onChange={handleDateChange}
            placeholder="Day"
          />
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <LineChart data={data} />
        )}
         {loading ? (
          <div>Loading...</div>
        ) : (
          <BarChart data={data} />
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
