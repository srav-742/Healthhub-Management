// src/components/PatientDashboard.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home,
  CalendarMonth,
  CloudUpload,
  ReceiptLong,
  History as HistoryIcon,
  Logout,
  Person,
  MedicalServices,
  Menu,
  Close
} from '@mui/icons-material';

const PatientDashboard = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Not Provided',
    patientId: 'Not Provided',
    email: 'Not Provided',
    contact: 'Not Provided',
    dob: 'Not Provided',
    age: 'Not Provided',
    gender: 'Not Provided',
    bloodGroup: 'Not Provided',
    address: 'Not Provided',
    medicalProblem: 'Not Provided',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('authToken');

        if (!userStr) {
          // alert('Not logged in.');
          window.location.href = '/login';
          return;
        }

        const user = JSON.parse(userStr);
        const { email } = user;

        if (!email) {
          alert('Email not found in session.');
          window.location.href = '/login';
          return;
        }

        if (!token) {
          alert('Authentication token missing.');
          window.location.href = '/login';
          return;
        }

        const response = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/patient/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          throw new Error('Failed to load profile');
        }

        const data = await response.json();

        const dobFormatted = data.dob
          ? new Date(data.dob).toLocaleDateString()
          : 'Not Provided';

        setUserData({
          name: data.name || 'Not Provided',
          patientId: data.patientId || 'Not Provided',
          email: data.email || 'Not Provided',
          contact: data.contact || 'Not Provided',
          dob: dobFormatted,
          age: data.age?.toString() || 'Not Provided',
          gender: data.gender || 'Not Provided',
          bloodGroup: data.bloodGroup || 'Not Provided',
          address: data.address || 'Not Provided',
          medicalProblem: data.medicalProblem || 'Not Provided',
        });
      } catch (error) {
        console.error('Profile fetch error:', error);
        // alert('Could not load your profile. Please log in again.');
        // window.location.href = '/login';
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body, html { 
          font-family: 'Outfit', sans-serif; 
          background: #fdfbfd; 
          height: 100%;
        }

        .patient-dashboard { 
          display: flex; 
          min-height: 100vh; 
          background: linear-gradient(135deg, #fdfbfd 0%, #f4f0fa 100%);
        }

        /* Sidebar Styling */
        .sidebar { 
          width: 280px; 
          background: linear-gradient(180deg, #667eea 0%, #764ba2 100%); 
          color: white; 
          padding: 30px 20px; 
          display: flex; 
          flex-direction: column; 
          box-shadow: 4px 0 20px rgba(118, 75, 162, 0.2);
          z-index: 10;
        }

        .sidebar .logo { 
          font-size: 28px; 
          font-weight: 700; 
          text-align: center; 
          margin-bottom: 50px; 
          letter-spacing: 1px;
          display: flex; 
          align-items: center; 
          justify-content: center; 
          gap: 10px;
        }

        .menu { list-style: none; flex: 1; }
        .menu li { margin-bottom: 12px; }

        .menu-link { 
          color: rgba(255, 255, 255, 0.85); 
          text-decoration: none; 
          padding: 14px 20px; 
          display: flex; 
          align-items: center; 
          gap: 15px;
          border-radius: 16px; 
          transition: all 0.3s ease;
          font-weight: 500;
          font-size: 1rem;
        }

        .menu-link:hover, .menu-link.active { 
          background: rgba(255, 255, 255, 0.2); 
          color: white; 
          backdrop-filter: blur(10px);
          transform: translateX(5px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .logout-btn {
          margin-top: auto;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          padding: 14px 20px;
          border-radius: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 15px;
          width: 100%;
          font-size: 1rem;
          font-family: inherit;
          transition: all 0.3s ease;
        }

        .logout-btn:hover {
          background: rgba(255, 65, 108, 0.8);
          border-color: rgba(255, 65, 108, 0.8);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 65, 108, 0.3);
        }

        /* Main Content Styling */
        .main-content { 
          flex: 1; 
          padding: 40px; 
          overflow-y: auto;
        }

        .top-bar { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          margin-bottom: 40px; 
        }

        .welcome-section h1 { 
          font-size: 2.8rem; 
          color: #2d3748; 
          font-weight: 700;
          line-height: 1.2;
        }

        .welcome-section h1 .highlight { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .welcome-section p {
          color: #718096;
          margin-top: 8px;
          font-size: 1.1rem;
        }

        /* Profile Section */
        .profile-section { position: relative; }
        
        .profile-button { 
          background: white; 
          color: #4a5568; 
          border: 1px solid #e2e8f0; 
          padding: 10px 20px; 
          border-radius: 50px; 
          cursor: pointer; 
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .profile-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(118, 75, 162, 0.15);
          border-color: #b7a2d4;
        }

        .avatar-circle {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
        }

        .profile-dropdown { 
          position: absolute; 
          top: 70px; 
          right: 0; 
          width: 350px; 
          background: rgba(255, 255, 255, 0.95); 
          border-radius: 24px; 
          box-shadow: 0 20px 40px rgba(0,0,0,0.1); 
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.5);
          z-index: 1000; 
          overflow: hidden;
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .profile-header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          color: white; 
          padding: 30px; 
          text-align: center; 
        }

        .profile-body { padding: 25px; font-size: 0.95rem; color: #4a5568; }
        .profile-row { 
          display: flex; 
          justify-content: space-between; 
          margin-bottom: 12px; 
          padding-bottom: 8px;
          border-bottom: 1px solid #edf2f7;
        }
        .profile-row:last-child { border-bottom: none; }
        .profile-row strong { color: #667eea; }

        /* Dashboard Cards */
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 25px;
          margin-top: 40px;
        }

        .info-card {
          background: white;
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          border: 1px solid rgba(255,255,255,0.5);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: start;
          position: relative;
          overflow: hidden;
        }

        .info-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(118, 75, 162, 0.15);
        }

        .info-card h3 {
          font-size: 1.5rem;
          color: #2d3748;
          margin-bottom: 10px;
        }
        
        .info-card p {
          color: #718096;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .card-icon {
          position: absolute;
          right: -20px;
          bottom: -20px;
          font-size: 8rem !important;
          opacity: 0.05;
          color: #667eea;
          transform: rotate(-15deg);
        }

        .action-link {
          margin-top: auto;
          color: #764ba2;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .action-link:hover { gap: 8px; }

        @media (max-width: 1024px) {
          .sidebar { 
            position: fixed;
            left: ${isSidebarOpen ? '0' : '-280px'};
            top: 0;
            height: 100vh;
            transition: left 0.3s ease;
            z-index: 1000;
          }
          .main-content { padding: 80px 20px 20px; }
          .top-bar { flex-direction: column-reverse; gap: 20px; text-align: center; }
          .welcome-section h1 { font-size: 2rem; }
          .profile-section { width: 100%; display: flex; justify-content: center; }
          .profile-dropdown { width: calc(100vw - 40px); left: 0; right: 0; margin: 0 auto; top: 60px; }
          .mobile-menu-btn {
            display: flex !important;
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1001;
            background: #764ba2;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            align-items: center;
          }
          .sidebar-overlay {
            display: ${isSidebarOpen ? 'block' : 'none'};
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 999;
            backdrop-filter: blur(2px);
          }
          .dashboard-grid { grid-template-columns: 1fr; }
        }
        
        .mobile-menu-btn { display: none; }
      `}</style>

      <div className="patient-dashboard">
        <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <Close /> : <Menu />}
        </button>

        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>

        {/* Sidebar */}
        <div className="sidebar">
          <div className="logo">
            <MedicalServices fontSize="large" />
            HealthHub
          </div>
          <ul className="menu">
            <li><Link to="/patient-dashboard" className="menu-link active"><Home /> Dashboard</Link></li>
            <li><Link to="/book-appointment" className="menu-link"><CalendarMonth /> Book Appointment</Link></li>
            <li><Link to="/upload-files" className="menu-link"><CloudUpload /> Upload Files</Link></li>
            <li><Link to="/prescriptions" className="menu-link"><ReceiptLong /> Prescriptions</Link></li>
            <li><Link to="/billing" className="menu-link"><Person /> Billing</Link></li>
            <li><Link to="/history" className="menu-link"><HistoryIcon /> Medical History</Link></li>
          </ul>

          <button onClick={handleLogout} className="logout-btn">
            <Logout /> Logout
          </button>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="top-bar">
            <div className="welcome-section">
              <h1>Welcome Back, <br /><span className="highlight">{userData.name}</span>!</h1>
              <p>Manage your health journey with ease and comfort.</p>
            </div>

            <div className="profile-section">
              <button
                className="profile-button"
                onClick={() => setShowProfile(!showProfile)}
              >
                <div className="avatar-circle">
                  {userData.name.charAt(0)}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{userData.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#718096' }}>{userData.patientId}</div>
                </div>
              </button>

              {showProfile && (
                <div className="profile-dropdown">
                  <div className="profile-header">
                    <h3>{userData.name}</h3>
                    <p style={{ opacity: 0.8 }}>{userData.email}</p>
                  </div>
                  <div className="profile-body">
                    <div className="profile-row"><strong>Patient ID:</strong> <span>{userData.patientId}</span></div>
                    <div className="profile-row"><strong>Contact:</strong> <span>{userData.contact}</span></div>
                    <div className="profile-row"><strong>DOB:</strong> <span>{userData.dob}</span></div>
                    <div className="profile-row"><strong>Age:</strong> <span>{userData.age}</span></div>
                    <div className="profile-row"><strong>Gender:</strong> <span>{userData.gender}</span></div>
                    <div className="profile-row"><strong>Blood Group:</strong> <span>{userData.bloodGroup}</span></div>
                    <div className="profile-row"><strong>Address:</strong> <span>{userData.address}</span></div>
                    <div style={{ marginTop: '15px' }}>
                      <strong>Medical Issue:</strong>
                      <p style={{ marginTop: '5px', color: '#718096', lineHeight: '1.4' }}>{userData.medicalProblem}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="dashboard-grid">
            <div className="info-card">
              <h3>Appointments</h3>
              <p>Book new consultations or check your upcoming schedule.</p>
              <CalendarMonth className="card-icon" />
              <Link to="/book-appointment" className="action-link">Book Now →</Link>
            </div>

            <div className="info-card">
              <h3>Prescriptions</h3>
              <p>Access your digital prescriptions and medication history.</p>
              <ReceiptLong className="card-icon" />
              <Link to="/prescriptions" className="action-link">View All →</Link>
            </div>

            <div className="info-card">
              <h3>Documents</h3>
              <p>Securely upload and manage your medical reports and files.</p>
              <CloudUpload className="card-icon" />
              <Link to="/upload-files" className="action-link">Upload →</Link>
            </div>

            <div className="info-card">
              <h3>History</h3>
              <p>Track your complete medical journey and past visits.</p>
              <HistoryIcon className="card-icon" />
              <Link to="/history" className="action-link">View History →</Link>
            </div>
            <div className="info-card">
              <h3>Billing</h3>
              <p>View your pending bills and payment history securely.</p>
              <Person className="card-icon" />
              <Link to="/billing" className="action-link">View Bills →</Link>
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#667eea', margin: '60px auto 30px', maxWidth: '700px', lineHeight: '1.6' }}>
            "Health is the greatest gift, contentment the greatest wealth, faithfulness the best relationship."
          </p>

          <footer style={{ textAlign: 'center', color: '#a0aec0', marginTop: '40px', fontSize: '0.9rem' }}>
            &copy; 2025 HealthHub. Your Trusted Healthcare Partner.
          </footer>
        </div>
      </div>
    </>
  );
};

export default PatientDashboard;