import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
  const [reservations, setReservations] = useState([]);
  const [fields, setFields] = useState([]);
  const [fieldFormData, setFieldFormData] = useState({
    name: '',
    type: 'football',
    pricePerHour: '',
  });

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('/api/reservations', {
        baseURL: 'http://localhost:5000',
        headers: { 'x-auth-token': token },
      });
      setReservations(data);
    } catch (err) {
      console.error(err);
      // Handled by AdminRoute, but good to have a fallback
      if (err.response && err.response.status !== 401) {
        alert('Could not fetch reservations.');
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

  useEffect(() => {
    fetchReservations();
    fetchFields();
  }, []);

  const onFieldChange = (e) =>
    setFieldFormData({ ...fieldFormData, [e.target.name]: e.target.value });

  const onFieldSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/fields', fieldFormData, {
        baseURL: 'http://localhost:5000',
        headers: { 'x-auth-token': token },
      });
      fetchFields();
      alert('Field added!');
      setFieldFormData({ name: '', type: 'football', pricePerHour: '' }); // Reset form
    } catch (err) {
      console.error(err.response.data);
      alert('Error adding field');
    }
  };

  const deleteField = async (id) => {
    if (window.confirm('Are you sure you want to delete this field?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/fields/${id}`, {
          baseURL: 'http://localhost:5000',
          headers: { 'x-auth-token': token },
        });
        fetchFields();
        alert('Field deleted');
      } catch (err) {
        console.error(err.response.data);
        alert('Error deleting field');
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="admin-section">
        <h2>All Reservations</h2>
        <ul className="admin-list">
          {reservations.map((res) => (
            <li key={res._id} className="admin-list-item">
              <span>
                {res.field?.name} by <strong>{res.user?.name}</strong> -{' '}
                {new Date(res.startTime).toLocaleString()} to{' '}
                {new Date(res.endTime).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="admin-section">
        <h2>Manage Fields</h2>
        <ul className="admin-list">
          {fields.map((field) => (
            <li key={field._id} className="admin-list-item">
              <span>
                {field.name} ({field.type}) - ${field.pricePerHour}/hr
              </span>
              <button onClick={() => deleteField(field._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="admin-section">
        <h2>Add New Field</h2>
        <form className="add-field-form" onSubmit={onFieldSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Field Name"
            value={fieldFormData.name}
            onChange={onFieldChange}
            required
          />
          <select
            name="type"
            value={fieldFormData.type}
            onChange={onFieldChange}
            required
          >
            <option value="football">Football</option>
            <option value="tennis">Tennis</option>
            <option value="paddel">Paddel</option>
            <option value="basketball">Basketball</option>
          </select>
          <input
            type="number"
            name="pricePerHour"
            placeholder="Price Per Hour"
            value={fieldFormData.pricePerHour}
            onChange={onFieldChange}
            required
          />
          <button type="submit">Add Field</button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboardPage;