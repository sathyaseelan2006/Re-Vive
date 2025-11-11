import React, { useState } from 'react';
import { TempleIcon } from './icons';

interface LoginFormProps {
  onSwitch: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock validation
    if (!email || !password) {
      setError('Please enter both email and password.');
    } else {
      setError('');
      // Add authentication logic here
      alert('Login successful!');
    }
  };

  return (
    <div className="heritage-form-container">
      <TempleIcon className="heritage-icon" />
      <h2 className="heritage-title">Login to Heritage Portal</h2>
      <form className="heritage-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="heritage-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="heritage-input"
        />
        {error && <div className="heritage-error">{error}</div>}
        <button type="submit" className="heritage-btn">Login</button>
      </form>
      <div className="heritage-switch">
        New here?{' '}
        <button type="button" className="heritage-link" onClick={onSwitch}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
