// src/dashboards/admin/DoctorManagement.js
import React, { useState } from 'react';
import axios from 'axios';
import { Search, Add, Edit, Delete, Refresh, Save, Close, MedicalServices } from '@mui/icons-material';

const DoctorManagement = () => {
  const [activeTab, setActiveTab] = useState('fetch');
  const [formData, setFormData] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // ... (Identical logic to preserve functionality) ...
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        availableDays: checked ? [...(prev.availableDays || []), value] : (prev.availableDays || []).filter(day => day !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFetchForUpdate = async () => {
    if (!formData.doctorId) return alert('Enter Doctor ID');
    try {
      const res = await axios.get((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/doctor/all');
      const doctor = res.data.find(d => d.doctorId === formData.doctorId);
      if (!doctor) return alert('Doctor not found');
      setFormData(doctor);
      setEditMode(true);
    } catch (err) { alert('Failed to fetch doctor'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'add') {
        await axios.post((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/doctor/add', formData);
        alert('Doctor added successfully!');
      } else if (activeTab === 'update' && editMode) {
        await axios.put((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/doctor/update', formData);
        alert('Doctor updated successfully!');
      }
      setFormData({}); setEditMode(false);
    } catch (err) { alert('Error: ' + (err.response?.data?.message || err.message)); }
  };

  const fetchDoctors = async () => {
    setFetchLoading(true);
    try {
      const res = await axios.get((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/doctor/all');
      setDoctors(res.data);
    } catch (err) { alert('Failed to fetch doctors'); }
    finally { setFetchLoading(false); }
  };

  const deleteDoctor = async () => {
    if (!formData.doctorId || !window.confirm(`Delete Doctor ${formData.doctorId}?`)) return;
    try {
      await axios.delete((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/doctor/delete', { data: formData });
      alert('Doctor deleted successfully!');
      setFormData({});
    } catch (err) { alert('Delete failed'); }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Fetch on mount
  React.useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <div className="management-view">
      <style>{`
        /* Removed fadeIn animation for direct viewing */
        
        .tabs-header {
          display: flex; gap: 10px; margin-bottom: 25px;
          background: white; padding: 10px; border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.03); width: fit-content;
        }

        .tab-btn {
          padding: 10px 20px; border-radius: 8px; border: none;
          background: transparent; color: #64748b; font-weight: 600;
          cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 8px;
        }

        .tab-btn:hover { background: #f1f5f9; color: #1e3c72; }
        .tab-btn.active { background: #1e3c72; color: #d4af37; box-shadow: 0 4px 10px rgba(30, 60, 114, 0.2); }

        .glass-panel {
          background: white; padding: 35px; border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.05);
          max-width: 900px; margin-bottom: 30px;
        }

        .section-title {
          margin-top: 0; color: #1e3c72; font-size: 1.5rem; margin-bottom: 25px;
          border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;
        }

        .input-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px; margin-bottom: 20px;
        }

        .field-group label { display: block; margin-bottom: 8px; font-weight: 600; color: #4a5568; font-size: 0.9rem; }
        
        .styled-input {
          width: 100%; padding: 12px 15px; border: 1px solid #e2e8f0;
          border-radius: 10px; background: #f8fafc; transition: all 0.2s; box-sizing: border-box;
        }
        .styled-input:focus { outline: none; border-color: #1e3c72; background: white; box-shadow: 0 0 0 3px rgba(30, 60, 114, 0.1); }

        .checkbox-grid {
          display: flex; flex-wrap: wrap; gap: 10px; background: #f8fafc;
          padding: 15px; border-radius: 10px; border: 1px solid #e2e8f0;
        }
        .checkbox-label { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; cursor: pointer; padding: 5px 10px; background: white; border-radius: 6px; border: 1px solid #e2e8f0; }
        .checkbox-label input { width: auto; margin: 0; }

        .btn-action {
          padding: 12px 30px; border-radius: 10px; border: none; font-weight: 600;
          cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 8px;
        }
        .btn-primary { background: linear-gradient(135deg, #1e3c72, #2a5298); color: white; }
        .btn-primary:hover { box-shadow: 0 5px 15px rgba(30, 60, 114, 0.3); transform: translateY(-2px); }
        .btn-danger { background: #fee2e2; color: #c53030; }
        .btn-danger:hover { background: #feb2b2; }

        .styled-table {
          width: 100%; border-collapse: collapse; border-radius: 12px;
          overflow: hidden; background: white; box-shadow: 0 4px 15px rgba(0,0,0,0.03);
        }
        .styled-table th { background: #1e3c72; color: white; padding: 15px; text-align: left; font-weight: 500; }
        .styled-table td { padding: 15px; border-bottom: 1px solid #f1f5f9; color: #4a5568; }
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
        <button className={`tab-btn ${activeTab === 'fetch' ? 'active' : ''}`} onClick={() => { setActiveTab('fetch'); fetchDoctors(); }}><Refresh fontSize="small" /> View Doctors</button>
        <button className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`} onClick={() => { setActiveTab('add'); setFormData({}); }}><Add fontSize="small" /> Add Doctor</button>
        <button className={`tab-btn ${activeTab === 'update' ? 'active' : ''}`} onClick={() => { setActiveTab('update'); setFormData({}); setEditMode(false); }}><Edit fontSize="small" /> Update</button>
        <button className={`tab-btn ${activeTab === 'delete' ? 'active' : ''}`} onClick={() => { setActiveTab('delete'); setFormData({}); }}><Delete fontSize="small" /> Delete</button>
      </div>

      {(activeTab === 'add' || (activeTab === 'update' && editMode)) && (
        <div className="glass-panel">
          <h3 className="section-title">{activeTab === 'add' ? 'Register New Doctor' : 'Update Doctor Details'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="input-grid">
              <div className="field-group"><label>Full Name</label><input className="styled-input" name="name" value={formData.name || ''} onChange={handleChange} required /></div>
              <div className="field-group"><label>Email</label><input className="styled-input" name="email" value={formData.email || ''} onChange={handleChange} required /></div>
              {activeTab === 'add' && <div className="field-group"><label>Password</label><input className="styled-input" name="password" type="password" onChange={handleChange} required /></div>}
            </div>

            <div className="input-grid">
              <div className="field-group"><label>Date of Birth</label><input className="styled-input" name="dob" type="date" value={formData.dob || ''} onChange={handleChange} required /></div>
              <div className="field-group"><label>Gender</label>
                <select className="styled-input" name="gender" value={formData.gender || ''} onChange={handleChange} required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="field-group"><label>Phone</label><input className="styled-input" name="phone" value={formData.phone || ''} onChange={handleChange} required /></div>
            </div>

            <div className="input-grid">
              <div className="field-group"><label>Qualification</label><input className="styled-input" name="qualification" value={formData.qualification || ''} onChange={handleChange} required /></div>
              <div className="field-group"><label>Specialization</label><input className="styled-input" name="specialization" value={formData.specialization || ''} onChange={handleChange} required /></div>
              <div className="field-group"><label>Experience (Years)</label><input className="styled-input" name="experience" value={formData.experience || ''} onChange={handleChange} required /></div>
            </div>

            <div className="input-grid">
              <div className="field-group"><label>Available Time</label><input className="styled-input" name="availableTime" placeholder="e.g. 9:00 AM - 5:00 PM" value={formData.availableTime || ''} onChange={handleChange} required /></div>
              <div className="field-group"><label>Consultation Fee (₹)</label><input className="styled-input" name="consultationFee" value={formData.consultationFee || ''} onChange={handleChange} required /></div>
            </div>

            <div className="field-group" style={{ marginBottom: '20px' }}>
              <label>Clinic/Hospital Address</label>
              <textarea className="styled-input" name="address" rows="3" value={formData.address || ''} onChange={handleChange} required style={{ resize: 'vertical' }} />
            </div>

            <div className="field-group" style={{ marginBottom: '20px' }}>
              <label>Available Days</label>
              <div className="checkbox-grid">
                {days.map(day => (
                  <label key={day} className="checkbox-label">
                    <input type="checkbox" value={day} checked={formData.availableDays?.includes(day)} onChange={handleChange} name="availableDays" /> {day}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-action btn-primary"><Save /> {activeTab === 'add' ? 'Register Doctor' : 'Save Changes'}</button>
          </form>
        </div>
      )}

      {activeTab === 'update' && !editMode && (
        <div className="glass-panel">
          <h3 className="section-title">Find Doctor to Update</h3>
          <div className="field-group" style={{ maxWidth: '400px', display: 'flex', gap: '10px' }}>
            <input className="styled-input" name="doctorId" placeholder="e.g. DOC-001" value={formData.doctorId || ''} onChange={handleChange} />
            <button className="btn-action btn-primary" onClick={handleFetchForUpdate}>Search</button>
          </div>
        </div>
      )}

      {activeTab === 'delete' && (
        <div className="glass-panel" style={{ maxWidth: '500px' }}>
          <h3 className="section-title" style={{ color: '#c53030', borderColor: '#c53030' }}>Remove Doctor</h3>
          <div className="field-group"><label>Doctor ID</label><input className="styled-input" name="doctorId" placeholder="e.g. DOC-001" onChange={handleChange} /></div>
          <button className="btn-action btn-danger" style={{ marginTop: '20px' }} onClick={deleteDoctor}><Delete /> Delete Doctor</button>
        </div>
      )}

      {activeTab === 'fetch' && (
        <div className="glass-panel" style={{ maxWidth: '100%' }}>
          <h3 className="section-title">Doctors List</h3>
          {doctors.length === 0 ? <p>No doctors found.</p> : (
            <div className="table-container">
              <table className="styled-table">
                <thead><tr><th>ID</th><th>Name</th><th>Specialization</th><th>Experience</th><th>Fee</th></tr></thead>
                <tbody>
                  {doctors.map(d => (
                    <tr key={d._id}><td><strong>{d.doctorId}</strong></td><td>{d.name}</td><td>{d.specialization}</td><td>{d.experience} Yrs</td><td>₹{d.consultationFee}</td></tr>
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

export default DoctorManagement;