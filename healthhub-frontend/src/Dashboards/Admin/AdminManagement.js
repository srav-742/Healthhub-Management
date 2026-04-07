// src/dashboards/admin/AdminManagement.js
import React, { useState } from 'react';
import axios from 'axios';
import { Add, Edit, Delete, Refresh, Save } from '@mui/icons-material';

const AdminManagement = () => {
  const [activeTab, setActiveTab] = useState('fetch');
  const [formData, setFormData] = useState({});
  const [admins, setAdmins] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // ... (Identical logic) ...
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
    if (!formData.adminId) return alert('Enter Admin ID');
    try {
      const res = await axios.get((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/admin/all');
      const admin = res.data.find(a => a.adminId === formData.adminId);
      if (!admin) return alert('Admin not found');
      setFormData(admin); setEditMode(true);
    } catch (err) { alert('Fetch failed'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'add') {
        await axios.post((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/admin/add', formData);
        alert('Admin added successfully!');
      } else if (activeTab === 'update' && editMode) {
        await axios.put((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/admin/update', formData);
        alert('Admin updated successfully!');
      }
      setFormData({}); setEditMode(false);
    } catch (err) { alert('Error: ' + (err.response?.data?.message || err.message)); }
  };

  const fetchAdmins = async () => {
    setFetchLoading(true);
    try {
      const res = await axios.get((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/admin/all');
      setAdmins(res.data);
    } catch (err) { alert('Fetch failed'); }
    finally { setFetchLoading(false); }
  };

  const deleteAdmin = async () => {
    if (!formData.adminId || !window.confirm(`Delete Admin ${formData.adminId}?`)) return;
    try {
      await axios.delete((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/admin/delete', { data: formData });
      alert('Admin deleted successfully!');
      setFormData({});
    } catch (err) { alert('Delete failed'); }
  };

  // Fetch on mount
  React.useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="management-view">
      <style>{`
        /* Removed fadeIn animation */
        .tabs-header { display: flex; gap: 10px; margin-bottom: 25px; background: white; padding: 10px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); width: fit-content; }
        .tab-btn { padding: 10px 20px; border-radius: 8px; border: none; background: transparent; color: #64748b; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .tab-btn:hover { background: #f1f5f9; color: #1e3c72; }
        .tab-btn.active { background: #1e3c72; color: #d4af37; box-shadow: 0 4px 10px rgba(30, 60, 114, 0.2); }
        .glass-panel { background: white; padding: 35px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.05); max-width: 900px; margin-bottom: 30px; }
        .section-title { margin-top: 0; color: #1e3c72; font-size: 1.5rem; margin-bottom: 25px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; }
        .input-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 20px; }
        .field-group label { display: block; margin-bottom: 8px; font-weight: 600; color: #4a5568; font-size: 0.9rem; }
        .styled-input { width: 100%; padding: 12px 15px; border: 1px solid #e2e8f0; border-radius: 10px; background: #f8fafc; transition: all 0.2s; box-sizing: border-box; }
        .styled-input:focus { outline: none; border-color: #1e3c72; background: white; box-shadow: 0 0 0 3px rgba(30, 60, 114, 0.1); }
        .btn-action { padding: 12px 30px; border-radius: 10px; border: none; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .btn-primary { background: linear-gradient(135deg, #1e3c72, #2a5298); color: white; }
        .btn-primary:hover { box-shadow: 0 5px 15px rgba(30, 60, 114, 0.3); transform: translateY(-2px); }
        .btn-danger { background: #fee2e2; color: #c53030; }
        .btn-danger:hover { background: #feb2b2; }
        .styled-table { width: 100%; border-collapse: collapse; border-radius: 12px; overflow: hidden; background: white; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
        .styled-table th { background: #1e3c72; color: white; padding: 15px; text-align: left; font-weight: 500; }
        .styled-table td { padding: 15px; border-bottom: 1px solid #f1f5f9; color: #4a5568; }
        .styled-table tr:hover { background: #f8fafc; }
      `}</style>

      <div className="tabs-header">
        <button className={`tab-btn ${activeTab === 'fetch' ? 'active' : ''}`} onClick={() => { setActiveTab('fetch'); fetchAdmins(); }}><Refresh fontSize="small" /> View Admins</button>
        <button className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`} onClick={() => { setActiveTab('add'); setFormData({}); }}><Add fontSize="small" /> Add Admin</button>
        <button className={`tab-btn ${activeTab === 'update' ? 'active' : ''}`} onClick={() => { setActiveTab('update'); setFormData({}); setEditMode(false); }}><Edit fontSize="small" /> Update</button>
        <button className={`tab-btn ${activeTab === 'delete' ? 'active' : ''}`} onClick={() => { setActiveTab('delete'); setFormData({}); }}><Delete fontSize="small" /> Delete</button>
      </div>

      {(activeTab === 'add' || (activeTab === 'update' && editMode)) && (
        <div className="glass-panel">
          <h3 className="section-title">{activeTab === 'add' ? 'Add New Admin' : 'Update Admin'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="input-grid">
              <div className="field-group"><label>Name</label><input className="styled-input" name="name" value={formData.name || ''} onChange={handleChange} required /></div>
              <div className="field-group"><label>Email</label><input className="styled-input" name="email" value={formData.email || ''} onChange={handleChange} required /></div>
              {activeTab === 'add' && <div className="field-group"><label>Password</label><input className="styled-input" name="password" type="password" onChange={handleChange} required /></div>}
            </div>

            <div className="input-grid">
              <div className="field-group"><label>Designation</label><select className="styled-input" name="designation" value={formData.designation || ''} onChange={handleChange}><option value="">Select</option><option>Senior Admin</option><option>Data Analyst</option></select></div>
              <div className="field-group"><label>Department</label><select className="styled-input" name="department" value={formData.department || ''} onChange={handleChange}><option value="">Select</option><option>IT</option><option>Administration</option></select></div>
              <div className="field-group"><label>Contact</label><input className="styled-input" name="contact" value={formData.contact || ''} onChange={handleChange} required /></div>
            </div>

            <div className="input-grid">
              <div className="field-group"><label>Date of Birth</label><input className="styled-input" name="dob" type="date" value={formData.dob || ''} onChange={handleChange} required /></div>
              <div className="field-group"><label>Blood Group</label><input className="styled-input" name="bloodGroup" value={formData.bloodGroup || ''} onChange={handleChange} /></div>
              <div className="field-group"><label>Emergency Contact</label><input className="styled-input" name="emergencyContact" value={formData.emergencyContact || ''} onChange={handleChange} required /></div>
            </div>

            <div className="input-grid">
              <div className="field-group"><label>Qualification</label><input className="styled-input" name="qualification" value={formData.qualification || ''} onChange={handleChange} required /></div>
              <div className="field-group"><label>Experience (Years)</label><input className="styled-input" name="experience" value={formData.experience || ''} onChange={handleChange} required /></div>
              <div className="field-group"><label>Prev. Experience</label><input className="styled-input" name="previousExperience" value={formData.previousExperience || ''} onChange={handleChange} /></div>
            </div>

            <div className="input-grid">
              <div className="field-group"><label>Joining Date</label><input className="styled-input" name="joiningDate" type="date" value={formData.joiningDate || ''} onChange={handleChange} required /></div>
              <div className="field-group"><label>Available Time</label><input className="styled-input" name="availableTime" placeholder="e.g. 9:00 AM - 5:00 PM" value={formData.availableTime || ''} onChange={handleChange} required /></div>
            </div>

            <div className="field-group" style={{ marginBottom: '20px' }}>
              <label>Address</label>
              <textarea className="styled-input" name="address" rows="3" value={formData.address || ''} onChange={handleChange} required style={{ resize: 'vertical' }} />
            </div>

            <div className="field-group" style={{ marginBottom: '20px' }}>
              <label>Available Days</label>
              <div className="checkbox-grid">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <label key={day} className="checkbox-label">
                    <input type="checkbox" value={day} checked={formData.availableDays?.includes(day)} onChange={handleChange} name="availableDays" /> {day}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-action btn-primary"><Save /> {activeTab === 'add' ? 'Register' : 'Save Changes'}</button>
          </form>
        </div>
      )}

      {activeTab === 'update' && !editMode && (
        <div className="glass-panel">
          <h3 className="section-title">Search Admin</h3>
          <div className="field-group" style={{ maxWidth: '400px', display: 'flex', gap: '10px' }}>
            <input className="styled-input" name="adminId" placeholder="e.g. ADM-101" value={formData.adminId || ''} onChange={handleChange} />
            <button className="btn-action btn-primary" onClick={handleFetchForUpdate}>Search</button>
          </div>
        </div>
      )}

      {activeTab === 'delete' && (
        <div className="glass-panel" style={{ maxWidth: '500px' }}>
          <h3 className="section-title" style={{ color: '#c53030' }}>Delete Admin</h3>
          <div className="field-group"><label>Admin ID</label><input className="styled-input" name="adminId" placeholder="e.g. ADM-101" onChange={handleChange} /></div>
          <button className="btn-action btn-danger" style={{ marginTop: '20px' }} onClick={deleteAdmin}><Delete /> Delete</button>
        </div>
      )}

      {activeTab === 'fetch' && (
        <div className="glass-panel" style={{ maxWidth: '100%' }}>
          <h3 className="section-title">Admin Directory</h3>
          {admins.length === 0 ? <p>No admins found.</p> : (
            <table className="styled-table">
              <thead><tr><th>ID</th><th>Name</th><th>Designation</th><th>Department</th><th>Email</th></tr></thead>
              <tbody>
                {admins.map(a => (
                  <tr key={a._id}><td><strong>{a.adminId}</strong></td><td>{a.name}</td><td>{a.designation}</td><td>{a.department}</td><td>{a.email}</td></tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminManagement;