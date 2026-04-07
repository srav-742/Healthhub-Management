// src/Dashboards/Doctor/GivePrescription.js
// Redirect or alias to AddPrescription if functionality is identical
// Based on naming, this file is likely a Duplicate or alternate route. 
// I will apply the same styling to ensure safety.

import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ArrowBack, NoteAdd, Save, Add, Delete } from '@mui/icons-material';

const GivePrescription = () => {
  // Reusing the identical layout from AddPrescription for consistency
  const [patientEmail, setPatientEmail] = useState('');
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMedicineChange = (index, e) => {
    const newMedicines = [...medicines];
    newMedicines[index][e.target.name] = e.target.value;
    setMedicines(newMedicines);
  };

  const addMedicineField = () => setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  const removeMedicineField = (index) => setMedicines(medicines.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('authToken');
    try {
      await axios.post((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/prescription/add', { patientEmail, medicines, notes }, { headers: { Authorization: `Bearer ${token}` } });
      alert('Prescription issued successfully!');
      setPatientEmail(''); setMedicines([{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]); setNotes('');
    } catch (err) { alert(err.response?.data?.msg || 'Failed'); }
    finally { setLoading(false); }
  };

  // Styling duplicated for safety
  return (
    <div className="add-rx-page">
      <style>{`
            .add-rx-page { background: #f2f7fb; min-height: 100vh; padding: 40px; font-family: 'Segoe UI', sans-serif; }
            .container { max-width: 900px; margin: 0 auto; }
            .back-link { color: #1a237e; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; font-weight: 600; margin-bottom: 25px; background:white; padding:10px 15px; border-radius:12px; }
            .rx-card { background: white; border-radius: 20px; padding: 40px; border-top: 5px solid #1a237e; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
            .styled-input { width: 100%; padding: 12px; border: 1px solid #cfd8dc; border-radius: 10px; margin-bottom:15px; }
            .med-section { background: #f8f9fa; padding: 20px; border-radius: 15px; border: 1px dashed #b0bec5; margin-bottom: 20px; }
            .btn { padding: 12px 20px; border-radius: 10px; cursor: pointer; border: none; font-weight: 600; }
            .btn-submit { background: #1a237e; color: white; width: 100%; }
          `}</style>

      <div className="container">
        <Link to="/doctor-dashboard" className="back-link"><ArrowBack fontSize="small" /> Dashboard</Link>
        <div className="rx-card">
          <h1 style={{ color: '#1a237e', marginTop: 0 }}><NoteAdd /> Give Prescription</h1>
          <form onSubmit={handleSubmit}>
            <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px' }}>Patient Email</label>
            <input className="styled-input" type="email" value={patientEmail} onChange={(e) => setPatientEmail(e.target.value)} required placeholder="patient@example.com" />

            {medicines.map((med, index) => (
              <div className="med-section" key={index}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <strong>Medicine #{index + 1}</strong>
                  {index > 0 && <button type="button" onClick={() => removeMedicineField(index)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}><Delete /></button>}
                </div>
                <input className="styled-input" name="name" placeholder="Name" value={med.name} onChange={(e) => handleMedicineChange(index, e)} required />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <input className="styled-input" name="dosage" placeholder="Dosage" value={med.dosage} onChange={(e) => handleMedicineChange(index, e)} required />
                  <input className="styled-input" name="frequency" placeholder="Frequency" value={med.frequency} onChange={(e) => handleMedicineChange(index, e)} required />
                  <input className="styled-input" name="duration" placeholder="Duration" value={med.duration} onChange={(e) => handleMedicineChange(index, e)} required />
                </div>
              </div>
            ))}

            <button type="button" onClick={addMedicineField} className="btn" style={{ background: '#e0f7fa', color: '#006064', width: '100%', marginBottom: '20px' }}><Add /> Add Medicine</button>
            <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px' }}>Notes</label>
            <textarea className="styled-input" rows="3" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Dr. Notes" />

            <button type="submit" className="btn btn-submit" disabled={loading}><Save /> Issue</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GivePrescription;