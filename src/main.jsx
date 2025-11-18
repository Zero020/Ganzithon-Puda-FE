import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import WelfareLayout from './pages/welfareLayout.jsx';
import Landing from './pages/landing.jsx';
import LoginLayout from './pages/loginLayout.jsx';
import SignupLayout from './pages/signupLayout.jsx';
//import Store from './pages/storeTabs/store_home.jsx';
import StoreLayout from './pages/storeLayout.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <link
        href="https://fonts.googleapis.com/css2?family=Arimo:wght@300;400;500;700&display=swap"
        rel="stylesheet"
      ></link>
      {/* <WelfareLayout /> */}

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/:type/login" element={<LoginLayout />} />
        <Route path="/login" element={<Navigate to="/store/login" replace />} />
        <Route path="/:type/signup" element={<SignupLayout />} />
        <Route path="/store/home" element={<StoreLayout />} />

        <Route path="/o" element={<WelfareLayout />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
