// src/utils/axios.ts
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8082', // API 서버 주소로 변경하세요
});

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

instance.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response && (error.response.status === 403 || error.response.status === 401)) {
    localStorage.removeItem('token');
    window.location.href = '/login'; // 로그인 페이지로 리디렉션
  }
  return Promise.reject(error);
});


export default instance;
