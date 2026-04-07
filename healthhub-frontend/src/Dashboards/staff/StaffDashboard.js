// src/Dashboards/Staff/StaffDashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Home,
  Assignment,
  Event,
  MedicalServices,
  Logout,
  Person,
  Notifications,
  Search,
  Menu,
  Close
} from '@mui/icons-material';
import TodayAssignedRole from './TodayAssignedRole';
import ViewAppointments from './viewappointments';
import ViewDoctors from './viewdoctors';

const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5000') + '';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeSection, setActiveSection] = useState('dashboard');
  const [staffProfile, setStaffProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load user and validate role
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login', { replace: true });
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'staff') {
        const redirect = {
          admin: '/admin-dashboard',
          doctor: '/doctor-dashboard',
          patient: '/patient-dashboard',
        }[parsedUser.role] || '/login';
        navigate(redirect, { replace: true });
        return;
      }
      setUser(parsedUser);
    } catch (err) {
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      navigate('/login', { replace: true });
    }

    // Update time every second
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  // Fetch staff profile using email
  useEffect(() => {
    const fetchStaffProfile = async () => {
      setLoadingProfile(true);
      setFetchError('');
      setStaffProfile(null);

      if (!user?.email) {
        setFetchError('User email not found. Please log in again.');
        setLoadingProfile(false);
        return;
      }

      try {
        const url = `${API_BASE}/api/staff/all`;
        const token = localStorage.getItem('authToken');

        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'x-auth-token': token } : {}),
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch staff list');
        }

        const staffList = await res.json();
        const myProfile = staffList.find(
          (staff) => staff.email?.toLowerCase() === user.email.toLowerCase()
        );

        if (myProfile) {
          setStaffProfile(myProfile);
          localStorage.setItem('staffId', myProfile.staffId);
        } else {
          setFetchError(`Profile not found for email: ${user.email}`);
        }
      } catch (err) {
        console.error('Failed to fetch staff profile:', err);
        setFetchError('Failed to load profile data.');
      } finally {
        setLoadingProfile(false);
      }
    };

    if (user) fetchStaffProfile();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const staffId = staffProfile?.staffId || localStorage.getItem('staffId') || 'N/A';

  const renderContent = () => {
    switch (activeSection) {
      case 'assignedRole':
        return <TodayAssignedRole />;
      case 'availableDoctors':
        return <ViewDoctors />;
      case 'bookedAppointments':
        return <ViewAppointments />;
      default: // Dashboard Home
        return (
          <>
            <div className="dashboard-grid">
              <div className="info-card" onClick={() => setActiveSection('assignedRole')}>
                <h3>Today's Task</h3>
                <p>View your assigned role and duties for the day.</p>
                <div className="card-action">View Role →</div>
                <Assignment className="card-bg-icon" />
              </div>

              <div className="info-card" onClick={() => setActiveSection('bookedAppointments')}>
                <h3>Appointments</h3>
                <p>Check patient appointments and schedules.</p>
                <div className="card-action">View All →</div>
                <Event className="card-bg-icon" />
              </div>

              <div className="info-card" onClick={() => setActiveSection('availableDoctors')}>
                <h3>Doctors</h3>
                <p>See available doctors and their timings.</p>
                <div className="card-action">Check Status →</div>
                <MedicalServices className="card-bg-icon" />
              </div>
            </div>

            <div className="welcome-banner">
              <h2>Ready to serve?</h2>
              <p>Your dedication makes HealthHub a better place for everyone.</p>
            </div>
          </>
        );
    }
  };

  if (!user) return null;

  return (
    <div className="staff-dashboard">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body { 
          font-family: 'Outfit', sans-serif; 
          background: #f0f4f8; 
          overflow-x: hidden;
        }

        .staff-dashboard {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
        }

        /* Sidebar */
        .sidebar {
          width: 280px;
          background: linear-gradient(180deg, #134E5E 0%, #71B280 100%);
          color: white;
          padding: 30px 20px;
          display: flex;
          flex-direction: column;
          box-shadow: 4px 0 20px rgba(19, 78, 94, 0.25);
          z-index: 100;
          position: sticky;
          top: 0;
          height: 100vh;
        }

        .logo {
          font-size: 26px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 50px;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .nav-menu {
          list-style: none;
          flex: 1;
        }

        .nav-item {
          margin-bottom: 15px;
        }

        .nav-btn {
          width: 100%;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.85);
          padding: 14px 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          border-radius: 12px;
          cursor: pointer;
          font-family: inherit;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.3s ease;
          text-align: left;
        }

        .nav-btn:hover, .nav-btn.active {
          background: rgba(255, 255, 255, 0.15);
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
          padding: 14px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .logout-btn:hover {
          background: #ff6b6b;
          border-color: #ff6b6b;
          transform: translateY(-2px);
        }

        /* Main Content */
        .main-content {
          flex: 1;
          padding: 40px;
          overflow-y: auto;
          height: 100vh;
        }

        .top-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }

        .greeting h1 {
          font-size: 2.5rem;
          color: #1a202c;
          font-weight: 700;
          line-height: 1.2;
        }

        .highlight {
          background: linear-gradient(135deg, #134E5E 0%, #71B280 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          color: #718096;
          margin-top: 8px;
          font-size: 1.1rem;
        }

        /* Profile Dropdown */
        .profile-section { position: relative; }

        .profile-trigger {
          background: white;
          border: 1px solid #e2e8f0;
          padding: 8px 16px; 
          border-radius: 50px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .profile-trigger:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(19, 78, 94, 0.15);
          border-color: #71B280;
        }

        .avatar {
          width: 40px; 
          height: 40px;
          background: linear-gradient(135deg, #134E5E 0%, #71B280 100%);
          border-radius: 50%;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .profile-dropdown {
          position: absolute;
          top: 70px;
          right: 0;
          width: 320px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.5);
          z-index: 1000;
          overflow: hidden;
          animation: slideDown 0.3s ease-out;
        }

        .dropdown-header {
          background: linear-gradient(135deg, #134E5E 0%, #71B280 100%);
          color: white;
          padding: 25px;
          text-align: center;
        }

        .dropdown-body {
          padding: 20px;
          font-size: 0.95rem;
          color: #4a5568;
        }
        .profile-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #edf2f7;
        }
        .profile-row:last-child { border-bottom: none; }
        .profile-row strong { color: #134E5E; }

        /* Dashboard Grid */
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          margin-bottom: 40px;
        }

        .info-card {
          background: white;
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          border: 1px solid rgba(255,255,255,0.6);
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .info-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(113, 178, 128, 0.2);
          border-color: #a7d8b1;
        }

        .info-card h3 {
          font-size: 1.6rem;
          color: #2d3748;
          margin-bottom: 10px;
        }

        .info-card p {
          color: #718096;
          margin-bottom: 25px;
          line-height: 1.5;
        }

        .card-action {
          margin-top: auto;
          color: #134E5E;
          font-weight: 700;
          font-size: 0.95rem;
        }

        .card-bg-icon {
          position: absolute;
          right: -20px;
          bottom: -20px;
          font-size: 8rem !important;
          color: #71B280;
          opacity: 0.1;
          transform: rotate(-15deg);
        }

        .welcome-banner {
          background: linear-gradient(135deg, #134E5E 0%, #1a6d82 100%);
          border-radius: 24px;
          padding: 40px;
          color: white;
          position: relative;
          overflow: hidden;
          box-shadow: 0 15px 35px rgba(19, 78, 94, 0.2);
        }
        .welcome-banner h2 { font-size: 2rem; margin-bottom: 10px; }
        .welcome-banner p { opacity: 0.9; font-size: 1.1rem; max-width: 600px; }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 1024px) {
          .sidebar { 
            position: fixed;
            left: ${isSidebarOpen ? '0' : '-280px'};
            top: 0;
            height: 100vh;
            transition: all 0.3s ease;
            z-index: 1000;
          }
          .main-content { padding: 80px 20px 20px; }
          .top-header { flex-direction: column-reverse; gap: 20px; text-align: center; }
          .greeting h1 { font-size: 2rem; }
          .profile-section { width: 100%; display: flex; justify-content: center; }
          .profile-dropdown { width: calc(100vw - 40px); left: 0; right: 0; margin: 0 auto; top: 70px; }
          .mobile-toggle-staff {
            display: flex !important;
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1001;
            background: #134E5E;
            color: #71B280;
            border: none;
            padding: 10px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
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
          .welcome-banner { padding: 30px 20px; }
          .welcome-banner h2 { font-size: 1.5rem; }
        }
        .mobile-toggle-staff { display: none; }
      `}</style>

      <button className="mobile-toggle-staff" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? <Close /> : <Menu />}
      </button>

      <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <MedicalServices fontSize="large" /> HealthHub
        </div>

        <ul className="nav-menu">
          <li className="nav-item">
            <button
              className={`nav-btn ${activeSection === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveSection('dashboard')}
            >
              <Home /> Dashboard
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-btn ${activeSection === 'assignedRole' ? 'active' : ''}`}
              onClick={() => setActiveSection('assignedRole')}
            >
              <Assignment /> Assigned Role
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-btn ${activeSection === 'bookedAppointments' ? 'active' : ''}`}
              onClick={() => setActiveSection('bookedAppointments')}
            >
              <Event /> Appointments
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-btn ${activeSection === 'availableDoctors' ? 'active' : ''}`}
              onClick={() => setActiveSection('availableDoctors')}
            >
              <MedicalServices /> Available Doctors
            </button>
          </li>
        </ul>

        <button className="logout-btn" onClick={handleLogout}>
          <Logout /> Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header">
          <div className="greeting">
            <h1>{greeting()}, <span className="highlight">{user.name}</span>!</h1>
            <p className="subtitle">Staff ID: {staffId} • {currentTime.toLocaleTimeString()}</p>
          </div>

          <div className="profile-section">
            <button className="profile-trigger" onClick={() => setShowProfile(!showProfile)}>
              <div className="avatar">{user.name.charAt(0)}</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#2d3748' }}>{user.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#718096' }}>Staff Member</div>
              </div>
            </button>

            {showProfile && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{staffProfile?.name || user.name}</div>
                  <div style={{ opacity: 0.9, fontSize: '0.9rem' }}>{user.email}</div>
                </div>
                <div className="dropdown-body">
                  {loadingProfile ? (
                    <p>Loading profile...</p>
                  ) : staffProfile ? (
                    <>
                      <div className="profile-row"><strong>Designation:</strong> {staffProfile.designation || 'N/A'}</div>
                      <div className="profile-row"><strong>Department:</strong> {staffProfile.department || 'N/A'}</div>
                      <div className="profile-row"><strong>Phone:</strong> {staffProfile.contactNumber || 'N/A'}</div>
                      <div className="profile-row"><strong>Shift:</strong> {staffProfile.availableTime || 'General'}</div>
                      <div className="profile-row"><strong>Status:</strong> {staffProfile.status || 'Active'}</div>
                    </>
                  ) : (
                    <p>{fetchError || 'Profile details unavailable'}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="content-area">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;