import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignInPage.css';

const SignInPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const { name, email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin ? { email, password } : { name, email, password };
    try {
      const { data } = await axios.post(url, payload, {
        baseURL: 'http://localhost:5000',
      });
      localStorage.setItem('token', data.token);
      alert('Success!');
      navigate('/reservations');
      window.location.reload();
    } catch (err) {
      console.error(err.response.data);
      alert('Error');
    }
  };

  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={onSubmit}>
        <h1>{isLogin ? 'Sign In' : 'Sign Up'}</h1>
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email Address"
          name="email"
          value={email}
          onChange={onChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={onChange}
          minLength="6"
          required
        />
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        <button
          type="button"
          className="toggle-button"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Need an account? Sign Up' : 'Have an account? Sign In'}
        </button>
      </form>
    </div>
  );
};

export default SignInPage;