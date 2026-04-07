import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SupportBot from './common/SupportBot';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, role } = formData;

    if (!name || !email || !password || !role) {
      return setError('All fields are required.');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Registration failed');

      // ✅ Store in localStorage for Profile Forms to access
      localStorage.setItem('pendingProfile', JSON.stringify({ name, email, role }));
      localStorage.setItem('tempSignupPassword', password);

      const navigationState = { name, email, password };
      switch (role) {
        case 'admin': navigate('/admin/profile', { state: navigationState }); break;
        case 'doctor': navigate('/doctor/profile', { state: navigationState }); break;
        case 'staff': navigate('/staff/profile', { state: navigationState }); break;
        case 'patient': navigate('/patient/profile', { state: navigationState }); break;
        default: navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // SVG Animation Components
  const PatientAnimation = () => (
    <svg width="200" height="200" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="120" cy="120" r="100" fill="#E3F2FD" fillOpacity="0.8" />
      <path className="heart-line" d="M40 120H80L90 80L110 160L130 100L140 130L150 120H200" stroke="#2196F3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <style>{`
        .heart-line {
          stroke-dasharray: 600;
          stroke-dashoffset: 600;
          animation: drawLine 3s linear infinite;
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
    <svg width="200" height="200" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="120" cy="120" r="100" fill="#E0F2F1" fillOpacity="0.8" />
      <path className="stethoscope" d="M80 60C80 60 80 140 120 140C160 140 160 60 160 60M120 140V180M120 180C100 180 90 190 90 200M120 180C140 180 150 190 150 200" stroke="#00897B" strokeWidth="6" strokeLinecap="round" />
      <style>{`
        .stethoscope { animation: float 3s ease-in-out infinite; }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </svg>
  );

  const StaffAnimation = () => (
    <svg width="200" height="200" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="120" cy="120" r="100" fill="#FFF8E1" fillOpacity="0.8" />
      <rect x="80" y="60" width="80" height="120" rx="8" stroke="#FF8F00" strokeWidth="4" />
      <path className="check-mark" d="M100 120L115 135L145 105" stroke="#FF8F00" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <style>{`
        .check-mark {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: checkIn 2s ease-out infinite;
        }
        @keyframes checkIn {
          0%, 20% { stroke-dashoffset: 100; }
          50%, 100% { stroke-dashoffset: 0; }
        }
      `}</style>
    </svg>
  );

  const AdminAnimation = () => (
    <svg width="200" height="200" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="120" cy="120" r="100" fill="#E8EAF6" fillOpacity="0.8" />
      <g className="gear-container">
        <path d="M120 70V80M120 160V170M70 120H80M160 120H170M85 85L92 92M148 148L155 155M85 155L92 148M148 92L155 85" stroke="#3949AB" strokeWidth="8" strokeLinecap="round" />
        <circle cx="120" cy="120" r="30" stroke="#3949AB" strokeWidth="8" />
      </g>
      <style>{`
        .gear-container {
          transform-origin: center;
          animation: rotateGear 10s linear infinite;
        }
        @keyframes rotateGear {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </svg>
  );

  const roleStyles = {
    patient: { theme: '#2196f3', text: "Patient Dashboard", animation: <PatientAnimation /> },
    doctor: { theme: '#00897b', text: "Doctor Dashboard", animation: <DoctorAnimation /> },
    staff: { theme: '#ff8f00', text: "Staff Dashboard", animation: <StaffAnimation /> },
    admin: { theme: '#3949ab', text: "Admin Dashboard", animation: <AdminAnimation /> }
  };

  const currentRole = roleStyles[formData.role];

  return (
    <div className="signup-base">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        .signup-base {
          height: 100vh;
          width: 100%;
          display: flex;
          font-family: 'Plus Jakarta Sans', sans-serif;
          overflow: hidden;
          background: #ffffff;
        }

        .visual-pane {
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

        .visual-pane::after {
          content: '';
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 30px 30px;
          z-index: 1;
        }

        .visual-content {
          position: relative;
          z-index: 2;
          text-align: center;
          color: white;
          animation: fadeInDown 0.6s ease-out;
        }

        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .visual-title {
          font-size: 2.2rem;
          font-weight: 800;
          margin-top: 25px;
          color: #e0f2f1;
          letter-spacing: -0.5px;
        }

        .visual-desc {
          font-size: 1rem;
          opacity: 0.8;
          margin-top: 10px;
          max-width: 350px;
          line-height: 1.5;
        }

        .form-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 40px 60px;
          background: #f8fafc;
          border-left: 1px solid #e2e8f0;
          position: relative;
        }

        .top-header {
          position: absolute;
          top: 30px;
          left: 60px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #004d40;
          font-weight: 800;
          font-size: 1.8rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .signup-card-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 5px;
        }

        .signup-card-p {
          color: #64748b;
          font-size: 0.95rem;
          margin-bottom: 25px;
        }

        .input-row {
          margin-bottom: 15px;
        }

        .label-text {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          color: #475569;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .input-control {
          width: 100%;
          padding: 12px 16px;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-family: inherit;
          font-size: 0.9rem;
          color: #1e293b;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .input-control:focus {
          outline: none;
          border-color: #00695c;
          box-shadow: 0 0 0 4px rgba(0, 105, 92, 0.05);
        }

        .action-btn {
          width: 100%;
          padding: 14px;
          background: #004d40;
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 800;
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 10px;
        }

        .action-btn:hover:not(:disabled) {
          background: #00695c;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 77, 64, 0.15);
        }

        .error-notif {
          background: #fef2f2;
          color: #991b1b;
          padding: 10px 15px;
          border-radius: 8px;
          margin-bottom: 15px;
          font-size: 0.85rem;
          font-weight: 600;
          border-left: 4px solid #ef4444;
        }

        .sub-footer {
          margin-top: 20px;
          text-align: center;
          color: #94a3b8;
          font-size: 0.85rem;
        }

        .sub-footer a {
          color: #00695c;
          font-weight: 700;
          text-decoration: none;
        }

        @media (max-width: 1024px) {
          .signup-base { 
            flex-direction: column; 
            overflow-y: auto; 
            height: auto; 
            min-height: 100vh;
          }
          .visual-pane { 
            height: 280px; 
            padding: 60px 20px 20px; 
            flex: none;
            position: relative;
          }
          .visual-title { font-size: 1.6rem; margin-top: 15px; }
          .visual-desc { font-size: 0.9rem; max-width: 280px; }
          .form-area { 
            padding: 80px 25px 40px; 
            border-left: none; 
            flex: none;
            width: 100%;
            background: #ffffff;
          }
          .top-header {
            position: absolute;
            top: 25px;
            left: 50%;
            transform: translateX(-50%);
            width: 100%;
            display: flex;
            justify-content: center;
            color: #004d40;
            z-index: 20;
            font-size: 2.2rem !important;
          }
          .signup-card-title { font-size: 1.6rem; text-align: center; }
          .signup-card-p { text-align: center; margin-bottom: 20px; }
        }
      `}</style>

      <div className="visual-pane">
        <div className="visual-content" key={formData.role}>
          {currentRole.animation}
          <h1 className="visual-title">{currentRole.text}</h1>
          <p className="visual-desc">
            Experience advanced medical management with localized system intelligence.
          </p>
        </div>
      </div>

      <div className="form-area">
        <header className="top-header">
          <span style={{ fontSize: '2.2rem' }}>☤</span>
          <span>HealthHub</span>
        </header>

        <div style={{ marginTop: '40px' }}>
          <h2 className="signup-card-title">Create Account</h2>
          <p className="signup-card-p">Join our clinical network today.</p>

          {error && <div className="error-notif">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-row">
              <label className="label-text">Full Name</label>
              <input
                className="input-control"
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Shankar Raman"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="input-row">
              <label className="label-text">Email Address</label>
              <input
                className="input-control"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="shankar@hms.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="input-row">
              <label className="input-row">Password</label>
              <input
                className="input-control"
                type="password"
                name="password"
                placeholder="Min. 6 chars"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="input-row">
              <label className="label-text">Register As</label>
              <select
                className="input-control"
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button className="action-btn" type="submit" disabled={loading}>
              {loading ? "Registering..." : "Create Free Account"}
            </button>
          </form>

          <div className="sub-footer">
            Member already? <a href="/login">Sign In Here</a>
          </div>
        </div>
      </div>

      <SupportBot />
    </div>
  );
};

export default SignUp;