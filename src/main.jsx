import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import FirstVisit from './apps/firstVisit.jsx';
import WelfareLayout from './apps/welfareLayout.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <link
      href="https://fonts.googleapis.com/css2?family=Arimo:wght@300;400;500;700&display=swap"
      rel="stylesheet"
    ></link>
    <WelfareLayout />
  </StrictMode>
);
