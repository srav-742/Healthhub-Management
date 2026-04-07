// src/Dashboards/Doctor/CheckAppointments.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowBack,
  AccessTime,
  EventAvailable,
  Description,
  NoteAdd,
  CheckCircle,
  Person
} from '@mui/icons-material';

const CheckAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/appointment/doctor/my?type=active`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    } catch (err) { console.error('Fetch error:', err); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleMarkDone = async (id) => {
    if (!window.confirm('Mark this appointment as completed? This will move it to history.')) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/doctor/appointments/complete/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        setAppointments(prev => prev.filter(a => a._id !== id));
        alert('Appointment completed successfully');
      }
    } catch (err) { alert('Failed to complete appointment'); }
  };

  const togglePaymentStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Paid' ? 'Unpaid' : 'Paid';
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/doctor/appointments/${id}/payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setAppointments(prev => prev.map(a => a._id === id ? { ...a, paymentStatus: newStatus } : a));
      }
    } catch (err) { alert('Failed to update status'); }
  };

  const navigateToPrescription = (apt) => {
    navigate('/doctor/checkup-prescription', {
      state: {
        appointmentId: apt._id,
        patientName: apt.patientName,
        patientId: apt.patientId
      }
    });
  };

  const navigateToDocuments = (apt) => {
    navigate('/doctor/uploaded-files', {
      state: {
        patientId: apt.patientId,
        patientName: apt.patientName
      }
    });
  };

  return (
    <div className="check-appt-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
        .check-appt-page { font-family: 'Outfit', sans-serif; background: #f2f7fb; min-height: 100vh; padding: 40px; }
        .container { max-width: 1200px; margin: 0 auto; }
        .back-link { color: #1a237e; text-decoration: none; margin-bottom: 20px; display: inline-flex; align-items: center; gap: 8px; font-weight: 600; padding: 10px 15px; background: white; border-radius: 12px; }
        
        .header { margin-bottom: 30px; text-align: center; }
        
        /* Grid Layout for Cards */
        .appt-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 25px;
          margin-top: 30px;
        }

        /* Card Styling */
        .appt-card { 
          background: white; 
          padding: 25px; 
          border-radius: 20px; 
          box-shadow: 0 10px 30px rgba(0,0,0,0.04); 
          display: flex; 
          flex-direction: column; 
          gap: 15px; 
          transition: transform 0.2s;
          border: 1px solid rgba(0,0,0,0.03);
          position: relative;
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
        .status-completed { background: #e1f5fe; color: #0277bd; }

        .problem-section { background: #fafafa; padding: 12px; border-radius: 12px; border: 1px dashed #cfd8dc; flex-grow: 1; }
        .problem-section strong { display: block; font-size: 0.8rem; color: #455a64; margin-bottom: 4px; text-transform: uppercase; }
        .problem-text { color: #37474f; font-size: 0.95rem; margin: 0; }

        .fees-toggle {
          display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; color: #546e7a;
          margin-top: 10px; padding-top: 10px; border-top: 1px solid #f0f0f0;
        }
        .switch-btn { background: none; border: none; color: #5c6bc0; cursor: pointer; text-decoration: underline; font-size: 0.85rem; font-weight: 600; }

        .actions-row { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; }
        
        /* Action Buttons */
        .btn { 
          border: none; padding: 10px; border-radius: 12px; cursor: pointer; 
          font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; 
          font-size: 0.9rem; transition: all 0.2s; width: 100%;
        }
        .btn-doc { background: #e3f2fd; color: #1565c0; }
        .btn-doc:hover { background: #bbdefb; }
        .btn-doc.has-docs { background: #bbdefb; border: 1px solid #2196f3; }
        
        .btn-rx { background: #e0f2f1; color: #00695c; }
        .btn-rx:hover { background: #b2dfdb; }
        .btn-rx-done { background: #e8f5e9; color: #2e7d32; cursor: default; }

        .btn-done { background: #1a237e; color: white; margin-top: 5px; }
        .btn-done:hover { background: #0d47a1; box-shadow: 0 4px 10px rgba(26, 35, 126, 0.2); }
        
        .empty-state { text-align: center; color: #b0bec5; margin-top: 50px; grid-column: 1 / -1; }

        @media (max-width: 768px) {
          .check-appt-page { padding: 20px 15px; }
          .header h1 { font-size: 1.8rem; }
          .appt-grid { grid-template-columns: 1fr; gap: 15px; }
          .appt-card { padding: 20px; }
          .patient-name { font-size: 1.1rem; }
          .btn { padding: 12px; }
        }
      `}</style>

      <div className="container">
        <Link to="/doctor-dashboard" className="back-link"><ArrowBack fontSize="small" /> Dashboard</Link>

        {/* Header */}
        <div className="header">
          <h1 style={{ color: '#1a237e', margin: 0 }}>Patient Queue</h1>
          <p style={{ color: '#546e7a' }}>Manage today's appointments</p>
        </div>

        {/* Grid View of Cards */}
        <div className="appt-grid">
          {loading ? <div className="empty-state">Loading...</div> : appointments.length > 0 ? (
            appointments.map(apt => (
              <div className="appt-card" key={apt._id}>

                {/* Top Section: Avatar, Name, Time, Status */}
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

                {/* Problem Section */}
                <div className="problem-section">
                  <strong>Reason for Visit</strong>
                  <p className="problem-text">{apt.problem || 'No details provided'}</p>
                </div>

                {/* Fees and Payment Toggle */}
                <div className="fees-toggle">
                  <span>Fee: ₹{apt.consultationFee}</span>
                  <button className="switch-btn" onClick={() => togglePaymentStatus(apt._id, apt.paymentStatus || 'Unpaid')}>
                    Mark {(apt.paymentStatus || 'Unpaid') === 'Paid' ? 'Unpaid' : 'Paid'}
                  </button>
                </div>

                {/* Actions: Documents, Rx, Mark Done */}
                <div className="actions-row">
                  {/* Documents Button */}
                  <button
                    className={`btn btn-doc ${apt.documentCount > 0 ? 'has-docs' : ''}`}
                    onClick={() => navigateToDocuments(apt)}
                  >
                    <Description fontSize="small" />
                    {apt.documentCount > 0 ? `View Documents (${apt.documentCount})` : 'No Documents'}
                  </button>

                  {/* Rx Button */}
                  {apt.hasPrescription ? (
                    <button className="btn btn-rx-done">
                      <CheckCircle fontSize="small" /> Rx Issued
                    </button>
                  ) : (
                    <button className="btn btn-rx" onClick={() => navigateToPrescription(apt)}>
                      <NoteAdd fontSize="small" /> Issue Rx
                    </button>
                  )}

                  {/* Mark Done Button - Always visible in Active Queue */}
                  <button className="btn btn-done" onClick={() => handleMarkDone(apt._id)}>
                    Mark Done
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <EventAvailable style={{ fontSize: '60px', marginBottom: '10px' }} />
              <p>No active appointments found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckAppointments;