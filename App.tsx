import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';

function App() {
  const [view, setView] = useState<'login' | 'signup'>('login');

  return (
    <div className="app-container">
      <div className="heritage-header-section">
        <h1 className="heritage-main-title">Re:Vive</h1>
        <p className="heritage-subtitle">An Intelligent Cultural Platform</p>
      </div>
      
      {view === 'login' ? (
        <LoginForm onSwitch={() => setView('signup')} />
      ) : (
        <SignUpForm onSwitch={() => setView('login')} />
      )}
    </div>
  );
}

export default App;
