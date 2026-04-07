// src/components/BookAppointment.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowBack,
  CalendarMonth,
  Person,
  AccessTime,
  AttachMoney,
  EventAvailable,
  MedicalServices
} from '@mui/icons-material';

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [problem, setProblem] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/appointment/doctors', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) setDoctors(await res.json());
        else setError('Failed to load doctors');
      } catch (err) { setError('Network error'); }
      finally { setLoading(false); }
    };

    const fetchAppointments = async () => {
      try {
        const res = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/appointment/my', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) setAppointments(await res.json());
      } catch (err) { console.error('Failed to load appointments'); }
    };

    fetchDoctors();
    fetchAppointments();
  }, [token]);

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setAppointmentDate('');
    setProblem('');
    setError('');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !appointmentDate || !problem.trim()) {
      return setError('Please select a doctor, enter your problem, and select a date');
    }

    // Parse explicitly as local date to prevent timezone shifts (YYYY-MM-DD -> Local 00:00:00)
    const [year, month, dayPart] = appointmentDate.split('-').map(Number);
    const date = new Date(year, month - 1, dayPart);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) return setError('Please select a current or future date');

    // Get day names
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }); // e.g. "Wednesday"
    const dayShort = date.toLocaleDateString('en-US', { weekday: 'short' }); // e.g. "Wed"

    // Robust comparison: check if database availability (e.g. "Mon" or "Monday") matches selected day
    const isAvailable = selectedDoctor.availableDays.some(avail => {
      const d = avail.trim().toLowerCase();
      const s = dayShort.toLowerCase();
      const l = dayName.toLowerCase();
      // Match if "wed" is in "wednesday" OR "wednesday" is in "wed" (rare) OR exact match
      return d.startsWith(s) || s.startsWith(d) || l.includes(d) || d.includes(l);
    });

    if (!isAvailable) {
      return setError(`Doctor is not available on ${dayName}s`);
    }

    try {
      const res = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/appointment/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorId: selectedDoctor._id,
          date: appointmentDate,
          problem,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setAppointments([result, ...appointments]);
        setAppointmentDate('');
        setProblem('');
        setError('');
        alert('Appointment booked successfully!');
        setSelectedDoctor(null);
      } else {
        setError(result.msg || 'Booking failed');
      }
    } catch (err) {
      setError('Network error. Try again.');
    }
  };

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/appointment/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        setAppointments(appointments.filter(a => a._id !== id));
        alert('Appointment cancelled');
      } else {
        alert('Failed to cancel');
      }
    } catch (err) { alert('Network error'); }
  };

  return (
    <div className="book-apt-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

        .book-apt-page {
          font-family: 'Outfit', sans-serif;
          background: linear-gradient(135deg, #fdfbfd 0%, #f4f0fa 100%);
          min-height: 100vh;
          padding: 40px;
          animation: fadeIn 0.5s ease-out;
        }

        .container { max-width: 1100px; margin: 0 auto; }

        .back-link { 
          color: #667eea; text-decoration: none; margin-bottom: 30px; 
          display: inline-flex; align-items: center; gap: 8px; font-weight: 600; 
          transition: transform 0.2s; padding: 10px 15px; background: white; 
          border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .back-link:hover { transform: translateX(-5px); box-shadow: 0 4px 15px rgba(0,0,0,0.08); }

        .header { text-align: center; margin-bottom: 50px; }
        .header h1 { color: #2d3748; font-size: 2.5rem; font-weight: 700; margin: 0; }
        .header p { color: #718096; font-size: 1.1rem; margin-top: 10px; }

        /* Doctor Cards */
        .doctor-list {
          display: flex; gap: 25px; padding-bottom: 20px; overflow-x: auto;
          scrollbar-width: thin; scrollbar-color: #667eea #edf2f7;
        }
        .doctor-list::-webkit-scrollbar { height: 8px; }
        .doctor-list::-webkit-scrollbar-thumb { background: #667eea; border-radius: 4px; }

        .doctor-card {
          min-width: 280px; background: rgba(255,255,255,0.9); backdrop-filter: blur(10px);
          border-radius: 24px; padding: 30px; 
          border: 1px solid rgba(255,255,255,0.8);
          box-shadow: 0 10px 30px rgba(0,0,0,0.05); cursor: pointer;
          transition: all 0.3s ease; display: flex; flex-direction: column; align-items: center; text-align: center;
        }
        .doctor-card:hover, .doctor-card.selected {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(118, 75, 162, 0.15);
          border-color: #b7a2d4; background: white;
        }
        .doctor-card.selected { border: 2px solid #667eea; }

        .doc-avatar {
          width: 90px; height: 90px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          color: white; margin-bottom: 15px; box-shadow: 0 4px 15px rgba(118, 75, 162, 0.3);
        }

        /* Booking Form */
        .booking-section {
          background: white; padding: 40px; border-radius: 24px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.05); margin-bottom: 50px;
          border: 1px solid rgba(255,255,255,0.8); animation: slideUp 0.4s ease-out;
        }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .booking-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 50px; }
        
        .detail-row { display: flex; justify-content: space-between; padding: 15px 0; border-bottom: 1px dashed #e2e8f0; }
        .detail-row strong { color: #4a5568; } .detail-row span { color: #718096; }

        .input-group { margin-bottom: 20px; }
        .input-group label { display: block; color: #4a5568; font-weight: 600; margin-bottom: 8px; }
        .styled-input {
          width: 100%; padding: 14px 15px; padding-left: 45px; border: 1px solid #e2e8f0;
          border-radius: 12px; background: #f8fafc; transition: all 0.2s; font-size: 1rem;
        }
        .styled-input:focus {
          background: white; border-color: #667eea; outline: none; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .input-icon { position: absolute; left: 15px; top: 14px; color: #a0aec0; }

        .book-btn {
          width: 100%; padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white; border: none; border-radius: 12px; font-size: 1.1rem; font-weight: 600;
          cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(118, 75, 162, 0.3);
        }
        .book-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(118, 75, 162, 0.4); }

        /* Appointments List */
        .appt-card {
          background: white; padding: 25px; border-radius: 20px; margin-bottom: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid rgba(255,255,255,0.8);
          display: flex; justify-content: space-between; align-items: center; transition: all 0.2s;
        }
        .appt-card:hover { transform: translateX(5px); box-shadow: 0 8px 25px rgba(0,0,0,0.06); }
        
        .status-badge { padding: 6px 14px; border-radius: 30px; font-weight: 600; font-size: 0.85rem; }
        .status-badge.booked { background: #f0fff4; color: #38a169; }
        .status-badge.cancelled { background: #fff5f5; color: #e53e3e; }

        .cancel-btn {
          padding: 8px 16px; border: 1px solid #feb2b2; background: #fff5f5; color: #c53030;
          border-radius: 8px; cursor: pointer; transition: all 0.2s; font-weight: 500;
        }
        .cancel-btn:hover { background: #feb2b2; color: #9b2c2c; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      <div className="container">
        <Link to="/patient-dashboard" className="back-link"><ArrowBack fontSize="small" /> Dashboard</Link>

        <div className="header">
          <h1>Find Your Specialist</h1>
          <p>Book video or in-person consultations with top doctors.</p>
        </div>

        {error && <div style={{ padding: '15px', background: '#fff5f5', color: '#c53030', borderRadius: '10px', marginBottom: '30px', border: '1px solid #feb2b2' }}>{error}</div>}

        {loading ? <p style={{ textAlign: 'center', color: '#718096' }}>Loading specialists...</p> : (
          <div className="doctor-list">
            {doctors.map((doc) => (
              <div key={doc._id} className={`doctor-card ${selectedDoctor?._id === doc._id ? 'selected' : ''}`} onClick={() => handleDoctorSelect(doc)}>
                <div className="doc-avatar"><MedicalServices fontSize="large" /></div>
                <h3 style={{ margin: '0 0 5px', color: '#2d3748' }}>{doc.name}</h3>
                <span style={{ color: '#667eea', fontWeight: '500' }}>{doc.specialization}</span>
                <div style={{ margin: '10px 0', fontSize: '0.9rem', color: '#718096' }}>{doc.experience} Years Exp.</div>
                <div style={{ fontWeight: '700', color: '#2d3748', fontSize: '1.1rem' }}>₹{doc.consultationFee}</div>
              </div>
            ))}
          </div>
        )}

        {selectedDoctor && (
          <div className="booking-section">
            <h2 style={{ margin: '0 0 30px', color: '#2d3748', borderBottom: '2px solid #f7fafc', paddingBottom: '15px' }}>
              Book with Dr. {selectedDoctor.name}
            </h2>
            <div className="booking-grid">
              <div>
                <div className="detail-row"><strong>Specialization</strong> <span>{selectedDoctor.specialization}</span></div>
                <div className="detail-row"><strong>Availability</strong> <span>{selectedDoctor.availableDays.join(', ')}</span></div>
                <div className="detail-row"><strong>Timings</strong> <span>{selectedDoctor.availableTimings}</span></div>
                <div className="detail-row"><strong>Expertise</strong> <span>{selectedDoctor.qualification}</span></div>
                <div className="detail-row" style={{ border: 'none' }}><strong>Fee</strong> <span style={{ fontWeight: 'bold', color: '#667eea' }}>₹{selectedDoctor.consultationFee}</span></div>
              </div>
              <div>
                <div className="input-group">
                  <label>Date</label>
                  <div style={{ position: 'relative' }}>
                    <CalendarMonth className="input-icon" />
                    <input type="date" className="styled-input" value={appointmentDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => setAppointmentDate(e.target.value)} />
                  </div>
                </div>
                <div className="input-group">
                  <label>Reason for Visit</label>
                  <div style={{ position: 'relative' }}>
                    <textarea
                      className="styled-input"
                      style={{ paddingLeft: '15px', minHeight: '100px', resize: 'vertical' }}
                      placeholder="Describe your symptoms..."
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                    />
                  </div>
                </div>
                <button className="book-btn" onClick={handleBookAppointment}>Confirm Booking</button>
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: '60px' }}>
          <h2 style={{ color: '#2d3748', marginBottom: '25px' }}>My Appointments</h2>
          {appointments.length === 0 ? <p style={{ color: '#718096', textAlign: 'center', fontStyle: 'italic' }}>No upcoming appointments.</p> : (
            appointments.map((appt) => (
              <div className="appt-card" key={appt._id}>
                <div>
                  <h3 style={{ margin: '0 0 5px', color: '#2d3748' }}>Dr. {appt.doctorName} <span style={{ fontSize: '0.9rem', color: '#718096', fontWeight: 'normal' }}>({appt.doctorSpecialization})</span></h3>
                  <div style={{ display: 'flex', gap: '20px', color: '#718096', fontSize: '0.9rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><EventAvailable fontSize="small" /> {new Date(appt.date).toLocaleDateString()}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><AccessTime fontSize="small" /> {appt.doctorId?.availableTimings || '10:00 - 17:00'}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ marginBottom: '10px' }}><span className={`status-badge ${appt.status.toLowerCase()}`}>{appt.status}</span></div>
                  {appt.status === 'Booked' && <button className="cancel-btn" onClick={() => handleCancelAppointment(appt._id)}>Cancel</button>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;