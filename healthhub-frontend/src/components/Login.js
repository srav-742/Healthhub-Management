// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SupportBot from './common/SupportBot';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [successUser, setSuccessUser] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const executeRedirect = (role) => {
    switch (role) {
      case 'admin': navigate('/admin-dashboard'); break;
      case 'doctor': navigate('/doctor-dashboard'); break;
      case 'staff': navigate('/staff-dashboard'); break;
      case 'patient': navigate('/patient-dashboard'); break;
      default: navigate('/');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      return setError('Please enter both email and password.');
    }

    setLoading(true);
    setError('');

    try {
      // 🔐 Special Shankar Login
      /* 
      // 🔐 Special Shankar Login - MOVED TO BACKEND
      // This frontend check was preventing a real token from being issued.
      // The backend now handles this credential check and issues a valid JWT.
      if (email === 'shankar13052005@gmail.com' && password === '123456') {
        const mockUser = {
          name: 'Shankar Admin',
          email: 'shankar13052005@gmail.com',
          role: 'admin',
          status: 'approved',
        };
        handleSuccess(mockUser, 'mock-token');
        return;
      }
      */

      const res = await axios.post((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/auth/login', {
        email,
        password,
      });

      const { token, user } = res.data;

      if (user.role !== 'patient' && user.status !== 'approved') {
        setLoading(false);
        return setError('Your account is pending administrator approval.');
      }

      handleSuccess(user, token);

    } catch (err) {
      setLoading(false);
      const errorMsg =
        err.response?.data?.msg ||
        err.response?.data?.error ||
        'Invalid credentials. Please try again.';
      setError(errorMsg);
    }
  };

  const handleSuccess = (user, token) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    axios.defaults.headers.common['x-auth-token'] = token;

    setSuccessUser(user);
    setLoginSuccess(true);
    setLoading(false);

    // Show animation for 2.5 seconds then redirect
    setTimeout(() => {
      executeRedirect(user.role);
    }, 2500);
  };

  // SVG Animation Components
  const PatientAnimation = () => (
    <svg width="240" height="240" viewBox="0 0 240 240" fill="none">
      <circle cx="120" cy="120" r="100" fill="#E3F2FD" fillOpacity="0.8" />
      <path className="heart-line" d="M40 120H80L90 80L110 160L130 100L140 130L150 120H200" stroke="#2196F3" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <style>{`
        .heart-line {
          stroke-dasharray: 600;
          stroke-dashoffset: 600;
          animation: drawLine 2s linear infinite;
        }
        @keyframes drawLine {
          0% { stroke-dashoffset: 600; }
          50% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -600; }
        }
      `}</style>
    </svg>
  );

  const DoctorAnimation = () => (
    <svg width="240" height="240" viewBox="0 0 240 240" fill="none">
      <circle cx="120" cy="120" r="100" fill="#E0F2F1" fillOpacity="0.8" />
      <path className="stethoscope" d="M80 60C80 60 80 140 120 140C160 140 160 60 160 60M120 140V180M120 180C100 180 90 190 90 200M120 180C140 180 150 190 150 200" stroke="#00897B" strokeWidth="8" strokeLinecap="round" />
      <style>{`
        .stethoscope { animation: floatSteth 2.5s ease-in-out infinite; }
        @keyframes floatSteth {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </svg>
  );

  const StaffAnimation = () => (
    <svg width="240" height="240" viewBox="0 0 240 240" fill="none">
      <circle cx="120" cy="120" r="100" fill="#FFF8E1" fillOpacity="0.8" />
      <rect x="80" y="60" width="80" height="120" rx="12" stroke="#FF8F00" strokeWidth="6" />
      <path className="check-mark" d="M100 120L115 135L145 105" stroke="#FF8F00" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <style>{`
        .check-mark {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: checkInAnim 1.5s ease-out infinite;
        }
        @keyframes checkInAnim {
          0%, 20% { stroke-dashoffset: 100; }
          50%, 100% { stroke-dashoffset: 0; }
        }
      `}</style>
    </svg>
  );

  const AdminAnimation = () => (
    <svg width="240" height="240" viewBox="0 0 240 240" fill="none">
      <circle cx="120" cy="120" r="100" fill="#E8EAF6" fillOpacity="0.8" />
      <g className="gear-anim">
        <path d="M120 70V80M120 160V170M70 120H80M160 120H170M85 85L92 92M148 148L155 155M85 155L92 148M148 92L155 85" stroke="#3949AB" strokeWidth="10" strokeLinecap="round" />
        <circle cx="120" cy="120" r="30" stroke="#3949AB" strokeWidth="10" />
      </g>
      <style>{`
        .gear-anim {
          transform-origin: center;
          animation: rotateGear 6s linear infinite;
        }
        @keyframes rotateGear {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </svg>
  );

  const getRoleAnimation = (role) => {
    switch (role) {
      case 'patient': return <PatientAnimation />;
      case 'doctor': return <DoctorAnimation />;
      case 'staff': return <StaffAnimation />;
      case 'admin': return <AdminAnimation />;
      default: return null;
    }
  };

  const getRoleTheme = (role) => {
    switch (role) {
      case 'patient': return '#2196f3';
      case 'doctor': return '#00897b';
      case 'staff': return '#ff8f00';
      case 'admin': return '#3949ab';
      default: return '#0d47a1';
    }
  };

  return (
    <div className="login-full-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        .login-full-wrapper {
          height: 100vh;
          width: 100%;
          display: flex;
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #ffffff;
          overflow: hidden;
        }

        .side-pane-login {
          flex: 1.1;
          background: linear-gradient(135deg, #004d40 0%, #00695c 100%);
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          padding: 40px;
        }

        .side-pane-login::after {
          content: '';
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 30px 30px;
          z-index: 1;
        }

        .side-pane-content {
          position: relative;
          z-index: 2;
          text-align: center;
          color: white;
          animation: fadeInDown 0.6s ease-out;
        }

        .brand-header {
          position: absolute;
          top: 30px;
          left: 40px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: white;
          font-weight: 800;
          font-size: 1.8rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          z-index: 10;
        }

        .form-pane-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px 80px;
          background: #f0f4f8;
          border-left: 1px solid #e2e8f0;
          position: relative;
        }

        .login-title-h2 {
          font-size: 2rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 5px;
        }

        .login-title-p {
          color: #64748b;
          font-size: 0.95rem;
          margin-bottom: 30px;
        }

        .input-group-login {
          margin-bottom: 20px;
        }

        .label-login-text {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          color: #475569;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .input-control-login {
          width: 100%;
          padding: 14px 18px;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-family: inherit;
          font-size: 0.95rem;
          color: #1e293b;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .input-control-login:focus {
          outline: none;
          border-color: #00695c;
          box-shadow: 0 0 0 4px rgba(0, 105, 92, 0.05);
        }

        .signin-btn-main {
          width: 100%;
          padding: 16px;
          background: #004d40;
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 800;
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 15px;
          box-shadow: 0 10px 20px rgba(0, 77, 64, 0.15);
        }

        .signin-btn-main:hover:not(:disabled) {
          background: #00695c;
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(0, 77, 64, 0.2);
        }

        .error-notif-box {
          background: #fef2f2;
          color: #991b1b;
          padding: 12px 18px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          border-left: 4px solid #ef4444;
        }

        /* Full Page Success Overlay */
        .full-success-overlay {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background: #ffffff;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          animation: pageIn 0.8s cubic-bezier(0.19, 1, 0.22, 1);
        }

        @keyframes pageIn {
          from { opacity: 0; transform: scale(1.1); }
          to { opacity: 1; transform: scale(1); }
        }

        .welcome-msg {
          font-size: 2.8rem;
          font-weight: 900;
          color: #0f172a;
          margin-top: 40px;
        }

        .role-badge-msg {
          font-size: 1.4rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 3px;
          margin-top: 15px;
          padding: 10px 30px;
          border-radius: 50px;
          background: #f8fafc;
        }

        @media (max-width: 1024px) {
          .login-full-wrapper { 
            flex-direction: column; 
            overflow-y: auto; 
            height: auto; 
            min-height: 100vh;
          }
          .side-pane-login { 
            height: 250px; 
            flex: none; 
            padding: 40px 20px;
          }
          .side-pane-content h2 { font-size: 2.2rem !important; }
          .side-pane-content p { font-size: 1rem !important; }
          .form-pane-right { 
            padding: 80px 25px 40px; 
            border-left: none; 
            flex: none;
            width: 100%;
            background: #ffffff;
          }
          .brand-header {
            position: absolute;
            top: 25px;
            left: 50%;
            transform: translateX(-50%);
            width: 100%;
            display: flex;
            justify-content: center;
            color: white !important;
            z-index: 50;
            font-size: 2.2rem !important;
          }
          .login-title-h2 { font-size: 1.8rem; text-align: center; margin-top: 20px; }
          .login-title-p { text-align: center; margin-bottom: 25px; }
        }
      `}</style>

      {/* Brand Logo */}
      <div className="brand-header">
        <span style={{ fontSize: '2.4rem' }}>☤</span>
        <span>HealthHub</span>
      </div>

      <div className="side-pane-login">
        <div className="side-pane-content">
          <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '15px' }}>Secure<br />Identity.</h2>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '400px' }}>
            Safely accessing your medical coordinate profile within the clinical ecosystem.
          </p>
        </div>
      </div>

      <div className="form-pane-right">
        {loginSuccess && successUser && (
          <div className="full-success-overlay">
            {getRoleAnimation(successUser.role)}
            <h1 className="welcome-msg">Welcome, {successUser.name}!</h1>
            <div className="role-badge-msg" style={{ color: getRoleTheme(successUser.role), border: `2px solid ${getRoleTheme(successUser.role)}` }}>
              {successUser.role} Dashboard
            </div>
            <p style={{ marginTop: '30px', color: '#64748b', fontSize: '1.1rem' }}>Initiating secure session...</p>
          </div>
        )}

        <div className="form-actual-content">
          <h2 className="login-title-h2">Sign In</h2>
          <p className="login-title-p">Welcome back. Please enter your credentials.</p>

          {error && <div className="error-notif-box">⚠ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group-login">
              <label className="label-login-text">System Email</label>
              <input
                className="input-control-login"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="shankar@healthhub.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="input-group-login">
              <label className="label-login-text">Access Password</label>
              <input
                className="input-control-login"
                type="password"
                name="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <button className="signin-btn-main" type="submit" disabled={loading}>
              {loading ? "Authenticating..." : "Authorize Access"}
            </button>
          </form>

          <div style={{ marginTop: '40px', textAlign: 'center', color: '#94a3b8' }}>
            New user? <a href="/signup" style={{ color: '#00695c', fontWeight: 700, textDecoration: 'none' }}>Create Account</a>
          </div>
        </div>
      </div>

      <SupportBot />
    </div>
  );
};

export default Login;