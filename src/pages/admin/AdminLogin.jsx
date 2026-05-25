import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = window.location.hostname === 'localhost' ? 'http://localhost:8000/admin_login.php' : '/backend/admin_login.php';
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        localStorage.setItem('elaura_admin_auth', data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection failed. Please check your network or try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        
        {/* Left Side: Dark Illustration Panel */}
        <div className="login-left">
          <div className="login-left-content">
            <div className="login-left-header">
              <h3 className="selected-works">Elaura Admin</h3>
              <div className="login-left-nav">
                <span>Sign Up</span>
                <button className="btn-join">Support</button>
              </div>
            </div>
            
            <div className="login-left-footer">
              <div className="profile-badge">
                <img src="https://i.pravatar.cc/100?img=11" alt="Profile" className="profile-img" />
                <div className="profile-info">
                  <h4>Super Admin</h4>
                  <p>System Controller</p>
                </div>
              </div>
              <div className="nav-arrows">
                <button>&larr;</button>
                <button>&rarr;</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="login-right">
          <div className="login-right-header">
            <h2>ELAURA SYSTEM</h2>
            <div className="lang-selector">🇬🇧 EN ⌄</div>
          </div>
          
          <div className="login-form-container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="greeting">Hi Super Admin</h1>
              <p className="subtitle">Welcome back to Elaura Dashboard</p>

              <form onSubmit={handleLogin} className="login-form">
                <div className="input-group">
                  <input 
                    type="text" 
                    placeholder="Email or Username" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
                
                <div className="input-group">
                  <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
                
                {error && <div className="error-text">{error}</div>}

                <button type="submit" className="btn-login-submit" disabled={loading}>
                  {loading ? 'Authenticating...' : 'Login'}
                </button>
              </form>
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
