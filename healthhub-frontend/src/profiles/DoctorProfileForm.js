// src/profiles/DoctorProfileForm.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DoctorProfileForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get data from location.state or fallback to localStorage
  const fromState = location.state;
  const fromStorage = JSON.parse(localStorage.getItem('pendingProfile'));
  const tempPassword = localStorage.getItem('tempSignupPassword');

  const name = fromState?.name || fromStorage?.name || '';
  const email = fromState?.email || fromStorage?.email || '';
  const signupPassword = fromState?.password || tempPassword || '';

  const [formData, setFormData] = useState({
    name,
    email,
    dob: '',
    age: '',
    gender: '',
    qualification: '',
    specialization: '',
    experience: '',
    phone: '',
    availableDays: [], // Array for selected days
    availableTime: '',
    address: '',
    consultationFee: '', // 🔁 New field added here
    password: '', // Renamed from confirmPassword
  });

  const [originalPassword, setOriginalPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  // Validate required data on load
  useEffect(() => {

    if (!name || !email || !signupPassword) {
      setError('Signup information missing. Please sign up again.');
      setTimeout(() => navigate('/signup'), 1500);
      return;
    }
    setOriginalPassword(signupPassword);
  }, [name, email, signupPassword, navigate]);

  const handleChange = (e) => {
    const { name: fieldName, value, checked } = e.target; // ✅ Removed unused 'type'

    if (fieldName === 'availableDays') {
      // Handle checkbox group
      setFormData((prev) => {
        const updatedDays = checked
          ? [...prev.availableDays, value]
          : prev.availableDays.filter((day) => day !== value);
        return { ...prev, availableDays: updatedDays };
      });
    } else {
      setFormData((prev) => ({ ...prev, [fieldName]: value }));
    }
  };

  // Auto-calculate age from DOB
  useEffect(() => {
    if (formData.dob) {
      const today = new Date();
      const birthDate = new Date(formData.dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      setFormData((prev) => ({ ...prev, age }));
    }
  }, [formData.dob]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Confirm password matches signup password
    if (formData.password !== originalPassword) {
      setError('Incorrect password. Please enter the password you used during signup.');
      return;
    }

    const payload = {
      ...formData,
      password: originalPassword, // Send original password
    };

    try {
      await axios.post((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/doctor/profile-public', payload);

      setSuccessMessage('Profile submitted successfully! Awaiting admin approval.');

      // Redirect to home after success
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to submit profile';
      console.error('Submission Error:', errorMsg);
      setError(errorMsg);
    }
  };

  // Days of the week
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Professional Teal Background
  const bgImage = "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80";

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
          background: linear-gradient(135deg, rgba(0, 121, 107, 0.9), rgba(0, 77, 64, 0.8)); /* Teal Gradient */
          z-index: 0;
        }

        .profile-card {
          position: relative;
          z-index: 10;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          padding: 50px;
          border-radius: 24px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
          width: 100%;
          max-width: 900px;
          opacity: 0;
          transform: translateY(30px);
          animation: fadeInUp 0.8s ease-out forwards;
          border: 1px solid rgba(255, 255, 255, 0.6);
        }

        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); }
        }

        .header-section {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 2px solid #e0f2f1;
          padding-bottom: 20px;
        }

        .main-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #00695c;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }

        .sub-title {
          font-size: 1rem;
          color: #546e7a;
          font-style: italic;
        }

        .welcome-banner {
          background-color: #e0f2f1;
          color: #004d40;
          padding: 15px;
          border-radius: 12px;
          text-align: center;
          margin-bottom: 30px;
          font-weight: 500;
          border-left: 5px solid #00897b;
        }

        .form-section {
          margin-bottom: 35px;
          background: #fdfdfd;
          padding: 25px;
          border-radius: 16px;
          border: 1px solid #eeeeee;
        }

        .section-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          color: #00796b;
          font-size: 1.25rem;
          font-weight: 700;
          border-bottom: 1px dashed #b2dfdb;
          padding-bottom: 10px;
        }

        .section-icon {
          margin-right: 10px;
          font-size: 1.5rem;
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
          color: #37474f;
          font-size: 0.9rem;
        }

        .input-group input:not([type="checkbox"]),
        .input-group select {
          padding: 12px 16px;
          border: 2px solid #cfd8dc;
          border-radius: 10px;
          font-size: 1rem;
          background-color: white;
          transition: all 0.3s ease;
          color: #263238;
        }

        .input-group input:focus,
        .input-group select:focus {
          border-color: #00897b;
          box-shadow: 0 0 0 4px rgba(0, 137, 123, 0.1);
          outline: none;
        }

        .input-group input:read-only {
          background-color: #f5f5f5;
          color: #78909c;
          border-color: #eeeeee;
          cursor: not-allowed;
        }

        /* Checkbox Group Styling */
        .checkbox-group {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          padding: 8px 0;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          background: #f1f8e9;
          padding: 8px 14px;
          border-radius: 20px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background 0.2s;
          border: 1px solid #c5e1a5;
          color: #33691e;
        }

        .checkbox-label:hover {
          background: #dcedc8;
        }

        .checkbox-label input {
          margin-right: 8px;
          accent-color: #2e7d32;
        }

        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #00897b, #00695c);
          color: white;
          padding: 18px;
          border: none;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(0, 105, 92, 0.3);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 20px;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(0, 105, 92, 0.4);
          background: linear-gradient(135deg, #26a69a, #00897b);
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

        .success-banner {
           background-color: #e8f5e9;
           color: #2e7d32;
           padding: 20px;
           border-radius: 12px;
           text-align: center;
           margin-bottom: 20px;
           border: 1px solid #a5d6a7;
           font-size: 1.1rem;
           font-weight: bold;
        }
      `}</style>

      <div className="profile-card">
        <div className="header-section">
          <h2 className="main-title">Doctor Profile Setup</h2>
          <p className="sub-title">"Empowering Healers, Connecting Lives"</p>
        </div>

        <div className="welcome-banner">
          👋 Welcome, <strong>Dr. {name.split(' ').pop()}</strong>! Please complete your medical profile.
        </div>

        {error && <div className="error-banner">⚠️ {error}</div>}
        {successMessage && <div className="success-banner">✅ {successMessage}</div>}

        <form onSubmit={handleSubmit}>

          {/* Identity Section */}
          <div className="form-section">
            <div className="section-header">
              <span className="section-icon">🆔</span> Identity Verification
            </div>
            <div className="form-grid">
              <div className="input-group">
                <label>Full Name</label>
                <input type="text" name="name" value={formData.name} readOnly />
              </div>
              <div className="input-group">
                <label>Email Address</label>
                <input type="email" name="email" value={formData.email} readOnly />
              </div>
              <div className="input-group">
                <label>Date of Birth</label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Age</label>
                <input type="number" name="age" value={formData.age} readOnly />
              </div>
              <div className="input-group">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="input-group">
                <label>Mobile Number</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} required placeholder="e.g. +91 98765 43210" />
              </div>
            </div>
          </div>

          {/* Professional Credentials */}
          <div className="form-section">
            <div className="section-header">
              <span className="section-icon">🩺</span> Professional Credentials
            </div>
            <div className="form-grid">
              <div className="input-group">
                <label>Qualification</label>
                <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} required placeholder="e.g. MBBS, MD, MS" />
              </div>
              <div className="input-group">
                <label>Specialization</label>
                <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} required placeholder="e.g. Cardiology, Neurology" />
              </div>
              <div className="input-group">
                <label>Experience (Years)</label>
                <input type="text" name="experience" value={formData.experience} onChange={handleChange} required placeholder="e.g. 8 Years" />
              </div>
              <div className="input-group">
                <label>Consultation Fee (₹)</label>
                <input type="number" name="consultationFee" value={formData.consultationFee} onChange={handleChange} required placeholder="e.g. 500" />
              </div>
            </div>
          </div>

          {/* Availability & Location */}
          <div className="form-section">
            <div className="section-header">
              <span className="section-icon">🏥</span> Clinic & Availability
            </div>
            <div className="form-grid">
              <div className="input-group full-width">
                <label>Available Days</label>
                <div className="checkbox-group">
                  {days.map((day) => (
                    <label key={day} className="checkbox-label">
                      <input
                        type="checkbox"
                        value={day}
                        checked={formData.availableDays.includes(day)}
                        onChange={handleChange}
                        name="availableDays"
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </div>
              <div className="input-group full-width">
                <label>Available Time Slots</label>
                <input type="text" name="availableTime" value={formData.availableTime} onChange={handleChange} placeholder="e.g. 10:00 AM - 2:00 PM, 5:00 PM - 9:00 PM" required />
              </div>
              <div className="input-group full-width">
                <label>Clinic Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} required placeholder="Full Clinic/Hospital Address" />
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="form-section">
            <div className="section-header" style={{ color: '#c62828' }}>
              <span className="section-icon">🔐</span> Final Security Check
            </div>
            <div className="form-grid">
              <div className="input-group full-width">
                <label>Confirm Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Re-enter your signup password" style={{ borderColor: '#ef9a9a' }} />
              </div>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={!!successMessage}>
            {successMessage ? 'Submitted' : 'Complete Registration'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default DoctorProfileForm;