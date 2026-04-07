// src/Dashboards/Doctor/DoctorDashboard.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home,
  CalendarMonth,
  NoteAdd,
  History,
  Logout,
  LocalHospital,
  Person,
  Menu,
  Close
} from '@mui/icons-material';

const DoctorDashboard = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [doctorData, setDoctorData] = useState({
    name: 'Not Provided',
    doctorId: 'Not Provided',
    email: 'Not Provided',
    contact: 'Not Provided',
    specialization: 'Not Provided',
    experience: 'Not Provided',
    qualification: 'Not Provided',
    availableDays: 'Not Provided',
    availableTimings: 'Not Provided',
    consultationFee: 'Not Provided',
    address: 'Not Provided',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      window.location.href = '/login';
      return;
    }
    const user = JSON.parse(userStr);

    // Improved array handling
    const days = Array.isArray(user.availableDays) ? user.availableDays.join(', ') : (user.availableDays || 'Not Provided');

    setDoctorData({
      name: user.name || 'Not Provided',
      doctorId: user.doctorId || 'Not Provided',
      email: user.email || 'Not Provided',
      contact: user.contact || 'Not Provided',
      specialization: user.specialization || 'Not Provided',
      experience: user.experience?.toString() || 'Not Provided',
      qualification: user.qualification || 'Not Provided',
      availableDays: days,
      availableTimings: user.availableTimings || 'Not Provided',
      consultationFee: user.consultationFee || 'Not Provided',
      address: user.address || 'Not Provided',
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="doctor-dashboard">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

        :root {
          --doc-primary: #1a237e;
          --doc-primary-light: #283593;
          --doc-accent: #00acc1;
          --doc-bg: #f2f7fb;
        }

        body, html {
          margin: 0; padding: 0;
          font-family: 'Outfit', sans-serif;
          background: var(--doc-bg);
          height: 100%;
        }

        .doctor-dashboard {
          display: flex;
          min-height: 100vh;
          background: var(--doc-bg);
        }

        /* Sidebar */
        .sidebar {
          width: 280px;
          background: linear-gradient(180deg, var(--doc-primary) 0%, #10163a 100%);
          color: white;
          padding: 30px 20px;
          display: flex; flex-direction: column;
          box-shadow: 6px 0 20px rgba(26, 35, 126, 0.2);
          position: sticky; top: 0; height: 100vh;
          z-index: 100;
        }

        .brand {
          font-size: 1.6rem; font-weight: 700; margin-bottom: 50px;
          display: flex; align-items: center; gap: 12px;
          letter-spacing: 0.5px;
        }
        .brand-icon { color: var(--doc-accent); }

        .menu { list-style: none; padding: 0; flex: 1; }
        .menu-item { margin-bottom: 10px; }

        .menu-link {
          display: flex; align-items: center; gap: 15px;
          padding: 14px 20px; color: rgba(255,255,255,0.75);
          text-decoration: none; border-radius: 12px;
          font-weight: 500; transition: all 0.3s ease;
        }
        .menu-link:hover, .menu-link.active {
          background: rgba(255,255,255,0.1);
          color: white; transform: translateX(5px);
          border-left: 4px solid var(--doc-accent);
        }
        .menu-link.active { background: linear-gradient(90deg, rgba(0, 172, 193, 0.2) 0%, transparent 100%); }

        .logout-btn {
          margin-top: auto; padding: 14px;
          background: rgba(255, 82, 82, 0.15); color: #ff8a80;
          border: 1px solid rgba(255, 82, 82, 0.3);
          border-radius: 12px; cursor: pointer; font-weight: 600;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: all 0.3s;
        }
        .logout-btn:hover { background: #ff5252; color: white; }

        /* Main Content */
        .main-content {
          flex: 1; padding: 40px 50px; overflow-y: auto;
        }

        .header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 40px;
        }
        .welcome h1 { font-size: 2.2rem; color: var(--doc-primary); margin: 0 0 5px; }
        .welcome p { color: #607d8b; margin: 0; font-size: 1.1rem; }

        .profile-btn {
          display: flex; align-items: center; gap: 15px;
          background: white; padding: 8px 15px; border-radius: 50px;
          border: 1px solid #dce4ec; cursor: pointer; transition: all 0.2s;
          box-shadow: 0 4px 10px rgba(0,0,0,0.03);
        }
        .profile-btn:hover { box-shadow: 0 8px 20px rgba(0,0,0,0.08); transform: translateY(-2px); }
        .avatar {
          width: 42px; height: 42px; background: var(--doc-primary); color: white;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          font-weight: 700;
        }

        /* Profile Dropdown */
        .profile-dropdown {
          position: absolute; top: 90px; right: 50px; width: 320px;
          background: white; border-radius: 20px; overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1); border: 1px solid #e1e8ed;
          z-index: 50; animation: slideDown 0.3s ease-out;
        }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

        .dropdown-header {
          background: linear-gradient(135deg, var(--doc-primary) 0%, var(--doc-primary-light) 100%);
          color: white; padding: 25px; text-align: center;
        }
        .dropdown-body { padding: 20px; font-size: 0.9rem; color: #455a64; }
        .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f4f8; }
        .row:last-child { border-bottom: none; }

        /* Dashboard Cards */
        .dashboard-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px; margin-bottom: 40px;
        }

        .action-card {
          background: white; border-radius: 20px; padding: 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.04); border: 1px solid rgba(0,0,0,0.03);
          transition: all 0.3s; position: relative; overflow: hidden;
          display: flex; flex-direction: column; justify-content: space-between; height: 180px;
        }
        .action-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(26, 35, 126, 0.1); }
        .action-card::after {
          content: ''; position: absolute; top: -50px; right: -50px;
          width: 150px; height: 150px; background: var(--doc-primary);
          border-radius: 50%; opacity: 0.05; transition: transform 0.4s;
        }
        .action-card:hover::after { transform: scale(1.2); }

        .card-icon {
          width: 60px; height: 60px; background: #e8eaf6; color: var(--doc-primary);
          border-radius: 16px; display: flex; align-items: center; justify-content: center;
          font-size: 1.8rem; margin-bottom: 20px;
        }
        .action-card h3 { margin: 0 0 10px; color: #263238; font-size: 1.3rem; }
        .action-card p { margin: 0; color: #78909c; font-size: 0.95rem; }
        
        .card-link {
          position: absolute; bottom: 30px; right: 30px;
          width: 40px; height: 40px; border-radius: 50%;
          background: var(--doc-primary); color: white; display: flex; align-items: center;
          justify-content: center; opacity: 0; transform: translateX(20px); transition: all 0.3s;
        }
        .action-card:hover .card-link { opacity: 1; transform: translateX(0); }

        .hero {
          background: white; border-radius: 20px; padding: 50px; text-align: center;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03); border-bottom: 4px solid var(--doc-accent);
        }
        .hero h2 { color: var(--doc-primary); margin-bottom: 15px; }
        .hero p { color: #546e7a; max-width: 700px; margin: 0 auto; line-height: 1.6; }

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
          .header { flex-direction: column-reverse; gap: 20px; text-align: center; }
          .welcome h1 { font-size: 1.8rem; }
          .profile-section { width: 100%; display: flex; justify-content: center; }
          .profile-dropdown { width: calc(100vw - 40px); left: 0; right: 0; margin: 0 auto; top: 70px; }
          .mobile-menu-btn {
            display: flex !important;
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1001;
            background: var(--doc-primary);
            color: var(--doc-accent);
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
          .hero { padding: 30px 20px; }
        }
        .mobile-menu-btn { display: none; }
      `}</style>

      <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? <Close /> : <Menu />}
      </button>

      <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>

      <div className="sidebar">
        <div className="brand">
          <LocalHospital className="brand-icon" fontSize="large" />
          HealthHub+
        </div>
        <ul className="menu">
          <li className="menu-item"><Link to="/doctor-dashboard" className="menu-link active"><Home /> Dashboard</Link></li>
          <li className="menu-item"><Link to="/doctor/check-appointments" className="menu-link"><CalendarMonth /> Appointments</Link></li>
          <li className="menu-item"><Link to="/doctor/checkup-prescription" className="menu-link"><NoteAdd /> Issue Rx</Link></li>
          <li className="menu-item"><Link to="/doctor/history" className="menu-link"><History /> Patient History</Link></li>
        </ul>
        <button onClick={handleLogout} className="logout-btn"><Logout /> Sign Out</button>
      </div>

      <div className="main-content">
        <div className="header">
          <div className="welcome">
            <h1>Hello, Dr. {doctorData.name.split(' ')[0]}</h1>
            <p>Ready for your rounds today?</p>
          </div>

          <div className="profile-section">
            <button className="profile-btn" onClick={() => setShowProfile(!showProfile)}>
              <div className="avatar">{doctorData.name.charAt(0)}</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: '600', color: '#263238', fontSize: '0.95rem' }}>Dr. {doctorData.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#78909c' }}>{doctorData.specialization}</div>
              </div>
            </button>

            {showProfile && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <h3 style={{ margin: 0 }}>Dr. {doctorData.name}</h3>
                  <p style={{ margin: '5px 0 0', opacity: 0.8, fontSize: '0.85rem' }}>{doctorData.email}</p>
                </div>
                <div className="dropdown-body">
                  <div className="row"><strong>ID</strong> <span>{doctorData.doctorId}</span></div>
                  <div className="row"><strong>Exp</strong> <span>{doctorData.experience} Years</span></div>
                  <div className="row"><strong>Fee</strong> <span>₹{doctorData.consultationFee}</span></div>
                  <div className="row"><strong>Timings</strong> <span>{doctorData.availableTimings}</span></div>
                  <div className="row" style={{ flexDirection: 'column', gap: '5px', alignItems: 'flex-start' }}>
                    <strong>Days</strong>
                    <span style={{ fontSize: '0.8rem', color: '#78909c' }}>{doctorData.availableDays}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-grid">
          <Link to="/doctor/check-appointments" style={{ textDecoration: 'none' }}>
            <div className="action-card">
              <div>
                <div className="card-icon"><CalendarMonth style={{ fontSize: '32px' }} /></div>
                <h3>Check Appointments</h3>
                <p>View today's schedule and patient queue.</p>
              </div>
              <div className="card-link">➜</div>
            </div>
          </Link>

          <Link to="/doctor/checkup-prescription" style={{ textDecoration: 'none' }}>
            <div className="action-card">
              <div>
                <div className="card-icon"><NoteAdd style={{ fontSize: '32px' }} /></div>
                <h3>Issue Prescription</h3>
                <p>Digitally prescribe medicines and notes.</p>
              </div>
              <div className="card-link">➜</div>
            </div>
          </Link>

          <Link to="/doctor/history" style={{ textDecoration: 'none' }}>
            <div className="action-card">
              <div>
                <div className="card-icon"><History style={{ fontSize: '32px' }} /></div>
                <h3>Patient History</h3>
                <p>Access medical records and past visits.</p>
              </div>
              <div className="card-link">➜</div>
            </div>
          </Link>
        </div>

        <div className="hero">
          <h2>Clinical Excellence Dashboard</h2>
          <p>
            Manage your practice efficiently. Review appointments, issue digital prescriptions, and track patient history all in one secure place.
            Your digital assistant for better healthcare delivery.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;