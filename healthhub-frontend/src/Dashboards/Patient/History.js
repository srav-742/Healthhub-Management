// src/components/History.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowBack,
  History as HistoryIcon,
  Event,
  Description,
  AttachMoney,
  Medication,
  Circle
} from '@mui/icons-material';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const loadData = async () => {
      try {
        const historyRes = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/history/history', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const prescRes = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/prescription/my', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        const docRes = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/document/my', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        const historyData = historyRes.ok ? await historyRes.json() : [];
        const prescData = prescRes.ok ? await prescRes.json() : [];
        const docData = docRes.ok ? await docRes.json() : [];

        // ✅ Map Prescriptions to a keyed object by appointmentId
        const prescMap = prescData.reduce((acc, p) => {
          acc[p.appointmentId] = p; // Assuming one Rx per appointment
          return acc;
        }, {});

        // ✅ Merge Rx and Documents into each appointment
        const mergedHistory = historyData.map(apt => ({
          ...apt,
          prescription: prescMap[apt.appointmentId], // Attach full prescription object if exists
          documents: docData.filter(d =>
            d.appointmentId && d.appointmentId._id === apt.appointmentId
          )
        })).sort((a, b) => new Date(b.date) - new Date(a.date));

        setHistory(mergedHistory);

      } catch (err) { console.error('Failed to load history', err); }
      finally { setLoading(false); }
    };
    loadData();
  }, [token]);

  return (
    <div className="history-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

        .history-page {
          font-family: 'Outfit', sans-serif;
          background: linear-gradient(135deg, #fdfbfd 0%, #f4f0fa 100%);
          min-height: 100vh;
          padding: 40px;
          animation: fadeIn 0.5s ease-out;
        }

        .container { max-width: 900px; margin: 0 auto; }

        .back-link { 
          color: #667eea; text-decoration: none; margin-bottom: 25px; 
          display: inline-flex; align-items: center; gap: 8px; font-weight: 600; 
          padding: 10px 15px; background: white; border-radius: 12px; 
          box-shadow: 0 2px 10px rgba(0,0,0,0.05); transition: transform 0.2s;
        }
        .back-link:hover { transform: translateX(-5px); box-shadow: 0 4px 15px rgba(0,0,0,0.08); }

        .header { text-align: center; margin-bottom: 50px; }
        .header h1 { color: #2d3748; font-size: 2.5rem; font-weight: 700; margin: 0; display: flex; align-items: center; justify-content: center; gap: 15px; }
        .header p { color: #718096; font-size: 1.1rem; margin-top: 10px; }

        .timeline { position: relative; padding-left: 30px; border-left: 2px solid rgba(102, 126, 234, 0.2); }
        
        .timeline-item {
          position: relative; margin-bottom: 40px; 
          animation: slideIn 0.4s ease-out;
        }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }

        .timeline-dot {
          position: absolute; left: -39px; top: 0; width: 16px; height: 16px; 
          background: white; border: 4px solid #667eea; border-radius: 50%;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
        }

        .history-card {
          background: white; padding: 30px; border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.8);
          box-shadow: 0 10px 30px rgba(0,0,0,0.04);
          transition: transform 0.3s;
        }
        .history-card:hover { transform: translateY(-5px); box-shadow: 0 15px 40px rgba(118, 75, 162, 0.1); }

        .card-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px dashed #e2e8f0;
        }
        
        .doctor-info h3 { margin: 0; font-size: 1.3rem; color: #2d3748; }
        .doctor-info span { font-size: 0.9rem; color: #718096; }

        .status-badge {
          padding: 6px 12px; border-radius: 12px; font-weight: 600; font-size: 0.8rem; text-transform: uppercase;
          background: #ebf8ff; color: #3182ce;
        }

        .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; color: #4a5568; margin-bottom: 20px;}
        .info-item { display: flex; align-items: center; gap: 8px; font-size: 0.95rem; }

        .presc-box {
          margin-top: 20px; background: #faf5ff; padding: 25px; border-radius: 16px;
          border: 1px solid #e9d8fd; position: relative;
        }
        .presc-label {
          position: absolute; top: -12px; left: 20px; background: #805ad5; color: white;
          padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700;
          display: flex; align-items: center; gap: 6px;
        }
        .med-item { 
          display: flex; justify-content: space-between; align-items: center;
          padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,0.05); font-size: 0.95rem; color: #2d3748; 
        }
        .med-item:last-child { border-bottom: none; }
        .med-name { font-weight: 600; }
        .med-detail { color: #718096; font-size: 0.9rem; }

        .empty-state { text-align: center; color: #cbd5e0; padding: 60px; }
      `}</style>

      <div className="container">
        <Link to="/patient-dashboard" className="back-link"><ArrowBack fontSize="small" /> Dashboard</Link>

        <div className="header">
          <h1><HistoryIcon fontSize="large" /> Medical Timeline</h1>
          <p>Your complete health journey history.</p>
        </div>

        {loading ? (
          <div className="empty-state">Loading history...</div>
        ) : history.length > 0 ? (
          <div className="timeline">
            {history.map((apt, index) => (
              <div className="timeline-item" key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="timeline-dot"></div>
                <div className="history-card">

                  {/* Appointment Header */}
                  <div className="card-header">
                    <div className="doctor-info">
                      <h3>Dr. {apt.doctorName}</h3>
                      <span>{new Date(apt.date).toLocaleDateString()}</span>
                    </div>
                    <span className="status-badge">Appointment Completed</span>
                  </div>

                  {/* Appointment Details */}
                  <div className="info-grid">
                    <div className="info-item"><AttachMoney style={{ color: '#667eea' }} fontSize="small" /> Paid: ₹{apt.consultationFee}</div>
                    <div className="info-item"><Description style={{ color: '#667eea' }} fontSize="small" /> {apt.hasDocuments ? 'Documents Uploaded' : 'No Documents'}</div>
                    <div className="info-item"><Event style={{ color: '#667eea' }} fontSize="small" /> {apt.time}</div>
                  </div>

                  {/* Documents List */}
                  {apt.documents && apt.documents.length > 0 && (
                    <div style={{ marginTop: '15px', marginBottom: '15px', background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px dashed #cbd5e0' }}>
                      <strong style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#4a5568', marginBottom: '10px', textTransform: 'uppercase' }}>
                        <Description style={{ fontSize: '16px' }} /> Uploaded Documents
                      </strong>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {apt.documents.map(doc => (
                          <div key={doc._id} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#2d3748', background: 'white', padding: '8px', borderRadius: '8px', border: '1px solid #edf2f7' }}>
                            <span style={{ fontWeight: '500' }}>{doc.fileName}</span>
                            <span style={{ fontSize: '0.8rem', color: '#718096' }}>— {doc.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Integrated Prescription Box */}
                  {apt.prescription && (
                    <div className="presc-box">
                      <div className="presc-label"><Medication style={{ fontSize: '14px' }} /> Prescription Issued</div>

                      {apt.prescription.medicines.map((med, idx) => (
                        <div key={idx} className="med-item">
                          <span className="med-name">• {med.name}</span>
                          <span className="med-detail">{med.dosage} | {med.frequency} ({med.duration})</span>
                        </div>
                      ))}

                      {apt.prescription.notes && (
                        <div style={{ marginTop: '15px', fontSize: '0.9rem', color: '#553c9a', fontStyle: 'italic', background: 'rgba(255,255,255,0.5)', padding: '10px', borderRadius: '8px' }}>
                          <strong>Doctor's Note:</strong> {apt.prescription.notes}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <HistoryIcon style={{ fontSize: '60px', marginBottom: '20px' }} />
            <p>No history found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;