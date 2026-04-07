// src/Dashboards/Admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientManagement from './PatientManagement';
import DoctorManagement from './DoctorManagement';
import Requests from './Requests';
import StaffManagement from './StaffManagement';
import AdminManagement from './AdminManagement';
import AssignRole from './AssignRole';

// Icons (Material UI standard or emoji fallbacks if standard icons not available - using Emojis for zero-dep compatibility as seen in previous files, but styled nicely)
// Ideally we would import MUI icons, but based on reading previous files, I'll stick to the structure that works or upgrade to MUI if I see imports. 
// PatientDashboard used MUI. I'll assume MUI is available since it's in package.json.
import {
  Dashboard,
  People,
  LocalHospital,
  Badge,
  AssignmentInd,
  AdminPanelSettings,
  Logout,
  VerifiedUser,
  Menu,
  Close
} from '@mui/icons-material';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'Admin', email: 'admin@healthhub.com' });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: <Dashboard /> },
    { id: 'patients', label: 'Patient Management', icon: <People /> },
    { id: 'doctors', label: 'Doctor Management', icon: <LocalHospital /> },
    { id: 'staff', label: 'Staff Management', icon: <Badge /> },
    { id: 'requests', label: 'Approval Requests', icon: <VerifiedUser /> },
    { id: 'assignRole', label: 'Assign Roles', icon: <AssignmentInd /> },
    { id: 'admin', label: 'Admin Management', icon: <AdminPanelSettings /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'patients': return <PatientManagement />;
      case 'doctors': return <DoctorManagement />;
      case 'staff': return <StaffManagement />;
      case 'requests': return <Requests />;
      case 'admin': return <AdminManagement />;
      case 'assignRole': return <AssignRole />;
      default:
        return (
          <div className="dashboard-welcome">
            <div className="welcome-banner">
              <h1>Welcome Back, {user.name}</h1>
              <p>HealthHub Administration Center</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card" onClick={() => setActiveTab('doctors')}>
                <div className="stat-icon"><LocalHospital /></div>
                <h3>Doctors</h3>
                <p>Manage Staff & Schedules</p>
              </div>
              <div className="stat-card" onClick={() => setActiveTab('patients')}>
                <div className="stat-icon"><People /></div>
                <h3>Patients</h3>
                <p>View Records & History</p>
              </div>
              <div className="stat-card" onClick={() => setActiveTab('requests')}>
                <div className="stat-icon"><VerifiedUser /></div>
                <h3>Requests</h3>
                <p>Pending Approvals</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="admin-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

        :root {
          --royal-blue: #1e3c72;
          --royal-blue-light: #2a5298;
          --gold: #d4af37;
          --gold-light: #f1c40f;
          --glass-bg: rgba(255, 255, 255, 0.95);
          --glass-border: rgba(255, 255, 255, 0.6);
        }

        body {
          margin: 0;
          font-family: 'Outfit', sans-serif;
          background: #f4f6f9;
        }

        .admin-container {
          display: flex;
          min-height: 100vh;
          background: #f4f6f9;
        }

        /* Sidebar Styling */
        .sidebar {
          width: 280px;
          background: linear-gradient(180deg, var(--royal-blue) 0%, #162238 100%);
          color: white;
          padding: 25px;
          display: flex;
          flex-direction: column;
          box-shadow: 5px 0 25px rgba(0,0,0,0.15);
          z-index: 100;
          position: sticky;
          top: 0;
          height: 100vh;
        }

        .brand {
          font-size: 1.6rem;
          font-weight: 700;
          margin-bottom: 40px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: white;
          letter-spacing: 0.5px;
        }
        .brand-icon {
          color: var(--gold);
        }

        .menu {
          list-style: none;
          padding: 0;
          flex: 1;
        }

        .menu-btn {
          width: 100%;
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.7);
          padding: 14px 18px;
          display: flex;
          align-items: center;
          gap: 15px;
          border-radius: 12px;
          cursor: pointer;
          font-family: inherit;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.3s ease;
          margin-bottom: 8px;
          text-align: left;
        }

        .menu-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: white;
          transform: translateX(5px);
        }

        .menu-btn.active {
          background: linear-gradient(90deg, var(--gold) 0%, var(--gold-light) 100%);
          color: #1e3c72;
          font-weight: 700;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
        }

        .logout-btn {
          margin-top: auto;
          background: rgba(255, 82, 82, 0.15);
          border: 1px solid rgba(255, 82, 82, 0.3);
          color: #ff8a80;
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
          background: #ff5252;
          color: white;
        }

        /* Main Content */
        .main-content {
          flex: 1;
          padding: 40px 50px;
          overflow-y: auto;
          height: 100vh;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        .page-title {
          font-size: 2rem;
          color: var(--royal-blue);
          font-weight: 700;
          border-bottom: 3px solid var(--gold);
          padding-bottom: 5px;
          display: inline-block;
        }

        /* Welcome & Stats */
        .welcome-banner {
          background: linear-gradient(135deg, var(--royal-blue) 0%, var(--royal-blue-light) 100%);
          color: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(30, 60, 114, 0.2);
          margin-bottom: 40px;
          position: relative;
          overflow: hidden;
        }
        .welcome-banner::after {
          content: '';
          position: absolute;
          top: -50px; right: -50px;
          width: 200px; height: 200px;
          background: var(--gold);
          border-radius: 50%;
          opacity: 0.15;
          filter: blur(40px);
        }
        .welcome-banner h1 { margin: 0 0 10px; font-size: 2.2rem; }
        .welcome-banner p { margin: 0; opacity: 0.8; font-size: 1.1rem; }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 25px;
        }

        .stat-card {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          border: 1px solid rgba(0,0,0,0.05);
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .stat-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(30, 60, 114, 0.12);
          border-color: rgba(212, 175, 55, 0.3);
        }
        .stat-icon {
          width: 60px; height: 60px;
          background: #f0f4ff;
          color: var(--royal-blue);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin-bottom: 20px;
          transition: all 0.3s;
        }
        .stat-card:hover .stat-icon {
          background: var(--royal-blue);
          color: var(--gold);
        }
        .stat-card h3 {
          margin: 0 0 5px;
          font-size: 1.4rem;
          color: #2d3748;
        }
        .stat-card p {
          margin: 0;
          color: #718096;
        }
        @media (max-width: 1024px) {
          .sidebar { 
            position: fixed;
            left: ${isSidebarOpen ? '0' : '-280px'};
            top: 0;
            height: 100vh;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .main-content { padding: 80px 20px 20px; }
          .header { flex-direction: column-reverse; gap: 20px; align-items: center; text-align: center; }
          .welcome-banner { padding: 30px 20px; }
          .welcome-banner h1 { font-size: 1.8rem; }
          .mobile-toggle {
            display: flex !important;
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1001;
            background: var(--royal-blue);
            color: var(--gold);
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
            z-index: 99;
            backdrop-filter: blur(3px);
          }
        }
        .mobile-toggle { display: none; }
      `}</style>

      <button className="mobile-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? <Close /> : <Menu />}
      </button>

      <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>

      <aside className="sidebar">
        <div className="brand">
          <AdminPanelSettings className="brand-icon" fontSize="large" />
          HealthHub
        </div>

        <nav className="menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`menu-btn ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <Logout /> Sign Out
        </button>
      </aside>

      <main className="main-content">
        <header className="header">
          <div className="page-title">
            {menuItems.find(i => i.id === activeTab)?.label || 'Dashboard'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: '600', color: '#2d3748' }}>{user.name}</div>
              <div style={{ fontSize: '0.85rem', color: '#718096' }}>Administrator</div>
            </div>
            <div style={{
              width: '45px', height: '45px',
              background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
              borderRadius: '50%', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 'bold', fontSize: '1.2rem',
              boxShadow: '0 4px 10px rgba(30, 60, 114, 0.3)'
            }}>
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        <div className="content-area">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;