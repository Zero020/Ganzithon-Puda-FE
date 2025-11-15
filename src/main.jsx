import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import WelfareLayout from './pages/welfareLayout.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <link
        href="https://fonts.googleapis.com/css2?family=Arimo:wght@300;400;500;700&display=swap"
        rel="stylesheet"
      ></link>
      <WelfareLayout />
    </BrowserRouter>
  </StrictMode>
);
