import { useState, useEffect } from 'react';
import './welfare_reservation.css';
import logo from '@/assets/logo.svg';

export default function WelfareReservation() {
  return (
    <div className="welfare_reservation_container">
      <div className="topHeader">
        <img src={logo} alt="Logo" className="logo" />
      </div>
    </div>
  );
}
