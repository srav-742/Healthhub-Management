import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { ArrowBack, Search, Folder, CloudDownload, Description } from '@mui/icons-material';

const UploadedFiles = () => {
  const location = useLocation();
  // Using patientId for the API, patientName for display
  const [targetId, setTargetId] = useState(location.state?.patientId || '');
  const [targetName, setTargetName] = useState(location.state?.patientName || '');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (location.state?.patientId) {
      handleAutoSearch(location.state.patientId);
    }
  }, [location.state]);

  const handleAutoSearch = async (pid) => {
    setLoading(true); setSearched(true);
    const token = localStorage.getItem('authToken');
    try {
      // ✅ Correct Endpoint for Doctors
      const res = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/doctor/patient/${pid}/documents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!targetId.trim()) return;
    handleAutoSearch(targetId);
  };

  const handleDownload = (filename) => {
    // Placeholder for download logic - usually requires a proper backend static serve or blob response
    window.open(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${filename}`, '_blank');
  };

  return (
    <div className="files-page">
      <style>{`
         @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
         .files-page { font-family: 'Outfit', sans-serif; background: #f2f7fb; min-height: 100vh; padding: 40px; }
         .container { max-width: 900px; margin: 0 auto; }
         .back-link { color: #1a237e; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; font-weight: 600; margin-bottom: 30px; background: white; padding: 10px 15px; border-radius: 12px; }
         
         .search-card { background: white; padding: 30px; border-radius: 20px; box-shadow: 0 5px 20px rgba(0,0,0,0.03); text-align: center; margin-bottom: 40px; }
         .search-bar { display: flex; gap: 10px; max-width: 500px; margin: 20px auto 0; }
         .styled-input { flex: 1; padding: 12px; border-radius: 10px; border: 1px solid #cfd8dc; font-family: inherit; }
         .btn-search { background: #1a237e; color: white; border: none; padding: 0 20px; border-radius: 10px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 8px; }

         .file-list { display: flex; flex-direction: column; gap: 15px; }
         .file-item { background: white; padding: 20px; border-radius: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e1e8ed; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
         .file-info h3 { margin: 0 0 5px; color: #37474f; font-size: 1.1rem; }
         .file-meta { color: #78909c; font-size: 0.9rem; }
         .btn-dl { color: #00acc1; background: #e0f7fa; border: none; padding: 8px 15px; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 5px; }
         .btn-dl:hover { background: #b2ebf2; }
         
         .empty-state { text-align: center; padding: 50px; color: #b0bec5; }
      `}</style>

      <div className="container">
        <Link to="/doctor-dashboard" className="back-link"><ArrowBack fontSize="small" /> Dashboard</Link>

        <div className="search-card">
          <h1 style={{ color: '#1a237e', margin: 0 }}><Folder fontSize="large" /> Patient Files</h1>

          {location.state?.patientId ? (
            <div style={{ marginTop: '20px' }}>
              <h2 style={{ color: '#37474f', margin: '0 0 10px' }}>
                {location.state.patientName} <span style={{ fontSize: '0.8em', color: '#78909c' }}>({location.state.patientId})</span>
              </h2>
              <p style={{ color: '#607d8b' }}>Viewing uploaded medical records.</p>
            </div>
          ) : (
            <>
              <p style={{ color: '#607d8b' }}>Search for a patient to view uploaded documents.</p>
              <form className="search-bar" onSubmit={handleSearch}>
                <input className="styled-input" placeholder="Patient ID (e.g. PT-1)" value={targetId} onChange={(e) => setTargetId(e.target.value)} required />
                <button type="submit" className="btn-search"><Search fontSize="small" /> Search</button>
              </form>
            </>
          )}
        </div>

        {loading ? <p style={{ textAlign: 'center' }}>Searching...</p> : documents.length > 0 ? (
          <div className="file-list">
            {documents.map(doc => (
              <div className="file-item" key={doc._id}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <Description style={{ color: '#1a237e', fontSize: '40px', opacity: 0.8 }} />
                  <div className="file-info">
                    <h3>{doc.description || doc.fileName}</h3>
                    <div className="file-meta">Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <button className="btn-dl" onClick={() => handleDownload(doc.fileName)}>
                  <CloudDownload fontSize="small" /> Download
                </button>
              </div>
            ))}
          </div>
        ) : searched ? (
          <div className="empty-state">
            <Folder style={{ fontSize: '60px', marginBottom: '10px' }} />
            <p>No documents found for this patient.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default UploadedFiles;