import React, { useState } from 'react';
import { MandalaPattern } from './icons';

interface SignUpFormProps {
  onSwitch: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirm) {
      setError('Please fill all fields.');
    } else if (password !== confirm) {
      setError('Passwords do not match.');
    } else {
      setError('');
      // Add registration logic here
      alert('Sign up successful!');
    }
  };

  return (
    <div className="heritage-form-container">
      <MandalaPattern className="heritage-icon" />
      <h2 className="heritage-title">Sign Up for Heritage Portal</h2>
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className="heritage-input"
        />
        {error && <div className="heritage-error">{error}</div>}
        <button type="submit" className="heritage-btn">Sign Up</button>
      </form>
      <div className="heritage-switch">
        Already have an account?{' '}
        <button type="button" className="heritage-link" onClick={onSwitch}>
          Login
        </button>
      </div>
    </div>
  );
};

export default SignUpForm;
