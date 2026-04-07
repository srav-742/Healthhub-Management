// src/dashboards/admin/PatientManagement.js
import React, { useState } from 'react';
import axios from 'axios';
import { Search, Add, Edit, Delete, Refresh, Save, Close } from '@mui/icons-material';

const PatientManagement = () => {
  const [activeTab, setActiveTab] = useState('fetch');
  const [addData, setAddData] = useState({
    name: '', email: '', password: '', role: 'patient',
    address: '', medicalProblem: '', dob: '', age: '',
    gender: '', contact: '', bloodGroup: ''
  });
  const [deleteId, setDeleteId] = useState('');
  const [updateId, setUpdateId] = useState('');
  const [updateData, setUpdateData] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [patients, setPatients] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);

  // ... (Keep existing Helper Functions & Logic logic identical to preserve functionality) ...
  const calculateAge = (dob) => {
    if (!dob) return '';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handleDobChange = (e, isUpdate = false) => {
    const dob = e.target.value;
    const age = calculateAge(dob);
    if (isUpdate) setUpdateData(prev => ({ ...prev, dob, age }));
    else setAddData(prev => ({ ...prev, dob, age }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/auth/signup', { ...addData, role: 'patient' });
      await axios.post((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/patients', addData);
      alert('Patient added successfully!');
      setAddData({ name: '', email: '', password: '', role: 'patient', address: '', medicalProblem: '', dob: '', age: '', gender: '', contact: '', bloodGroup: '' });
    } catch (err) { alert('Error adding patient: ' + (err.response?.data?.msg || 'Network error')); }
  };

  const handleDelete = async () => {
    if (!deleteId || !window.confirm(`Delete patient ${deleteId}?`)) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/patients/${deleteId}`);
      alert('Patient deleted.');
      setDeleteId('');
    } catch (err) { alert('Delete failed'); }
  };

  const handleFetchToUpdate = async () => {
    if (!updateId) return alert('Enter ID');
    setLoadingUpdate(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/patients/id/${updateId}`);
      res.data ? setUpdateData(res.data) : alert('Patient not found');
    } catch (err) { alert('Patient not found'); }
    finally { setLoadingUpdate(false); }
  };

  const handleUpdateSubmit = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/patients/${updateId}`, updateData);
      alert('Patient updated!');
      setUpdateData(null); setUpdateId('');
    } catch (err) { alert('Update failed'); }
  };

  const fetchPatients = async () => {
    setFetchLoading(true);
    try {
      const res = await axios.get((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/patients');
      setPatients(res.data);
    } catch (err) { alert('Failed to fetch patients'); }
    finally { setFetchLoading(false); }
  };

  // Fetch on mount
  React.useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="management-view">
      <style>{`
        /* Removed fadeIn animation */


        /* Tabs */
        .tabs-header {
          display: flex;
          gap: 10px;
          margin-bottom: 25px;
          background: white;
          padding: 10px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.03);
          width: fit-content;
        }

        .tab-btn {
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: #64748b;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tab-btn:hover { background: #f1f5f9; color: #1e3c72; }
        .tab-btn.active { background: #1e3c72; color: #d4af37; box-shadow: 0 4px 10px rgba(30, 60, 114, 0.2); }

        /* Forms & Cards */
        .glass-panel {
          background: white;
          padding: 35px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          border: 1px solid rgba(0,0,0,0.05);
          max-width: 900px;
        }

        .section-title {
          margin-top: 0;
          color: #1e3c72;
          font-size: 1.5rem;
          margin-bottom: 25px;
          border-bottom: 2px solid #f1f5f9;
          padding-bottom: 10px;
        }

        .input-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .field-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #4a5568;
          font-size: 0.9rem;
        }

        .styled-input {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: #f8fafc;
          transition: all 0.2s;
          box-sizing: border-box;
        }
        .styled-input:focus {
          outline: none;
          border-color: #1e3c72;
          background: white;
          box-shadow: 0 0 0 3px rgba(30, 60, 114, 0.1);
        }

        .btn-action {
          padding: 12px 30px;
          border-radius: 10px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .btn-primary { background: linear-gradient(135deg, #1e3c72, #2a5298); color: white; }
        .btn-primary:hover { box-shadow: 0 5px 15px rgba(30, 60, 114, 0.3); transform: translateY(-2px); }
        .btn-danger { background: #fee2e2; color: #c53030; }
        .btn-danger:hover { background: #feb2b2; }

        /* Table */
        .styled-table {
          width: 100%;
          border-collapse: collapse;
          border-radius: 12px;
          overflow: hidden;
          background: white;
          box-shadow: 0 4px 15px rgba(0,0,0,0.03);
        }
        .styled-table th {
          background: #1e3c72;
          color: white;
          padding: 15px;
          text-align: left;
          font-weight: 500;
        }
        .styled-table td {
          padding: 15px;
          border-bottom: 1px solid #f1f5f9;
          color: #4a5568;
        }
        .styled-table tr:hover { background: #f8fafc; }
        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .tabs-header { width: 100%; overflow-x: auto; padding: 5px; }
          .tab-btn { padding: 8px 15px; font-size: 0.85rem; white-space: nowrap; }
          .glass-panel { padding: 20px; }
          .input-grid { grid-template-columns: 1fr; }
          .table-container { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .styled-table { min-width: 600px; }
        }
      `}</style>

      <div className="tabs-header">
        <button className={`tab-btn ${activeTab === 'fetch' ? 'active' : ''}`} onClick={() => { setActiveTab('fetch'); fetchPatients(); }}>
          <Refresh fontSize="small" /> View Patients
        </button>
        <button className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`} onClick={() => setActiveTab('add')}>
          <Add fontSize="small" /> Add New
        </button>
        <button className={`tab-btn ${activeTab === 'update' ? 'active' : ''}`} onClick={() => { setActiveTab('update'); setUpdateData(null); }}>
          <Edit fontSize="small" /> Update
        </button>
        <button className={`tab-btn ${activeTab === 'delete' ? 'active' : ''}`} onClick={() => setActiveTab('delete')}>
          <Delete fontSize="small" /> Delete
        </button>
      </div>

      {activeTab === 'add' && (
        <div className="glass-panel">
          <h3 className="section-title">New Patient Registration</h3>
          <form onSubmit={handleAddSubmit}>
            <div className="input-grid">
              <div className="field-group"><label>Full Name</label><input className="styled-input" value={addData.name} onChange={(e) => setAddData({ ...addData, name: e.target.value })} required /></div>
              <div className="field-group"><label>Email</label><input className="styled-input" type="email" value={addData.email} onChange={(e) => setAddData({ ...addData, email: e.target.value })} required /></div>
              <div className="field-group"><label>Password</label><input className="styled-input" type="password" value={addData.password} onChange={(e) => setAddData({ ...addData, password: e.target.value })} required /></div>
              <div className="field-group"><label>Date of Birth</label><input className="styled-input" type="date" value={addData.dob} onChange={handleDobChange} required /></div>
            </div>

            <div className="input-grid">
              <div className="field-group"><label>Gender</label><select className="styled-input" value={addData.gender} onChange={(e) => setAddData({ ...addData, gender: e.target.value })}><option value="">Select</option><option>Male</option><option>Female</option></select></div>
              <div className="field-group"><label>Contact</label><input className="styled-input" value={addData.contact} onChange={(e) => setAddData({ ...addData, contact: e.target.value })} required /></div>
              <div className="field-group"><label>Blood Group</label><select className="styled-input" value={addData.bloodGroup} onChange={(e) => setAddData({ ...addData, bloodGroup: e.target.value })}><option value="">Select</option><option>A+</option><option>O+</option><option>B+</option><option>AB+</option></select></div>
            </div>

            <div className="field-group" style={{ marginBottom: '20px' }}><label>Address</label><input className="styled-input" value={addData.address} onChange={(e) => setAddData({ ...addData, address: e.target.value })} required /></div>
            <div className="field-group" style={{ marginBottom: '30px' }}><label>Medical History/Complaint</label><input className="styled-input" value={addData.medicalProblem} onChange={(e) => setAddData({ ...addData, medicalProblem: e.target.value })} required /></div>

            <button type="submit" className="btn-action btn-primary"><Save /> Register Patient</button>
          </form>
        </div>
      )}

      {activeTab === 'update' && (
        <div className="glass-panel">
          <h3 className="section-title">Update Patient</h3>
          {!updateData ? (
            <div className="field-group" style={{ maxWidth: '400px' }}>
              <label>Enter Patient ID</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input className="styled-input" value={updateId} onChange={(e) => setUpdateId(e.target.value)} placeholder="e.g. PT-1002" />
                <button className="btn-action btn-primary" onClick={handleFetchToUpdate}>{loadingUpdate ? '...' : 'Search'}</button>
              </div>
            </div>
          ) : (
            <div className="update-form">
              <div className="input-grid">
                <div className="field-group"><label>Name</label><input className="styled-input" value={updateData.name} onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })} /></div>
                <div className="field-group"><label>Email</label><input className="styled-input" value={updateData.email} onChange={(e) => setUpdateData({ ...updateData, email: e.target.value })} /></div>
                <div className="field-group"><label>Medical Issue</label><input className="styled-input" value={updateData.medicalProblem} onChange={(e) => setUpdateData({ ...updateData, medicalProblem: e.target.value })} /></div>
              </div>
              <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                <button className="btn-action btn-primary" onClick={handleUpdateSubmit}>Save Changes</button>
                <button className="btn-action btn-danger" onClick={() => { setUpdateData(null); setUpdateId(''); }}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'delete' && (
        <div className="glass-panel" style={{ maxWidth: '500px' }}>
          <h3 className="section-title" style={{ color: '#c53030', borderColor: '#c53030' }}>Delete Record</h3>
          <p style={{ marginBottom: '20px', color: '#718096' }}>Permanently remove a patient record from the database.</p>
          <div className="field-group">
            <label>Patient ID</label>
            <input className="styled-input" value={deleteId} onChange={(e) => setDeleteId(e.target.value)} placeholder="e.g. PT-1005" />
          </div>
          <button className="btn-action btn-danger" style={{ marginTop: '20px' }} onClick={handleDelete}><Delete /> Delete Patient</button>
        </div>
      )}

      {activeTab === 'fetch' && (
        <div className="glass-panel" style={{ maxWidth: '100%' }}>
          <h3 className="section-title">Patient Directory</h3>
          {fetchLoading ? <p>Loading...</p> : patients.length === 0 ? <p>No records found.</p> : (
            <div className="table-container">
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Medical Issue</th>
                    <th>Gender/Age</th>
                    <th>Blood Group</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map(p => (
                    <tr key={p._id}>
                      <td><strong>{p.patientId}</strong></td>
                      <td>{p.name}</td>
                      <td>{p.contact}</td>
                      <td>{p.medicalProblem}</td>
                      <td>{p.gender} ({p.age})</td>
                      <td><span style={{ background: '#c6f6d5', color: '#22543d', padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>{p.bloodGroup}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientManagement;