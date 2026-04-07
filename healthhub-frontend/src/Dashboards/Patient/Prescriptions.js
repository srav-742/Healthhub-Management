// src/components/Prescriptions.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowBack, ReceiptLong, CheckCircle, Medication, Event, LocalPharmacy, MedicalServices } from '@mui/icons-material';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('authToken');

  // Removed localStorage logic for reliability
  // const [receivedPrescriptions, setReceivedPrescriptions] = useState(...)

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/prescription/my', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) setPrescriptions(await res.json());
      } catch (err) { console.error('Network error:', err); }
      finally { setLoading(false); }
    };
    fetchPrescriptions();
  }, [token]);

  const handleMarkReceived = async (prescription) => {
    if (!window.confirm('Mark this prescription as received? This will move it to your medical history.')) return;

    try {
      // ✅ Call new Prescription completion endpoint
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/prescription/complete/${prescription._id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        // Update local state to remove it immediately
        setPrescriptions(prev => prev.map(p =>
          p._id === prescription._id ? { ...p, status: 'Completed' } : p
        ));
        alert('Moved to Medical History');
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error('Error marking received:', err);
      alert('Network error');
    }
  };

  // ✅ Filter based on DB status
  const visiblePrescriptions = prescriptions.filter(p => p.status !== 'Completed');

  return (
    <div className="prescriptions-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

        .prescriptions-page {
          font-family: 'Outfit', sans-serif;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
          padding: 40px;
          animation: fadeIn 0.8s ease-out;
        }

        .container { max-width: 1100px; margin: 0 auto; }

        .back-link {
          color: #2d3748; text-decoration: none; margin-bottom: 25px;
          display: inline-flex; align-items: center; gap: 8px; font-weight: 600;
          padding: 12px 20px; background: rgba(255, 255, 255, 0.8);
          border-radius: 12px; backdrop-filter: blur(10px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: all 0.3s ease;
        }
        .back-link:hover { transform: translateX(-5px); background: #fff; box-shadow: 0 6px 20px rgba(0,0,0,0.1); }

        .header { text-align: center; margin-bottom: 50px; }
        .header h1 { 
          color: #2b6cb0; font-size: 2.8rem; font-weight: 700; margin: 0; 
          display: flex; align-items: center; justify-content: center; gap: 15px; 
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header p { color: #4a5568; font-size: 1.2rem; margin-top: 10px; font-weight: 500; }

        .grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 30px;
        }

        .presc-card {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 20px;
          padding: 0;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          border: 1px solid rgba(255, 255, 255, 0.4);
          transition: all 0.3s ease;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .presc-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.12); }

        .card-top {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .doctor-details h3 { font-size: 1.3rem; margin: 0; font-weight: 600; }
        .date-badge { 
          background: rgba(255,255,255,0.2); padding: 5px 12px; border-radius: 20px; 
          font-size: 0.85rem; display: flex; align-items: center; gap: 5px; backdrop-filter: blur(5px);
        }

        .card-body { padding: 25px; flex-grow: 1; }

        .med-list { list-style: none; padding: 0; margin: 0 0 20px 0; }
        .med-item {
          display: flex; align-items: center; gap: 15px;
          padding: 12px; margin-bottom: 10px; background: #f7fafc; 
          border-radius: 12px; border: 1px solid #edf2f7;
        }
        .med-icon { 
          background: #e2e8f0; color: #4a5568; width: 40px; height: 40px; 
          border-radius: 50%; display: flex; align-items: center; justify-content: center; 
        }
        .med-info { flex: 1; }
        .med-name { font-weight: 700; color: #2d3748; display: block; }
        .med-dose { font-size: 0.85rem; color: #718096; }

        .notes-box {
          background: #fff5f5; border-left: 4px solid #fc8181;
          padding: 15px; border-radius: 8px; font-size: 0.9rem; color: #c53030;
          margin-bottom: 25px; line-height: 1.5;
        }

        .card-footer {
          padding: 20px 25px;
          background: #f7fafc;
          border-top: 1px solid #edf2f7;
          text-align: right;
        }

        .action-btn {
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          color: white; border: none; padding: 12px 24px; border-radius: 30px;
          font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;
          transition: all 0.3s; box-shadow: 0 4px 15px rgba(72, 187, 120, 0.3);
          font-size: 0.95rem;
        }
        .action-btn:hover { 
          transform: translateY(-2px); 
          box-shadow: 0 8px 25px rgba(72, 187, 120, 0.4); 
          background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
        }

        .empty-state { 
          text-align: center; color: #718096; padding: 80px 20px; 
          background: rgba(255,255,255,0.8); border-radius: 20px; backdrop-filter: blur(10px);
        }
      `}</style>

      <div className="container">
        <Link to="/patient-dashboard" className="back-link">
          <ArrowBack fontSize="small" /> Back to Dashboard
        </Link>

        <div className="header">
          <h1><ReceiptLong fontSize="large" /> Active Prescriptions</h1>
          <p>Manage and track your ongoing medications</p>
        </div>

        {loading ? (
          <div className="empty-state">Loading your prescriptions...</div>
        ) : visiblePrescriptions.length > 0 ? (
          <div className="grid-container">
            {visiblePrescriptions.map((p) => (
              <div className="presc-card" key={p._id}>

                <div className="card-top">
                  <div className="doctor-details">
                    <h3>Dr. {p.doctorName}</h3>
                    <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>General Physician</span>
                  </div>
                  <div className="date-badge">
                    <Event fontSize="small" style={{ fontSize: '14px' }} />
                    {new Date(p.issuedAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="card-body">
                  <ul className="med-list">
                    {p.medicines.map((med, idx) => (
                      <li className="med-item" key={idx}>
                        <div className="med-icon"><Medication fontSize="small" /></div>
                        <div className="med-info">
                          <span className="med-name">{med.name}</span>
                          <span className="med-dose">{med.dosage} • {med.frequency} ({med.duration})</span>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {p.notes && (
                    <div className="notes-box">
                      <strong>Doctor's Note:</strong><br />
                      {p.notes}
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <button className="action-btn" onClick={() => handleMarkReceived(p)}>
                    <CheckCircle fontSize="small" /> Received & Complete
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <LocalPharmacy style={{ fontSize: '60px', marginBottom: '20px', color: '#cbd5e0' }} />
            <h2>No Active Prescriptions</h2>
            <p>You're all caught up! Check your history for past records.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prescriptions;