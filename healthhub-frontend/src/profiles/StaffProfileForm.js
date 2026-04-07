// src/profiles/StaffProfileForm.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const StaffProfileForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get data from signup (state OR localStorage)
  const [formData, setFormData] = useState({
    name: '', email: '', gender: '', dob: '', age: '', contactNumber: '',
    designation: '', department: '', qualification: '', experience: '',
    joiningDate: '', availableDays: '', availableTime: '', address: '',
    emergencyContact: '', bloodGroup: '', password: '',
  });

  const [originalPassword, setOriginalPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line
  const [loaded, setLoaded] = useState(false);

  // Validate and set original password
  useEffect(() => {
    // 1. Try to get data from navigation state (most secure/direct)
    const stateData = location.state;

    // 2. Fallback to localStorage (if user refreshed page)
    const storageData = JSON.parse(localStorage.getItem('pendingProfile'));

    // Prioritize State, then Storage
    const profileData = stateData || storageData;

    // Validation
    if (!profileData || (profileData.role && profileData.role !== 'staff')) {
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

  const calculateAge = (dob) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'dob') {
      const calculatedAge = calculateAge(value);
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        age: calculatedAge,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate required fields
    if (!formData.contactNumber || !formData.designation || !formData.department || !formData.joiningDate) {
      setLoading(false);
      return alert('Please fill in all required fields.');
    }

    // Confirm password matches signup password
    if (formData.password !== originalPassword) {
      setError('Incorrect password. Please enter the password you used during signup.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/staff/submitProfile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      alert('Profile submitted successfully! Awaiting approval.');
      navigate('/');
    } catch (err) {
      console.error('Error submitting profile:', err);
      setError(`Failed to submit profile: ${err.message}`);
      alert('Failed to submit profile. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Violet/Professional Background
  const bgImage = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=2064&q=80";

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
          padding: 20px 10px; /* Reduced vertical padding */
          font-family: 'Segoe UI', 'Roboto', sans-serif;
          display: flex;
          justify-content: center;
          align-items: flex-start; /* Aligns to top for scrolling if needed */
        }

        .profile-container::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(135deg, rgba(74, 20, 140, 0.85), rgba(49, 27, 146, 0.9)); /* Deep Violet Gradient */
          z-index: 0;
        }

        .profile-card {
          position: relative;
          z-index: 10;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          padding: 30px; /* Compact padding */
          border-radius: 20px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.5);
          width: 100%;
          max-width: 1100px; /* Wider to fit 3 columns */
          border: 1px solid rgba(255, 255, 255, 0.4);
        }

        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 2px solid #e1bee7; /* Light Purple border */
          padding-bottom: 15px;
        }

        .main-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: #4a148c; /* Dark Violet */
          margin: 0;
        }

        .sub-title {
          font-size: 0.9rem;
          color: #7b1fa2;
          font-style: italic;
          margin: 0;
        }

        /* Compact Form Styling */
        .form-section {
          margin-bottom: 15px; /* Tighter spacing */
          background: #f3e5f5; /* Very Light Purple */
          padding: 15px 20px;
          border-radius: 12px;
          border: 1px solid #e1bee7;
        }

        .section-header {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          color: #6a1b9a;
          font-size: 1.1rem;
          font-weight: 700;
          border-bottom: 1px dashed #ce93d8;
          padding-bottom: 5px;
        }

        .section-icon {
          margin-right: 8px;
          font-size: 1.2rem;
        }

        /* 3-COLUMN GRID SYSTEM for compactness */
        .form-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr); /* 3 Columns */
          gap: 15px; /* Tighter gaps */
        }

        @media (max-width: 1024px) {
          .form-grid {
             grid-template-columns: repeat(2, 1fr); /* 2 Cols on tablet */
          }
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

        .two-thirds {
           grid-column: span 2;
        }

        .input-group {
          display: flex;
          flex-direction: column;
        }

        .input-group label {
          margin-bottom: 4px;
          font-weight: 600;
          color: #4a148c;
          font-size: 0.8rem;
        }

        .input-group input,
        .input-group select,
        .input-group textarea {
          padding: 8px 12px; /* Smaller padding */
          border: 1px solid #ba68c8;
          border-radius: 8px;
          font-size: 0.9rem; /* Compact font */
          background-color: white;
          color: #4a148c;
          transition: all 0.2s;
        }

        .input-group input:focus,
        .input-group select:focus,
        .input-group textarea:focus {
          border-color: #7b1fa2;
          box-shadow: 0 0 0 3px rgba(123, 31, 162, 0.15);
          outline: none;
        }

        .input-group input:read-only {
          background-color: #eeeaf1;
          color: #777;
          border-color: #e1bee7;
        }

        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #7b1fa2, #4a148c);
          color: white;
          padding: 12px; /* Compact button */
          border: none;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(74, 20, 140, 0.3);
          text-transform: uppercase;
          margin-top: 10px;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(74, 20, 140, 0.4);
          background: linear-gradient(135deg, #8e24aa, #6a1b9a);
        }

        .error-banner {
          background-color: #fce4ec;
          color: #c2185b;
          padding: 10px;
          border-radius: 8px;
          text-align: center;
          margin-bottom: 15px;
          border: 1px solid #f8bbd0;
          font-weight: 600;
          font-size: 0.9rem;
        }

      `}</style>

      <div className="profile-card">
        <div className="header-section">
          <div>
            <h1 className="main-title">Staff Profile Setup</h1>
            <p className="sub-title">"Excellence in every detail"</p>
          </div>
          {/* Status Indicator can go here */}
        </div>

        {error && <div className="error-banner">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>

          {/* Identity & Personal - Merged for compactness */}
          <div className="form-section">
            <div className="section-header">
              <span className="section-icon">👤</span> Identity &#38; Contact
            </div>
            <div className="form-grid">
              <div className="input-group">
                <label>Full Name</label>
                <input type="text" name="name" value={formData.name} readOnly />
              </div>
              <div className="input-group">
                <label>Email ID</label>
                <input type="email" name="email" value={formData.email} readOnly />
              </div>
              <div className="input-group">
                <label>Contact No.</label>
                <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="+1 234 567 890" required />
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
                  <option value="">Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="input-group">
                <label>Blood Group</label>
                <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} placeholder="e.g. O+" />
              </div>
              <div className="input-group two-thirds">
                <label>Residential Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Full Address with Zip Code" />
              </div>
            </div>
          </div>

          {/* Professional Details & Schedule - Merged */}
          <div className="form-section">
            <div className="section-header">
              <span className="section-icon">👔</span> Professional Role &#38; Schedule
            </div>
            <div className="form-grid">
              <div className="input-group">
                <label>Designation</label>
                <select name="designation" value={formData.designation} onChange={handleChange} required>
                  <option value="">Select Role</option>
                  <option value="Nurse">Nurse</option>
                  <option value="Technician">Technician</option>
                  <option value="Receptionist">Receptionist</option>
                  <option value="Pharmacist">Pharmacist</option>
                  <option value="Lab Assistant">Lab Assistant</option>
                  <option value="Dietitian">Dietitian</option>
                </select>
              </div>
              <div className="input-group">
                <label>Department</label>
                <select name="department" value={formData.department} onChange={handleChange} required>
                  <option value="">Select Dept</option>
                  <option value="Radiology">Radiology</option>
                  <option value="General">General</option>
                  <option value="Pathology">Pathology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
              <div className="input-group">
                <label>Joining Date</label>
                <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Qualification</label>
                <select name="qualification" value={formData.qualification} onChange={handleChange}>
                  <option value="">Qualification</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Bachelor's">Bachelor's</option>
                  <option value="Master's">Master's</option>
                  <option value="Certification">Cert.</option>
                </select>
              </div>
              <div className="input-group">
                <label>Experience</label>
                <input type="number" name="experience" value={formData.experience} onChange={handleChange} placeholder="Years" min="0" />
              </div>
              <div className="input-group">
                <label>Emergency Contact</label>
                <input type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} placeholder="Relative" />
              </div>
              <div className="input-group">
                <label>Working Days</label>
                <input type="text" name="availableDays" value={formData.availableDays} onChange={handleChange} placeholder="e.g. Mon-Fri" />
              </div>
              <div className="input-group two-thirds">
                <label>Shift / Timings</label>
                <input type="text" name="availableTime" value={formData.availableTime} onChange={handleChange} placeholder="e.g. 9:00 AM - 5:00 PM" />
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="form-section" style={{ background: '#fff3e0', borderColor: '#ffcc80', marginBottom: '0' }}>
            <div className="form-grid" style={{ gridTemplateColumns: '1fr 3fr', alignItems: 'center' }}>
              <div style={{ color: '#e65100', fontWeight: '700', fontSize: '0.9rem' }}>
                🔐 Security Check
              </div>
              <div className="input-group">
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Confirm your password to submit" required style={{ borderColor: '#ffcc80' }} />
              </div>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Processing...' : 'Complete Profile Setup'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default StaffProfileForm;