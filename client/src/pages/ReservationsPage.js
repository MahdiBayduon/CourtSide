import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReservationsPage.css';

const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({
    fieldId: '',
    startTime: '',
    endTime: '',
  });

  const { fieldId, startTime, endTime } = formData;

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('/api/reservations/my-reservations', {
        baseURL: 'http://localhost:5000',
        headers: { 'x-auth-token': token },
      });
      setReservations(data);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        alert('Please sign in to view your reservations.');
      }
    }
  };

  const fetchFields = async () => {
    try {
      const { data } = await axios.get('/api/fields', {
        baseURL: 'http://localhost:5000',
      });
      setFields(data);
    } catch (err) {
      console.error(err);
    }
  };

  const cancelReservation = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/reservations/${id}`, {
        baseURL: 'http://localhost:5000',
        headers: { 'x-auth-token': token },
      });
      fetchReservations();
      alert('Reservation cancelled');
    } catch (err) {
      console.error(err.response.data);
      alert('Error cancelling reservation');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchReservations();
    }
    fetchFields();
  }, []);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
       if (!token) {
        alert('Please sign in to make a reservation.');
        return;
      }
      await axios.post(
        '/api/reservations',
        { fieldId, startTime, endTime },
        {
          baseURL: 'http://localhost:5000',
          headers: { 'x-auth-token': token },
        }
      );
      fetchReservations();
      alert('Reservation created!');
    } catch (err) {
      console.error(err.response.data);
      alert(err.response.data.msg || 'Error creating reservation');
    }
  };

  return (
    <div className="reservations-container">
      <h1>Your Reservations</h1>
      <ul className="reservations-list">
        {reservations.length > 0 ? (
          reservations.map((res) => (
            <li key={res._id} className="reservation-item">
               <span>
                {res.field.name} - {new Date(res.startTime).toLocaleString()} to{' '}
                {new Date(res.endTime).toLocaleString()}
              </span>
              <button onClick={() => cancelReservation(res._id)}>Cancel</button>
            </li>
          ))
        ) : (
          <p>You have no reservations.</p>
        )}
      </ul>

      <h2>Make a new reservation</h2>
      <form className="reservation-form" onSubmit={onSubmit}>
        <select name="fieldId" value={fieldId} onChange={onChange} required>
          <option value="">Select a Field</option>
          {fields.map((field) => (
            <option key={field._id} value={field._id}>
              {field.name} ({field.type}) - ${field.pricePerHour}/hr
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          name="startTime"
          value={startTime}
          onChange={onChange}
          required
        />
        <input
          type="datetime-local"
          name="endTime"
          value={endTime}
          onChange={onChange}
          required
        />
        <button type="submit">Reserve</button>
      </form>
    </div>
  );
};

export default ReservationsPage;