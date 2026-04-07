// src/profiles/PatientProfileForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const PatientProfileForm = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to access state passed from navigate
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [medicalProblem, setMedicalProblem] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [contact, setContact] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  useEffect(() => {


    // 1. Try to get data from navigation state (most secure/direct)
    const stateData = location.state;

    // 2. Fallback to localStorage (if user refreshed page)
    const storageData = JSON.parse(localStorage.getItem('pendingProfile'));

    // Prioritize State, then Storage
    const profileData = stateData || storageData;

    // Validation
    if (!profileData || (profileData.role && profileData.role !== 'patient')) {
      // Note: SignUp might not pass role in state object explicitly if not added to navigationState,
      // but let's assume valid flow if name/email exist.
      if (!profileData || (!profileData.email)) {
        setError('Access denied. Please sign up first.');
        return;
      }
    }

    setName(profileData.name || '');
    setEmail(profileData.email || '');
    setAddress(profileData.address || ''); // If pre-filled
    setMedicalProblem(profileData.medicalProblem || '');

    // Ensure password from state is available or fallback to localstorage for validation later
    if (stateData && stateData.password) {
      // We can store it temporarily in a state variable or ref if needed, 
      // but component logic currently uses localStorage for password check.
      // Let's ensure localStorage has the password if it came from state, 
      // to keep the existing validation logic working without major refactor.
      localStorage.setItem('tempSignupPassword', stateData.password);
    }

  }, [location.state]);

  // Calculate age when DOB changes
  useEffect(() => {
    if (dob) {
      const today = new Date();
      const birthDate = new Date(dob);
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge);
    } else {
      setAge('');
    }
  }, [dob]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Required fields
    if (!dob || !gender || !contact || !bloodGroup || !address || !medicalProblem || !confirmPassword) {
      return setError('All fields are required.');
    }
    if (!/^[0-9]{10}$/.test(contact)) {
      return setError('Contact must be a 10-digit number.');
    }
    // 🔐 Password match check
    const originalPassword = localStorage.getItem('tempSignupPassword');
    if (confirmPassword !== originalPassword) {
      return setError('Password did not match.');
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const patientData = {
        name,
        email,
        address,
        medicalProblem,
        dob,
        age,
        gender,
        contact,
        bloodGroup,
        password: confirmPassword,
      };

      const res = await axios.post((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/patients', patientData);

      if (res.data.message?.includes('success') || res.status === 201) {
        setMessage('🎉 Patient profile created successfully!');
        // ✅ Cleanup
        localStorage.removeItem('pendingProfile');
        localStorage.removeItem('tempSignupPassword');
      } else {
        setError('Failed to save profile.');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.response?.data?.message || 'Network error. Could not submit form.');
    } finally {
      setLoading(false);
    }
  };

  // Show access denied if no pending data
  if (error && !name) {
    return (
      <div className="profile-container">
        <div className="error-box">
          <h2>🔒 Access Denied</h2>
          <p>You must sign up first to create a profile.</p>
          <button onClick={() => navigate('/signup')} className="btn-primary">
            Go to Sign Up
          </button>
        </div>
      </div>
    );
  }

  // Professional Lavender/Indigo Background
  const bgImage = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";

  return (
    <div className="profile-container">
      <style>{`
        .profile-container {
          position: relative;
          min-height: 100vh;
          width: 100%;
          background-image: url(${bgImage});
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          padding: 40px 20px;
          font-family: 'Segoe UI', 'Roboto', sans-serif;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }

        .profile-container::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(135deg, rgba(81, 45, 168, 0.85), rgba(49, 27, 146, 0.8)); /* Deep Purple/Indigo Gradient */
          z-index: 0;
        }

        .profile-card {
          position: relative;
          z-index: 10;
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 50px;
          border-radius: 24px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
          width: 100%;
          max-width: 900px;
          opacity: 0;
          transform: translateY(30px);
          animation: fadeInUp 0.8s ease-out forwards;
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); }
        }

        .header-section {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 2px solid #ede7f6;
          padding-bottom: 20px;
        }

        .main-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #4527a0; /* Deep Purple */
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }

        .sub-title {
          font-size: 1rem;
          color: #7e57c2;
          font-style: italic;
        }

        /* Grouped Sections */
        .form-section {
          margin-bottom: 30px;
          background: #f3e5f5; /* Very Light Purple */
          padding: 25px;
          border-radius: 16px;
          border: 1px solid #e1bee7;
        }

        .section-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          color: #5e35b1;
          font-size: 1.25rem;
          font-weight: 700;
          border-bottom: 1px dashed #d1c4e9;
          padding-bottom: 8px;
        }

        .section-icon {
          margin-right: 10px;
          font-size: 1.4rem;
        }

        /* GRID SYSTEM */
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        @media (max-width: 768px) {
          .profile-container { padding: 15px 10px; }
          .profile-card { padding: 25px 15px; border-radius: 16px; }
          .main-title { font-size: 1.6rem; }
          .form-section { padding: 15px; margin-bottom: 20px; }
          .form-grid { grid-template-columns: 1fr; gap: 15px; }
          .section-header { font-size: 1.1rem; }
          .submit-btn { padding: 15px; font-size: 1rem; }
        }

        .full-width {
          grid-column: 1 / -1;
        }

        .input-group {
          display: flex;
          flex-direction: column;
        }

        .input-group label {
          margin-bottom: 8px;
          font-weight: 600;
          color: #4a148c;
          font-size: 0.9rem;
        }

        .input-group input,
        .input-group select {
          padding: 12px 16px;
          border: 2px solid #d1c4e9;
          border-radius: 10px;
          font-size: 1rem;
          background-color: white;
          transition: all 0.3s ease;
          color: #311b92;
        }

        .input-group input:focus,
        .input-group select:focus {
          border-color: #7e57c2;
          box-shadow: 0 0 0 4px rgba(126, 87, 194, 0.2);
          outline: none;
        }

        .input-group input:disabled,
        .input-group input:read-only {
          background-color: #f3e5f5;
          color: #9575cd;
          border-color: #e1bee7;
          cursor: not-allowed;
        }

        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #512da8, #311b92);
          color: white;
          padding: 18px;
          border: none;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(49, 27, 146, 0.3);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 10px;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(49, 27, 146, 0.4);
          background: linear-gradient(135deg, #673ab7, #4527a0);
        }

        .submit-btn:disabled {
          background: #b39ddb;
          cursor: not-allowed;
          box-shadow: none;
        }

        .error-banner {
          background-color: #ffebee;
          color: #c62828;
          padding: 15px;
          border-radius: 10px;
          text-align: center;
          margin-bottom: 25px;
          border: 1px solid #ffcdd2;
          font-weight: 600;
        }

        .success-card {
          text-align: center;
          padding: 30px;
          background: #e8f5e9;
          border-radius: 16px;
          border: 1px solid #a5d6a7;
        }

        .success-title {
          color: #2e7d32;
          font-size: 1.6rem;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .login-btn {
          margin-top: 20px;
          padding: 12px 30px;
          background: #43a047;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .login-btn:hover {
          background: #2e7d32;
          transform: scale(1.05);
        }

        .error-box {
          background: white;
          padding: 40px;
          border-radius: 12px;
          text-align: center;
          color: #b71c1c;
        }
        .btn-primary {
          background: #512da8;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          margin-top: 15px;
        }
      `}</style>

      <div className="profile-card">
        <div className="header-section">
          <h1 className="main-title">Patient Health Profile</h1>
          <p className="sub-title">"Your Health Journey Starts Here"</p>
        </div>

        {error && <div className="error-banner">⚠️ {error}</div>}

        {message ? (
          <div className="success-card">
            <h2 className="success-title">{message}</h2>
            <p className="success-tagline">
              Your profile is secure. Please login to access your dashboard.
            </p>
            <button className="login-btn" onClick={() => navigate('/login')}>
              🔐 Proceed to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>

            {/* Personal Information */}
            <div className="form-section">
              <div className="section-header">
                <span className="section-icon">👤</span> Personal Information
              </div>
              <div className="form-grid">
                <div className="input-group">
                  <label>Full Name</label>
                  <input type="text" value={name} disabled />
                </div>
                <div className="input-group">
                  <label>Email Address</label>
                  <input type="email" value={email} disabled />
                </div>
                <div className="input-group">
                  <label>Date of Birth</label>
                  <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
                </div>
                <div className="input-group">
                  <label>Age</label>
                  <input type="text" value={age || ''} readOnly placeholder="Auto-calculated" />
                </div>
                <div className="input-group">
                  <label>Gender</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Contact Number</label>
                  <input type="tel" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="10-digit number" required pattern="[0-9]{10}" maxLength="10" />
                </div>
              </div>
            </div>

            {/* Medical Details */}
            <div className="form-section">
              <div className="section-header">
                <span className="section-icon">❤️</span> Medical Details
              </div>
              <div className="form-grid">
                <div className="input-group">
                  <label>Blood Group</label>
                  <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} required>
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Primary Medical Concern</label>
                  <input type="text" value={medicalProblem} onChange={(e) => setMedicalProblem(e.target.value)} placeholder="e.g., Diabetes, Hypertension" required />
                </div>
                <div className="input-group full-width">
                  <label>Residential Address</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full Residential Address" required />
                </div>
              </div>
            </div>

            {/* Security Check */}
            <div className="form-section" style={{ borderColor: '#ef9a9a', background: '#fffbee' }}>
              <div className="section-header" style={{ color: '#c62828' }}>
                <span className="section-icon">🔐</span> Security Verification
              </div>
              <div className="form-grid">
                <div className="input-group full-width">
                  <label style={{ color: '#c62828' }}>Confirm Password</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter your signup password" required style={{ borderColor: '#ef9a9a' }} />
                </div>
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Complete Profile Setup'}
            </button>

          </form>
        )}
      </div>
    </div>
  );
};

export default PatientProfileForm;