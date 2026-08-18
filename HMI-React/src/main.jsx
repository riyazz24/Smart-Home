import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axiosInstance from './util/AxiosInstance.jsx'

console.log('Axios instance baseURL:', axiosInstance.defaults.baseURL);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
