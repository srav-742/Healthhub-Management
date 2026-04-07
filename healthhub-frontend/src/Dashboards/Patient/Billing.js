// src/Dashboards/Patient/Billing.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowBack, Receipt, CreditCard, CheckCircle, Warning, AccountBalanceWallet } from '@mui/icons-material';

const Billing = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/billing/appointments', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) setAppointments(await res.json());
      } catch (err) { console.error('Fetch error:', err); }
      finally { setLoading(false); }
    };
    fetchAppointments();
  }, [token]);

  const handlePayment = async (apt) => {
    if (!window.confirm(`Pay ₹${apt.consultationFee} for Dr. ${apt.doctorName}?`)) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/billing/pay/${apt._id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const updated = await res.json();
        setAppointments(appointments.map(a => a._id === apt._id ? updated : a));
        alert('Payment successful!');
      } else { alert('Payment failed'); }
    } catch (err) { alert('Network error'); }
  };

  const totalDue = appointments
    .filter(a => a.billingStatus !== 'Paid' && a.status !== 'Cancelled')
    .reduce((sum, a) => sum + a.consultationFee, 0);

  return (
    <div className="billing-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

        .billing-page {
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

        .header-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 24px; padding: 40px; color: white;
          box-shadow: 0 15px 30px rgba(118, 75, 162, 0.25);
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 40px; position: relative; overflow: hidden;
        }
        .header-card::after {
          content: ''; position: absolute; top: 0; right: 0; bottom: 0; left: 0;
          background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==');
          opacity: 0.3;
        }
        
        .header-info h1 { margin: 0; font-size: 2.2rem; display: flex; align-items: center; gap: 15px; }
        .header-info p { opacity: 0.9; margin: 5px 0 0; font-size: 1.1rem; }

        .total-box {
          background: rgba(255,255,255,0.2); backdrop-filter: blur(10px);
          padding: 15px 25px; border-radius: 16px; text-align: right;
          border: 1px solid rgba(255,255,255,0.3);
        }
        .total-box label { font-size: 0.9rem; display: block; opacity: 0.9; margin-bottom: 5px; }
        .total-box span { font-size: 1.8rem; font-weight: 700; }

        .bill-list { display: flex; flex-direction: column; gap: 20px; }

        .bill-card {
          background: white; border-radius: 20px; padding: 25px; display: flex;
          justify-content: space-between; align-items: center;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid rgba(255,255,255,0.8);
          transition: all 0.3s ease;
        }
        .bill-card:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(118, 75, 162, 0.1); border-color: #d4c4e8; }

        .bill-details h3 { margin: 0 0 5px; color: #2d3748; font-size: 1.25rem; }
        .bill-details p { margin: 0; color: #718096; font-size: 0.95rem; display: flex; align-items: center; gap: 8px; }
        
        .status-pill {
          padding: 6px 14px; border-radius: 30px; font-size: 0.85rem; font-weight: 600;
          display: inline-flex; align-items: center; gap: 6px; margin-top: 10px;
        }
        .status-pill.pending { background: #fffaf0; color: #c05621; border: 1px solid #fbd38d; }
        .status-pill.paid { background: #f0fff4; color: #2f855a; border: 1px solid #9ae6b4; }
        .status-pill.cancelled { background: #fff5f5; color: #c53030; border: 1px solid #feb2b2; }

        .action-area { text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 10px; }
        .fee-display { font-size: 1.4rem; font-weight: 700; color: #2d3748; }

        .pay-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white; border: none; padding: 10px 20px; border-radius: 12px;
          cursor: pointer; font-weight: 600; font-size: 0.95rem;
          display: inline-flex; align-items: center; gap: 8px;
          transition: all 0.3s; box-shadow: 0 4px 15px rgba(118, 75, 162, 0.2);
        }
        .pay-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(118, 75, 162, 0.35); }
        .pay-btn:disabled { background: #cbd5e0; cursor: not-allowed; box-shadow: none; color: #718096; }

        .empty-state { text-align: center; color: #a0aec0; margin-top: 60px; font-size: 1.1rem; }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      <div className="container">
        <Link to="/patient-dashboard" className="back-link"><ArrowBack fontSize="small" /> Dashboard</Link>

        <div className="header-card">
          <div className="header-info">
            <h1><AccountBalanceWallet fontSize="large" /> Billing & Payments</h1>
            <p>Manage your medical invoices securely.</p>
          </div>
          <div className="total-box">
            <label>Outstanding Amount</label>
            <span>₹{totalDue.toLocaleString()}</span>
          </div>
        </div>

        {loading ? <div className="empty-state">Loading invoices...</div> : appointments.length > 0 ? (
          <div className="bill-list">
            {appointments.map((apt) => (
              <div className="bill-card" key={apt._id}>
                <div className="bill-details">
                  <h3>Dr. {apt.doctorName}</h3>
                  <p><Receipt fontSize="small" style={{ opacity: 0.7 }} /> Invoice for {new Date(apt.date).toLocaleDateString()}</p>
                  <span className={`status-pill ${apt.status === 'Cancelled' ? 'cancelled' : apt.billingStatus?.toLowerCase() || 'pending'}`}>
                    {apt.status === 'Cancelled' ? <Warning fontSize="inherit" /> : apt.billingStatus === 'Paid' ? <CheckCircle fontSize="inherit" /> : <Warning fontSize="inherit" />}
                    {apt.status === 'Cancelled' ? 'Cancelled' : apt.billingStatus || 'Pending'}
                  </span>
                </div>
                <div className="action-area">
                  <div className="fee-display">₹{apt.consultationFee}</div>
                  <button className="pay-btn" disabled={apt.billingStatus === 'Paid' || apt.status === 'Cancelled'} onClick={() => handlePayment(apt)}>
                    <CreditCard fontSize="small" /> {apt.billingStatus === 'Paid' ? 'Paid' : 'Pay Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state"><p>No billing records found.</p></div>
        )}
      </div>
    </div>
  );
};

export default Billing;