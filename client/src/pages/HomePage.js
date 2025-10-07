import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <h1>Welcome to CourtSide</h1>
      <p>Your one-stop solution for booking sports fields.</p>
      <Link to="/reservations" className="cta-button">
        Book a Field
      </Link>
    </div>
  );
};

export default HomePage;