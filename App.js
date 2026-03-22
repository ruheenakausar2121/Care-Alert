import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FindHospital from './pages/FindHospital';
import BookAppointment from './pages/BookAppointment';
import Prescription from './pages/Prescription';
import OrderMedicines from './pages/OrderMedicines';
import FirstAid from './pages/FirstAid';
import Emergency from './pages/Emergency';
import Consultation from './pages/Consultation';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/find-hospital" element={<FindHospital />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/prescription" element={<Prescription />} />
        <Route path="/order-medicines" element={<OrderMedicines />} />
<Route path="/first-aid" element={<FirstAid />} />
<Route path="/emergency" element={<Emergency />} />
<Route path="/consultation" element={<Consultation />} />
      </Routes>
    </Router>
  );
}

export default App;