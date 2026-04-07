// src/Dashboards/Doctor/PatientHistory.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowBack,
  Search,
  History,
  MedicalServices,
  Description,
  Event,
  Person,
  AccessTime,
  CheckCircle,
  EventAvailable
} from '@mui/icons-material';

const PatientHistory = () => {
  // Search State
  const [email, setEmail] = useState('');
  const [patientHistory, setPatientHistory] = useState([]);
  const [searchError, setSearchError] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // My History State
  const [myHistory, setMyHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [viewMode, setViewMode] = useState('history'); // 'history' (My Appointments) | 'search' (Patient Search)
  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();

  useEffect(() => {
    if (viewMode === 'history') {
      fetchMyHistory();
    }
  }, [viewMode, token]);

  const fetchMyHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/appointment/doctor/my?type=history`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMyHistory(data);
      }
    } catch (err) { console.error('Fetch error:', err); }
    finally { setHistoryLoading(false); }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSearchLoading(true);
    setSearchError('');
    setSearched(true);
    setPatientHistory([]);

    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/history/patient/${email}`);
      setPatientHistory(res.data);
    } catch (err) {
      setSearchError(err.response?.data?.message || 'No history found for this patient.');
    } finally {
      setSearchLoading(false);
    }
  };

  const navigateToDocuments = (apt) => {
    navigate('/doctor/uploaded-files', {
      state: {
        patientId: apt.patientId || apt.patientEmail, // Fallback if ID is missing in history
        patientName: apt.patientName
      }
    });
  };

  return (
    <div className="history-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

        .history-page {
          font-family: 'Outfit', sans-serif;
          background: #f2f7fb;
          min-height: 100vh;
          padding: 40px;
        }

        .container { max-width: 1200px; margin: 0 auto; }

        .back-link { 
          color: #1a237e; text-decoration: none; margin-bottom: 30px; 
          display: inline-flex; align-items: center; gap: 8px; font-weight: 600; 
          padding: 10px 15px; background: white; border-radius: 12px; 
          box-shadow: 0 2px 10px rgba(0,0,0,0.05); transition: transform 0.2s;
        }
        .back-link:hover { transform: translateX(-5px); }

        /* Toggle Styling */
        .view-toggle {
          display: flex; justify-content: center; gap: 15px; margin-bottom: 40px;
        }
        .toggle-btn {
          padding: 12px 30px; border-radius: 25px; border: none; cursor: pointer;
          font-weight: 600; font-size: 1rem; transition: all 0.2s;
          background: #e0e0e0; color: #757575; display: flex; align-items: center; gap: 8px;
        }
        .toggle-btn.active {
          background: #1a237e; color: white; box-shadow: 0 4px 15px rgba(26, 35, 126, 0.3); transform: scale(1.05);
        }

        /* Search Section Styles */
        .search-card {
          background: white; border-radius: 20px; padding: 40px; text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.03);
          margin-bottom: 40px; max-width: 800px; margin-left: auto; margin-right: auto;
        }
        .search-box { display: flex; gap: 10px; max-width: 500px; margin: 20px auto 0; }
        .styled-input {
          flex: 1; padding: 12px 20px; border-radius: 12px; border: 1px solid #cfd8dc;
          font-family: inherit; font-size: 1rem; transition: border-color 0.2s;
        }
        .styled-input:focus { outline: none; border-color: #1a237e; box-shadow: 0 0 0 3px rgba(26, 35, 126, 0.1); }
        .search-btn {
          background: #1a237e; color: white; border: none; padding: 12px 25px;
          border-radius: 12px; cursor: pointer; font-weight: 600;
          display: flex; align-items: center; gap: 8px; transition: transform 0.2s;
        }
        .search-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(26, 35, 126, 0.3); }

        /* Timeline / Search Results Styles */
        .timeline { position: relative; padding-left: 30px; border-left: 2px solid #e0e0e0; margin-top: 40px; }
        .record-card {
          background: white; padding: 25px; border-radius: 16px; margin-bottom: 30px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.03); position: relative;
          border: 1px solid #eceff1;
        }
        .dot {
          position: absolute; left: -41px; top: 25px; width: 16px; height: 16px;
          background: #1a237e; border: 4px solid #f2f7fb; border-radius: 50%;
        }
        .record-header {
          display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px dashed #cfd8dc; padding-bottom: 10px;
        }
        .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
        .info-item { display: flex; align-items: center; gap: 8px; color: #546e7a; }

        /* My History Cards Grid (Copied/Adapted from CheckAppointments) */
        .appt-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 25px; margin-top: 30px;
        }
        .appt-card { 
          background: white; padding: 25px; border-radius: 20px; 
          box-shadow: 0 10px 30px rgba(0,0,0,0.04); display: flex; flex-direction: column; gap: 15px; 
          border: 1px solid rgba(0,0,0,0.03); transition: transform 0.2s;
        }
        .appt-card:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.08); }
        .card-top { display: flex; justify-content: space-between; align-items: flex-start; }
        .patient-info { display: flex; gap: 12px; align-items: flex-start; }
        .patient-avatar {
          width: 45px; height: 45px; background: #e8eaf6; color: #1a237e;
          border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700;
        }
        .patient-name { font-size: 1.2rem; font-weight: 700; color: #37474f; margin: 0 0 2px 0; }
        .time-badge { font-size: 0.8rem; color: #78909c; display: flex; align-items: center; gap: 4px; }
        .status-badge {
          font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 20px;
          text-transform: uppercase; letter-spacing: 0.5px;
        }
        .status-paid { background: #e8f5e9; color: #2e7d32; }
        .status-unpaid { background: #ffebee; color: #c62828; }
        .problem-section { background: #fafafa; padding: 12px; border-radius: 12px; border: 1px dashed #cfd8dc; flex-grow: 1; }
        .problem-section strong { display: block; font-size: 0.8rem; color: #455a64; margin-bottom: 4px; text-transform: uppercase; }
        .problem-text { color: #37474f; font-size: 0.95rem; margin: 0; }
        .btn { 
          border: none; padding: 10px; border-radius: 12px; cursor: pointer; 
          font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; 
          font-size: 0.9rem; transition: all 0.2s; width: 100%;
        }
        .btn-doc { background: #e3f2fd; color: #1565c0; }
        .btn-doc:hover { background: #bbdefb; }
        .btn-doc.has-docs { background: #bbdefb; border: 1px solid #2196f3; }
        
        .empty-state { text-align: center; color: #b0bec5; margin-top: 50px; }
      `}</style>

      <div className="container">
        <Link to="/doctor-dashboard" className="back-link"><ArrowBack fontSize="small" /> Dashboard</Link>

        {/* View Toggle */}
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === 'history' ? 'active' : ''}`}
            onClick={() => setViewMode('history')}
          >
            <History /> My Appointment History
          </button>
          <button
            className={`toggle-btn ${viewMode === 'search' ? 'active' : ''}`}
            onClick={() => setViewMode('search')}
          >
            <Search /> Search Patient
          </button>
        </div>

        {/* MY APPOINTMENT HISTORY VIEW */}
        {viewMode === 'history' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h1 style={{ color: '#1a237e', margin: 0 }}>Appointment History</h1>
              <p style={{ color: '#546e7a' }}>View all your past completed appointments</p>
            </div>

            {historyLoading ? <div className="empty-state">Loading history...</div> : (
              <div className="appt-grid">
                {myHistory.length > 0 ? (
                  myHistory.map(apt => (
                    <div className="appt-card" key={apt._id}>
                      <div className="card-top">
                        <div className="patient-info">
                          <div className="patient-avatar"><Person /></div>
                          <div>
                            <h3 className="patient-name">{apt.patientName}</h3>
                            <div className="time-badge"><AccessTime fontSize="small" style={{ fontSize: '14px' }} /> {new Date(apt.date).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <span className={`status-badge ${(apt.paymentStatus || 'Unpaid') === 'Paid' ? 'status-paid' : 'status-unpaid'}`}>
                          {apt.paymentStatus || 'Unpaid'}
                        </span>
                      </div>

                      <div className="problem-section">
                        <strong>Reason for Visit</strong>
                        <p className="problem-text">{apt.problem || 'No details provided'}</p>
                      </div>

                      <div style={{ padding: '10px 0', borderTop: '1px solid #f0f0f0', color: '#546e7a', fontSize: '0.9rem' }}>
                        Fee: ₹{apt.consultationFee}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button
                          className={`btn btn-doc ${apt.documentCount > 0 ? 'has-docs' : ''}`}
                          onClick={() => navigateToDocuments(apt)}
                        >
                          <Description fontSize="small" />
                          {apt.documentCount > 0 ? `View Documents (${apt.documentCount})` : 'No Documents'}
                        </button>

                        <div style={{ textAlign: 'center', color: '#2e7d32', fontWeight: '600', padding: '8px', background: '#e8f5e9', borderRadius: '12px' }}>
                          <CheckCircle fontSize="small" style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Completed
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                    <EventAvailable style={{ fontSize: '60px', marginBottom: '10px' }} />
                    <p>No completed appointments found.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* SEARCH PATIENT VIEW */}
        {viewMode === 'search' && (
          <div>
            <div className="search-card">
              <h1 style={{ margin: 0, color: '#1a237e' }}>Patient Records Search</h1>
              <p style={{ color: '#607d8b' }}>Access comprehensive medical history for a specific patient.</p>

              <form className="search-box" onSubmit={handleSearch}>
                <input
                  className="styled-input"
                  placeholder="Enter Patient Email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="search-btn" disabled={searchLoading}>
                  <Search fontSize="small" /> {searchLoading ? 'Searching...' : 'Search'}
                </button>
              </form>
            </div>

            {searchError && <div style={{ textAlign: 'center', color: '#c62828', background: '#ffebee', padding: '15px', borderRadius: '10px' }}>{searchError}</div>}

            {searched && !searchLoading && !searchError && patientHistory.length > 0 && (
              <div className="timeline">
                {patientHistory.map((record, index) => (
                  <div className="record-card" key={index}>
                    <div className="dot"></div>
                    <div className="record-header">
                      <div className="doc-name">Dr. {record.doctorName}</div>
                      <div className="date"><Event fontSize="small" /> {new Date(record.date).toLocaleDateString()}</div>
                    </div>
                    <div className="info-grid">
                      <div className="info-item"><MedicalServices style={{ color: '#1a237e', opacity: 0.7 }} fontSize="small" /> Fee: ₹{record.consultationFee}</div>
                      <div className="info-item"><Description style={{ color: '#1a237e', opacity: 0.7 }} fontSize="small" /> {record.hasDocuments ? 'Documents Attached' : 'No Documents'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {searched && !searchLoading && !searchError && patientHistory.length === 0 && (
              <div className="empty-state">
                <History style={{ fontSize: '50px', marginBottom: '15px' }} />
                <p>No medical history records found for this patient.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientHistory;