// src/profiles/AdminProfileForm.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AdminProfileForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get data from signup (state OR localStorage)
  const [formData, setFormData] = useState({
    name: '', email: '', dob: '', age: '', contact: '', address: '',
    bloodGroup: '', emergencyContact: '', designation: '', department: '',
    joiningDate: '', qualification: '', experience: '', previousExperience: '',
    availableDays: '', availableTime: '', password: '',
  });

  const [originalPassword, setOriginalPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  // Removed unused 'loaded'

  // Validate and auto-fill on mount
  useEffect(() => {
    // 1. Try to get data from navigation state (most secure/direct)
    const stateData = location.state;

    // 2. Fallback to localStorage (if user refreshed page)
    const storageData = JSON.parse(localStorage.getItem('pendingProfile'));

    // Prioritize State, then Storage
    const profileData = stateData || storageData;

    // Validation
    if (!profileData || (profileData.role && profileData.role !== 'admin')) {
      // Allow if generic signup (no role in object) but valid email
      if (!profileData || !profileData.email) {
        setError('Signup information missing. Please sign up again.');
        setTimeout(() => navigate('/signup'), 2000);
        return;
      }
    }

    setFormData(prev => ({
      ...prev,
      name: profileData.name || '',
      email: profileData.email || '',
    }));

    // Ensure password from state is available or fallback to localstorage for validation later
    if (stateData && stateData.password) {
      localStorage.setItem('tempSignupPassword', stateData.password);
    }
    const storedPass = localStorage.getItem('tempSignupPassword');
    setOriginalPassword(storedPass || '');

  }, [location.state, navigate]);

  // Calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const diff = Date.now() - birthDate.getTime();
    return new Date(diff).getUTCFullYear() - 1970;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };

    if (name === 'dob') {
      updatedFormData.age = calculateAge(value);
    }

    setFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitted(false);

    // Validate password
    if (formData.password !== originalPassword) {
      setError('Password does not match. Please enter the password used during signup.');
      return;
    }

    try {
      const res = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/admin/submit-admin-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const error = await res.json();
        setError(error.message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Could not submit form. Is the server running?');
    }
  };

  // Modern Professional Background
  const bgImage = "https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";

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
          background: linear-gradient(135deg, rgba(13, 71, 161, 0.9), rgba(0, 0, 0, 0.7));
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
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); }
        }

        .header-section {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 2px solid #e0e0e0;
          padding-bottom: 20px;
        }

        .main-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #0d47a1;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }

        .sub-title {
          font-size: 1rem;
          color: #546e7a;
          font-style: italic;
        }

        .form-section {
          margin-bottom: 35px;
          background: #f8faff;
          padding: 25px;
          border-radius: 16px;
          border: 1px solid #e3f2fd;
        }

        .section-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          color: #1565c0;
          font-size: 1.25rem;
          font-weight: 700;
        }

        .section-icon {
          margin-right: 10px;
          font-size: 1.5rem;
        }

        /* GRID SYSTEM for Perfect Alignment */
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

        .input-group input,
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
          border-color: #1976d2;
          box-shadow: 0 0 0 4px rgba(25, 118, 210, 0.1);
          outline: none;
        }

        .input-group input:read-only {
          background-color: #eceff1;
          color: #78909c;
          border-color: #cfd8dc;
          cursor: not-allowed;
        }

        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #1565c0, #0d47a1);
          color: white;
          padding: 18px;
          border: none;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(13, 71, 161, 0.3);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 20px;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(13, 71, 161, 0.4);
          background: linear-gradient(135deg, #1976d2, #1565c0);
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
          padding: 40px;
        }

        .success-icon {
          font-size: 60px;
          color: #2e7d32;
          margin-bottom: 20px;
          display: block;
        }

        .success-title {
          font-size: 1.8rem;
          color: #2e7d32;
          font-weight: 700;
          margin-bottom: 15px;
        }

        .success-text {
          color: #455a64;
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 30px;
        }

        .ok-btn {
          background: #2e7d32;
          color: white;
          padding: 12px 35px;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .ok-btn:hover {
          background: #1b5e20;
          transform: scale(1.05);
        }
      `}</style>

      <div className="profile-card">
        {submitted ? (
          <div className="success-card">
            <span className="success-icon">✅</span>
            <h2 className="success-title">Profile Submitted Successfully!</h2>
            <p className="success-text">
              Thank you, <strong>{formData.name}</strong>. Your profile has been sent for administrative approval.
              <br />
              You will gain full access to the Dashboard once verified.
            </p>
            <button className="ok-btn" onClick={() => navigate('/login')}>
              Return to Login
            </button>
          </div>
        ) : (
          <>
            <div className="header-section">
              <h2 className="main-title">Admin Profile Setup</h2>
              <p className="sub-title">"Empowering Leadership, One Admin at a Time"</p>
            </div>

            {error && <div className="error-banner">⚠️ {error}</div>}

            <form onSubmit={handleSubmit}>

              {/* Basic Information */}
              <div className="form-section">
                <div className="section-header">
                  <span className="section-icon">🧾</span> Basic Information
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
                    <input type="number" name="age" value={formData.age} readOnly placeholder="Auto-calculated" />
                  </div>
                  <div className="input-group">
                    <label>Contact Number</label>
                    <input type="tel" name="contact" value={formData.contact} onChange={handleChange} placeholder="+1 234 567 890" required />
                  </div>
                  <div className="input-group">
                    <label>Blood Group</label>
                    <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required>
                      <option value="">Select Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  <div className="input-group full-width">
                    <label>Residential Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Full Address" required />
                  </div>
                  <div className="input-group full-width">
                    <label>Emergency Contact (Optional)</label>
                    <input type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} placeholder="Emergency Phone Number" />
                  </div>
                </div>
              </div>

              {/* Professional Details */}
              <div className="form-section">
                <div className="section-header">
                  <span className="section-icon">💼</span> Professional Details
                </div>
                <div className="form-grid">
                  <div className="input-group">
                    <label>Designation</label>
                    <select name="designation" value={formData.designation} onChange={handleChange} required>
                      <option value="">Select Role</option>
                      <option value="Senior Admin">Senior Admin</option>
                      <option value="Data Analyst">Data Analyst</option>
                      <option value="Database Operator">Database Operator</option>
                      <option value="HR Manager">HR Manager</option>
                      <option value="IT Support">IT Support</option>
                      <option value="Operations Lead">Operations Lead</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Department</label>
                    <select name="department" value={formData.department} onChange={handleChange} required>
                      <option value="">Select Dept</option>
                      <option value="Administration">Administration</option>
                      <option value="IT">IT</option>
                      <option value="HR">HR</option>
                      <option value="Operations">Operations</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Qualification</label>
                    <select name="qualification" value={formData.qualification} onChange={handleChange} required>
                      <option value="">Select Degree</option>
                      <option value="MBA">MBA</option>
                      <option value="B.Tech">B.Tech</option>
                      <option value="M.Tech">M.Tech</option>
                      <option value="MCA">MCA</option>
                      <option value="BCA">BCA</option>
                      <option value="PhD">PhD</option>
                      <option value="Diploma">Diploma</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Total Experience (Years)</label>
                    <input type="number" name="experience" value={formData.experience} onChange={handleChange} placeholder="e.g. 5" min="0" />
                  </div>
                  <div className="input-group">
                    <label>Joining Date</label>
                    <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} />
                  </div>
                  <div className="input-group">
                    <label>Previous Experience</label>
                    <input type="text" name="previousExperience" value={formData.previousExperience} onChange={handleChange} placeholder="e.g. XYZ Hospital" />
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="form-section">
                <div className="section-header">
                  <span className="section-icon">📅</span> Work Schedule
                </div>
                <div className="form-grid">
                  <div className="input-group">
                    <label>Available Days</label>
                    <input type="text" name="availableDays" value={formData.availableDays} onChange={handleChange} placeholder="e.g. Mon - Fri" />
                  </div>
                  <div className="input-group">
                    <label>Available Time</label>
                    <input type="text" name="availableTime" value={formData.availableTime} onChange={handleChange} placeholder="e.g. 9:00 AM - 5:00 PM" />
                  </div>
                </div>
              </div>

              {/* Confirmation */}
              <div className="form-section" style={{ borderColor: '#ffcdd2', background: '#fffbee' }}>
                <div className="section-header" style={{ color: '#c62828' }}>
                  <span className="section-icon">🔐</span> Security Check
                </div>
                <div className="form-grid">
                  <div className="input-group full-width">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Re-enter your signup password to verify identity"
                      required
                      style={{ borderColor: '#ef9a9a' }}
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="submit-btn">
                Complete Profile Setup
              </button>

            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminProfileForm;