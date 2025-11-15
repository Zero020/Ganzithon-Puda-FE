import React from "react";
import "./firstVisit.css";

export default function FirstVisit() {

  return (
    <div className="first-container">

      <div className="first-content">
        <h1 className="first-title">무엇을 찾으러 오셨나요?</h1>

        <div className="first-buttons">
          <button className="btn primary">가게</button>
          <button className="btn secondary">복지시설</button>
        </div>
      </div>
    </div>
  );
}
