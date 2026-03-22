import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function BookAppointment() {
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('clinic');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'appointments'), {
        uid: auth.currentUser.uid,
        doctor,
        date,
        time,
        type,
        createdAt: new Date()
      });
      alert('Appointment booked!');
      navigate('/dashboard');
    } catch (err) {
      alert('Error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Book Appointment</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Doctor name" value={doctor}
          onChange={e => setDoctor(e.target.value)} required /><br/><br/>
        <input type="date" value={date}
          onChange={e => setDate(e.target.value)} required /><br/><br/>
        <input type="time" value={time}
          onChange={e => setTime(e.target.value)} required /><br/><br/>
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="clinic">Clinic Visit</option>
          <option value="video">Video Call</option>
        </select><br/><br/>
        <button type="submit" disabled={loading}>
          {loading ? 'Booking...' : 'Book Appointment'}
        </button>
      </form>
    </div>
  );
}

export default BookAppointment;