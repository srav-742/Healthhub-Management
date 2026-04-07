// src/Dashboards/Staff/viewappointments.js
import React, { useState, useEffect } from 'react';

const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5000') + '';

const ViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError('');
      setAppointments([]);

      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication failed. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const url = `${API_BASE}/api/appointments/view/all`;
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch appointments');

        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setAppointments(data);
        } else {
          setError('No appointments found.');
        }
      } catch (err) {
        setError(err.message || 'Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="appointments-view">
      <style>{`
        .appointments-view {
          animation: fadeIn 0.5s ease-out;
        }

        .header-title {
          font-size: 1.8rem;
          color: #134E5E;
          margin-bottom: 25px;
          font-weight: 700;
        }

        .appointments-grid {
          display: grid;
          gap: 20px;
        }

        .appt-card {
          background: white;
          border-radius: 16px;
          padding: 25px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          border: 1px solid rgba(255,255,255,0.8);
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: transform 0.2s;
        }

        .appt-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(113, 178, 128, 0.15);
          border-color: #a7d8b1;
        }

        .appt-main {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .date-badge {
          background: #f0fdf4;
          color: #15803d;
          padding: 10px 15px;
          border-radius: 12px;
          text-align: center;
          min-width: 80px;
          border: 1px solid #bbf7d0;
        }
        .date-day { font-size: 1.2rem; font-weight: 800; display: block; }
        .date-month { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; }

        .appt-details h4 {
          margin: 0 0 5px;
          font-size: 1.1rem;
          color: #2d3748;
        }
        
        .detail-line {
          font-size: 0.9rem;
          color: #718096;
          margin-bottom: 3px;
        }

        .status-badge {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 700;
        }
        .status-Booked { background: #dcfce7; color: #166534; }
        .status-Cancelled { background: #fee2e2; color: #991b1b; }
        .status-Completed { background: #e0e7ff; color: #3730a3; }

        .fee {
            font-weight: 700;
            color: #134E5E;
            font-size: 1.1rem;
        }

        .empty-state {
          text-align: center;
          padding: 50px;
          color: #a0aec0;
          font-size: 1.1rem;
          background: white;
          border-radius: 20px;
        }
      `}</style>

      <h2 className="header-title">Patient Appointments</h2>

      {loading ? (
        <div className="empty-state">Loading appointments...</div>
      ) : error ? (
        <div className="empty-state">{error}</div>
      ) : (
        <div className="appointments-grid">
          {appointments.map((app, index) => (
            <div className="appt-card" key={index}>
              <div className="appt-main">
                <div className="date-badge">
                  <span className="date-day">{new Date(app.date).getDate()}</span>
                  <span className="date-month">{new Date(app.date).toLocaleString('default', { month: 'short' })}</span>
                </div>
                <div className="appt-details">
                  <h4>{app.patientName} <span style={{ fontWeight: 'normal', fontSize: '0.9rem', color: '#a0aec0' }}>ID: {app.patientId}</span></h4>
                  <div className="detail-line">Dr. {app.doctorName} ({app.doctorSpecialization})</div>
                  <div className="detail-line">Time: {app.date ? new Date(app.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div className="fee">₹{app.consultationFee}</div>
                <div style={{ marginTop: '8px' }}>
                  <span className={`status-badge status-${app.status}`}>
                    {app.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewAppointments;