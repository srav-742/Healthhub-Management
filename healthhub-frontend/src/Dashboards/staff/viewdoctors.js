// src/Dashboards/Staff/viewdoctors.js
import React, { useState, useEffect } from 'react';

const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5000') + '';

const ViewDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError('');
      setDoctors([]);

      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication required.');
        setLoading(false);
        return;
      }

      try {
        const url = `${API_BASE}/api/doctors/view/all`;
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch doctors');

        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setDoctors(data);
        } else {
          setError('No doctors available.');
        }
      } catch (err) {
        setError(err.message || 'Failed to load doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="doctors-view">
      <style>{`
        .doctors-view {
          animation: fadeIn 0.5s ease-out;
        }

        .header-title {
            font-size: 1.8rem;
            color: #134E5E;
            margin-bottom: 25px;
            font-weight: 700;
        }

        .doctors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 25px;
        }

        .doc-card {
          background: white;
          border-radius: 20px;
          padding: 25px;
          border: 1px solid rgba(255,255,255,0.8);
          box-shadow: 0 4px 15px rgba(0,0,0,0.04);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: transform 0.2s;
          position: relative;
          overflow: hidden;
        }

        .doc-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(113, 178, 128, 0.15);
          border-color: #a7d8b1;
        }

        .doc-card::before {
          content: "";
          position: absolute;
          top: 0; left: 0; width: 100%; height: 4px;
          background: linear-gradient(90deg, #134E5E, #71B280);
        }

        .doc-avatar {
            width: 70px;
            height: 70px;
            background: #f0fdf4;
            color: #15803d;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 15px;
            border: 2px solid #bbf7d0;
        }

        .doc-name {
            font-size: 1.2rem;
            color: #2d3748;
            font-weight: 700;
            margin-bottom: 5px;
        }
        
        .doc-spec {
            color: #134E5E;
            font-size: 0.9rem;
            font-weight: 600;
            background: #e6fffa;
            padding: 4px 12px;
            border-radius: 12px;
            margin-bottom: 15px;
        }

        .doc-info-row {
            width: 100%;
            display: flex;
            justify-content: space-between;
            font-size: 0.9rem;
            color: #718096;
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 1px dashed #e2e8f0;
        }
        .doc-info-row:last-child { border-bottom: none; margin-bottom: 0; }
        
        .empty-state {
          text-align: center;
          padding: 60px;
          color: #a0aec0;
          font-size: 1.1rem;
          background: white;
          border-radius: 20px;
        }
      `}</style>

      <h2 className="header-title">Available Doctors</h2>

      {loading ? (
        <div className="empty-state">Loading doctors...</div>
      ) : error ? (
        <div className="empty-state">{error}</div>
      ) : (
        <div className="doctors-grid">
          {doctors.map((doc, index) => (
            <div className="doc-card" key={index}>
              <div className="doc-avatar">{doc.name.charAt(0)}</div>
              <div className="doc-name">Dr. {doc.name}</div>
              <div className="doc-spec">{doc.specialization}</div>

              <div className="doc-info-row">
                <span>Fee:</span> <span style={{ fontWeight: 600, color: '#2d3748' }}>₹{doc.consultationFee}</span>
              </div>
              <div className="doc-info-row">
                <span>Timings:</span> <span>{doc.availableTime}</span>
              </div>
              <div className="doc-info-row">
                <span>Days:</span> <span>{doc.availableDays?.join(', ') || 'Mon-Fri'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewDoctors;