// src/Dashboards/Doctor/AddPrescription.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom'; // ✅ Import useLocation
import { ArrowBack, NoteAdd, Add, Delete, Save } from '@mui/icons-material';

const AddPrescription = () => {
  const location = useLocation();
  const { appointmentId, patientName } = location.state || {}; // Get context from navigation

  const [medicines, setMedicines] = useState([{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMedicineChange = (index, e) => {
    const newMedicines = [...medicines];
    newMedicines[index][e.target.name] = e.target.value;
    setMedicines(newMedicines);
  };

  const addMedicineField = () => {
    setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  const removeMedicineField = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!appointmentId) {
      alert('Error: No appointment selected. Please go back to Dashboard and select an appointment.');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('authToken');

    try {
      // Using /create which links to appointmentId
      await axios.post(
        (process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/prescription/create',
        { appointmentId, medicines, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Prescription issued successfully!');
      // Optionally navigate back
      // navigate('/doctor/check-appointments');
      setMedicines([{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
      setNotes('');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Failed to issue prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-rx-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
        .add-rx-page { font-family: 'Outfit', sans-serif; background: #f2f7fb; min-height: 100vh; padding: 40px; }
        .container { max-width: 900px; margin: 0 auto; }
        .back-link { color: #1a237e; text-decoration: none; margin-bottom: 25px; display: inline-flex; align-items: center; gap: 8px; font-weight: 600; padding: 10px 15px; background: white; border-radius: 12px; }
        .rx-card { background: white; border-radius: 20px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border-top: 5px solid #1a237e; }
        .title { color: #1a237e; margin: 0 0 30px; font-size: 2rem; display: flex; align-items: center; gap: 15px; }
        .form-group { margin-bottom: 25px; }
        .form-group label { display: block; color: #455a64; font-weight: 600; margin-bottom: 8px; }
        .styled-input { width: 100%; padding: 12px; border: 1px solid #cfd8dc; border-radius: 10px; font-family: inherit; transition:border-color 0.2s; }
        .styled-input:focus { outline: none; border-color: #1a237e; box-shadow: 0 0 0 3px rgba(26, 35, 126, 0.1); }
        .read-only-field { background: #e8eaf6; color: #1a237e; font-weight: 700; border: none; cursor: default; }
        .med-section { background: #f8f9fa; padding: 20px; border-radius: 15px; border: 1px dashed #b0bec5; margin-bottom: 20px; }
        .med-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .med-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 15px; margin-bottom: 10px; }
        .btn { border: none; padding: 12px 20px; border-radius: 10px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; }
        .btn-add { background: #e0f7fa; color: #006064; width: 100%; justify-content: center; margin-bottom: 30px; }
        .btn-remove { background: #ffebee; color: #c62828; padding: 5px 10px; font-size: 0.8rem; }
        .btn-submit { background: #1a237e; color: white; width: 100%; justify-content: center; font-size: 1.1rem; }
        .btn-submit:hover { background: #151b60; box-shadow: 0 5px 15px rgba(26, 35, 126, 0.3); }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
      <div className="container">
        <Link to="/doctor/check-appointments" className="back-link"><ArrowBack fontSize="small" /> Back to Queue</Link>
        <div className="rx-card">
          <h1 className="title"><NoteAdd fontSize="large" /> Issue Prescription</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Patient Name</label>
              <input
                className="styled-input read-only-field"
                type="text"
                value={patientName || 'No Patient Selected'}
                readOnly
              />
              {!appointmentId && <p style={{ color: 'red', fontSize: '0.85rem', marginTop: '5px' }}>Please select a patient from the queue.</p>}
            </div>

            <h3 style={{ color: '#37474f', marginTop: '30px' }}>Medicines</h3>
            {medicines.map((med, index) => (
              <div className="med-section" key={index}>
                <div className="med-header">
                  <span style={{ fontWeight: 'bold', color: '#78909c' }}>Medicine #{index + 1}</span>
                  {index > 0 && <button type="button" className="btn btn-remove" onClick={() => removeMedicineField(index)}><Delete fontSize="small" /> Remove</button>}
                </div>
                <div className="med-grid">
                  <input className="styled-input" name="name" placeholder="Medicine Name" value={med.name} onChange={(e) => handleMedicineChange(index, e)} required />
                  <input className="styled-input" name="dosage" placeholder="Dosage (e.g. 500mg)" value={med.dosage} onChange={(e) => handleMedicineChange(index, e)} required />
                  <input className="styled-input" name="frequency" placeholder="Freq (e.g. 1-0-1)" value={med.frequency} onChange={(e) => handleMedicineChange(index, e)} required />
                  <input className="styled-input" name="duration" placeholder="Duration (e.g. 5 Days)" value={med.duration} onChange={(e) => handleMedicineChange(index, e)} required />
                </div>
                <input className="styled-input" name="instructions" placeholder="Special Instructions (e.g. After food)" value={med.instructions} onChange={(e) => handleMedicineChange(index, e)} />
              </div>
            ))}

            <button type="button" className="btn btn-add" onClick={addMedicineField}>
              <Add /> Add Another Medicine
            </button>

            <div className="form-group">
              <label>Additional Notes</label>
              <textarea
                className="styled-input"
                rows="4"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Dietary advice, next visit, etc..."
              />
            </div>

            <button type="submit" className="btn btn-submit" disabled={loading || !appointmentId}>
              <Save /> {loading ? 'Issuing...' : 'Issue Prescription'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPrescription;