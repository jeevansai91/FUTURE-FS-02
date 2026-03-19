import React, { useState } from 'react';
import './App.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // For now, let's use a "Mock" login
    if (email === "admin@intern.com" && password === "1234") {
      onLogin(true);
    } else {
      alert("Invalid Credentials! (Try admin@intern.com / 1234)");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>🔒 CRM Login</h2>
        <p>Enter your credentials to access the dashboard</p>
        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" className="login-btn">Login to Dashboard</button>
        </form>
      </div>
    </div>
  );
}

export default Login;