// src/components/Uploads.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowBack, CloudUpload, Delete, Description, InsertDriveFile } from '@mui/icons-material';

const Uploads = () => {
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [error, setError] = useState('');
  const [assignedDoctor, setAssignedDoctor] = useState(''); // Keep for fallback or unused? simpler to just use list
  const [activeAppointments, setActiveAppointments] = useState([]);
  const [selectedAptId, setSelectedAptId] = useState('');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRes = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/document/my', { headers: { 'Authorization': `Bearer ${token}` } });
        if (docRes.ok) setDocuments(await docRes.json());

        const aptRes = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/appointment/my', { headers: { 'Authorization': `Bearer ${token}` } });
        if (aptRes.ok) {
          const appointments = await aptRes.json();
          const booked = appointments.filter(a => a.status === 'Booked');
          setActiveAppointments(booked);
          if (booked.length > 0) {
            setSelectedAptId(booked[0]._id);
          }
        }
      } catch (err) { setError('Failed to load data'); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [token]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!description.trim()) return setError('Document name is required');
    if (!file) return setError('Please select a file');
    if (!selectedAptId) return setError('Please select a doctor/appointment');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    formData.append('appointmentId', selectedAptId);

    try {
      const res = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/document/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      const result = await res.json();
      if (res.ok) {
        setDocuments([result.document, ...documents]);
        setDescription(''); setFile(null); setUploadSuccess('Document uploaded!');
        setTimeout(() => setUploadSuccess(''), 3000); setError('');
      } else { setError(result.msg); }
    } catch (err) { setError('Network error'); }
  };


  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/document/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) { setDocuments(documents.filter(d => d._id !== id)); alert('Deleted'); }
      else alert('Failed');
    } catch (err) { alert('Network error'); }
  };

  return (
    <div className="uploads-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

        .uploads-page {
          font-family: 'Outfit', sans-serif;
          background: linear-gradient(135deg, #fdfbfd 0%, #f4f0fa 100%);
          min-height: 100vh;
          padding: 40px;
          // animation: fadeIn 0.5s ease-out; // Removed based on previous preference
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
        .header h1 { color: #2d3748; font-size: 2.2rem; font-weight: 700; margin: 0; display: flex; align-items: center; justify-content: center; gap: 15px; }

        .upload-card {
          background: white; border-radius: 20px; padding: 40px; margin-bottom: 40px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.05); border: 1px solid rgba(255,255,255,0.8);
        }

        .upload-area {
          border: 2px dashed #cbd5e0; border-radius: 16px; padding: 40px; text-align: center;
          background: #f8fafc; cursor: pointer; transition: all 0.2s; margin-top: 20px;
        }
        .upload-area:hover { border-color: #667eea; background: #fdfbfd; }

        .styled-input, .styled-select {
          width: 100%; padding: 12px 15px; border: 1px solid #cbd5e0; border-radius: 10px;
          margin-top: 8px; font-family: inherit; font-size: 1rem;
          box-sizing: border-box; /* Ensure padding doesnt break layout */
        }
        .upload-btn {
          margin-top: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white; border: none; padding: 12px 25px; border-radius: 10px; font-weight: 600;
          cursor: pointer; display: flex; align-items: center; gap: 10px; margin-left: auto;
        }

        .doc-list { display: flex; flex-direction: column; gap: 15px; }
        .doc-item {
          background: white; padding: 20px; border-radius: 16px; display: flex; justify-content: space-between; align-items: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid rgba(255,255,255,0.8);
          transition: transform 0.2s;
        }
        .doc-item:hover { transform: translateX(5px); box-shadow: 0 8px 25px rgba(118, 75, 162, 0.1); }

        .empty-state { text-align: center; color: #cbd5e0; padding: 50px; }
      `}</style>

      <div className="container">
        <Link to="/patient-dashboard" className="back-link"><ArrowBack fontSize="small" /> Dashboard</Link>

        <div className="header">
          <h1><CloudUpload fontSize="large" /> Medical Documents</h1>
          <p style={{ color: '#718096', marginTop: '10px' }}>Securely store and share your reports.</p>
        </div>

        {uploadSuccess && <div style={{ background: '#f0fff4', color: '#38a169', padding: '15px', borderRadius: '10px', marginBottom: '20px', textAlign: 'center' }}>{uploadSuccess}</div>}
        {error && <div style={{ background: '#fff5f5', color: '#e53e3e', padding: '15px', borderRadius: '10px', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}

        <div className="upload-card">

          <form onSubmit={handleUpload}>
            {activeAppointments.length > 0 ? (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: '600', color: '#4a5568' }}>Select Doctor / Appointment</label>
                <select
                  className="styled-select"
                  value={selectedAptId}
                  onChange={(e) => setSelectedAptId(e.target.value)}
                >
                  {activeAppointments.map(apt => (
                    <option key={apt._id} value={apt._id}>
                      Dr. {apt.doctorName} ({apt.date} at {apt.time})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div style={{ marginBottom: '20px', color: '#e53e3e', background: '#fff5f5', padding: '10px', borderRadius: '8px' }}>
                No active appointments found. You need a booked appointment to upload documents.
              </div>
            )}
            <label style={{ fontWeight: '600', color: '#4a5568' }}>Document Title</label>
            <input className="styled-input" placeholder="e.g. Blood Test Report" value={description} onChange={(e) => setDescription(e.target.value)} />

            <div className="upload-area" onClick={() => document.getElementById('fileInput').click()}>
              <CloudUpload style={{ fontSize: '40px', color: '#cbd5e0', marginBottom: '10px' }} />
              <p style={{ margin: 0, color: '#718096' }}>{file ? <strong>{file.name}</strong> : 'Click to select file'}</p>
            </div>
            <input id="fileInput" type="file" onChange={(e) => setFile(e.target.files[0])} style={{ display: 'none' }} />

            <button type="submit" className="upload-btn"><CloudUpload /> Upload</button>
          </form>
        </div>

        <div className="doc-list">
          <h2 style={{ color: '#2d3748', marginBottom: '15px' }}>Your Files</h2>
          {loading ? <p>Loading...</p> : documents.length > 0 ? (
            documents
              .filter(doc => !doc.appointmentId || (doc.appointmentId.status !== 'Completed' && doc.appointmentId.status !== 'History'))
              .map((doc) => (
                <div className="doc-item" key={doc._id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ background: '#e2e8f0', padding: '10px', borderRadius: '10px', color: '#4a5568' }}><InsertDriveFile /></div>
                    <div>
                      <h3 style={{ margin: '0 0 5px', fontSize: '1.1rem' }}>{doc.fileName}</h3>
                      <div style={{ fontSize: '0.85rem', color: '#718096' }}>{doc.description} • {new Date(doc.uploadedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <button style={{ background: '#fff5f5', color: '#e53e3e', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }} onClick={() => handleDelete(doc._id)}><Delete /></button>
                </div>
              ))
          ) : (
            <div className="empty-state">
              <Description style={{ fontSize: '50px', marginBottom: '10px' }} />
              <p>No documents found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Uploads;