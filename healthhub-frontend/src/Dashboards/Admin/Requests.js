// src/dashboards/admin/Requests.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, Cancel, Person, MedicalServices, AdminPanelSettings } from '@mui/icons-material';

const Requests = () => {
  const [activeTab, setActiveTab] = useState('doctors');
  const [doctorRequests, setDoctorRequests] = useState([]);
  const [staffRequests, setStaffRequests] = useState([]);
  const [adminRequests, setAdminRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initial Fetch
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const config = {
          headers: { 'x-auth-token': token }
        };

        const [docs, staff, admins] = await Promise.all([
          axios.get((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/doctor/requests/pending', config).catch(err => {
            console.error('Doctor requests fetch failed:', err);
            return { data: [] };
          }),
          axios.get((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/staff/requests/pending', config).catch(err => {
            console.error('Staff requests fetch failed:', err);
            return { data: [] };
          }),
          axios.get((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/admin/requests/pending', config).catch(err => {
            console.error('Admin requests fetch failed:', err);
            return { data: [] };
          })
        ]);
        setDoctorRequests(docs.data);
        setStaffRequests(staff.data);
        setAdminRequests(admins.data);
      } catch (err) {
        console.error('Error fetching requests', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleApprove = async (type, id) => {
    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: { 'x-auth-token': token }
      };
      await axios.put(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/${type}/requests/approve/${id}`, {}, config);
      alert('Approved successfully!');
      // Update local state
      if (type === 'doctor') setDoctorRequests(prev => prev.filter(r => r._id !== id));
      if (type === 'staff') setStaffRequests(prev => prev.filter(r => r._id !== id));
      if (type === 'admin') setAdminRequests(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      alert('Approval failed');
    }
  };

  const handleReject = async (type, id, email) => {
    if (!window.confirm('Reject this request?')) return;
    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: { 'x-auth-token': token },
        data: { email }
      };
      // Note: axios.delete second argument is config, data goes inside config
      await axios.delete(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/${type}/requests/reject/${id}`, config);
      alert('Rejected successfully.');
      if (type === 'doctor') setDoctorRequests(prev => prev.filter(r => r._id !== id));
      if (type === 'staff') setStaffRequests(prev => prev.filter(r => r._id !== id));
      if (type === 'admin') setAdminRequests(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      alert('Rejection failed');
    }
  };

  const requestsMap = {
    doctors: { data: doctorRequests, type: 'doctor', icon: <MedicalServices />, label: 'Doctors' },
    staff: { data: staffRequests, type: 'staff', icon: <Person />, label: 'Staff' },
    admins: { data: adminRequests, type: 'admin', icon: <AdminPanelSettings />, label: 'Admins' },
  };

  const activeData = requestsMap[activeTab];

  return (
    <div className="requests-container">
      <style>{`
        .requests-container { animation: fadeIn 0.4s ease-out; }
        
        .tabs-nav {
          display: flex;
          gap: 15px;
          margin-bottom: 30px;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 2px;
        }

        .tab-btn {
          background: none;
          border: none;
          padding: 12px 25px;
          font-size: 1rem;
          font-weight: 600;
          color: #718096;
          cursor: pointer;
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
          border-bottom: 3px solid transparent;
          margin-bottom: -4px;
        }

        .tab-btn:hover { color: #1e3c72; }
        
        .tab-btn.active {
          color: #1e3c72;
          border-bottom-color: #d4af37;
        }

        .count-badge {
          background: #e53e3e;
          color: white;
          font-size: 0.75rem;
          padding: 2px 8px;
          border-radius: 12px;
          min-width: 20px;
          text-align: center;
        }

        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 25px;
        }

        .req-card {
          background: white;
          border-radius: 16px;
          padding: 25px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.03);
          border: 1px solid rgba(0,0,0,0.05);
          transition: transform 0.2s;
          position: relative;
          overflow: hidden;
        }
        .req-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.08);
        }
        .req-card::top {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 4px;
          background: linear-gradient(90deg, #1e3c72, #d4af37);
        }

        .req-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .avatar-placeholder {
          width: 50px; height: 50px;
          background: #f0f4f8;
          color: #1e3c72;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.2rem;
        }

        .req-info h4 { margin: 0; color: #2d3748; font-size: 1.1rem; }
        .req-info p { margin: 2px 0 0; color: #718096; font-size: 0.9rem; }

        .req-details {
          background: #f8fafc;
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 20px;
          font-size: 0.9rem;
          color: #4a5568;
        }
        .detail-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .detail-row:last-child { margin-bottom: 0; }
        .detail-label { font-weight: 600; color: #718096; }

        .actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .btn-action {
          border: none;
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .btn-approve { background: #def7ec; color: #03543f; }
        .btn-approve:hover { background: #bcf0da; }
        
        .btn-reject { background: #fde8e8; color: #9b1c1c; }
        .btn-reject:hover { background: #fbd5d5; }

        .empty-state {
          text-align: center;
          padding: 60px;
          background: white;
          border-radius: 20px;
          color: #a0aec0;
        }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 768px) {
          .tabs-nav { overflow-x: auto; white-space: nowrap; padding-bottom: 5px; }
          .tab-btn { padding: 10px 15px; font-size: 0.9rem; }
          .card-grid { grid-template-columns: 1fr; gap: 15px; }
          .req-card { padding: 20px; }
          .actions { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="tabs-nav">
        {Object.keys(requestsMap).map(key => (
          <button
            key={key}
            className={`tab-btn ${activeTab === key ? 'active' : ''}`}
            onClick={() => setActiveTab(key)}
          >
            {requestsMap[key].icon}
            {requestsMap[key].label}
            {requestsMap[key].data.length > 0 && <span className="count-badge">{requestsMap[key].data.length}</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="empty-state">Loading pending requests...</div>
      ) : activeData.data.length === 0 ? (
        <div className="empty-state">
          <h3>No pending requests</h3>
          <p>You're all caught up! No new {activeData.label.toLowerCase()} waiting for approval.</p>
        </div>
      ) : (
        <div className="card-grid">
          {activeData.data.map(req => (
            <div className="req-card" key={req._id}>
              <div className="req-header">
                <div className="avatar-placeholder">{req.name.charAt(0)}</div>
                <div className="req-info">
                  <h4>{req.name}</h4>
                  <p>{req.email}</p>
                </div>
              </div>

              <div className="req-details">
                {activeTab === 'doctors' && (
                  <div className="detail-row">
                    <span className="detail-label">Specialization</span>
                    <span>{req.specialization || 'N/A'}</span>
                  </div>
                )}
                {activeTab === 'staff' && (
                  <>
                    <div className="detail-row">
                      <span className="detail-label">Designation</span>
                      <span>{req.designation}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Department</span>
                      <span>{req.department}</span>
                    </div>
                  </>
                )}
                {activeTab === 'admins' && (
                  <div className="detail-row">
                    <span className="detail-label">Role</span>
                    <span>{req.designation || 'Admin'}</span>
                  </div>
                )}
              </div>

              <div className="actions">
                <button className="btn-action btn-reject" onClick={() => handleReject(activeData.type, req._id, req.email)}>
                  <Cancel fontSize="small" /> Reject
                </button>
                <button className="btn-action btn-approve" onClick={() => handleApprove(activeData.type, req._id)}>
                  <CheckCircle fontSize="small" /> Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Requests;