import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FirstVisit from "./pages/FirstVisit";

//라우팅 관리
function App() {
  return (
    <Routes>
      <Route path="/" element={<FirstVisit />} />
      <Route path="/login" element={<Login />} />
      <Route path="/singup" element={<Signup />} />
    </Routes>
  );
}

export default App;