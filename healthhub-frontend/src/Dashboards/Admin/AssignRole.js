// src/Dashboards/Admin/AssignRole.js
import React, { useState, useEffect } from 'react';

const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5000') + '';

const AssignRole = () => {
  const [staffList, setStaffList] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [task, setTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [assignedTasks, setAssignedTasks] = useState([]);

  useEffect(() => {
    fetchStaff();
    fetchTasks();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/staff-tasks/staff-list`);
      if (res.ok) setStaffList(await res.json());
    } catch (err) {
      console.error('Fetch staff error:', err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/staff-tasks/tasks`);
      if (res.ok) setAssignedTasks(await res.json());
    } catch (err) {
      console.error('Fetch tasks error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStaffId || !task.trim()) {
      setError('Please select a staff member and enter a task.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${API_BASE}/api/staff-tasks/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId: selectedStaffId, task }),
      });

      const result = await res.json();
      if (res.ok) {
        setSuccess('Task assigned successfully!');
        setTask('');
        setSelectedStaffId('');
        fetchTasks();
      } else {
        setError(result.message || 'Failed to assign task.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task assignment?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/staff-tasks/task/${taskId}`, { method: 'DELETE' });
      if (res.ok) {
        setAssignedTasks(prev => prev.filter(t => t._id !== taskId));
        setSuccess('Task deleted successfully.');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to delete task.');
      }
    } catch (err) {
      setError('Delete failed due to network error.');
    }
  };

  return (
    <div className="assign-role-container">
      <style>{`
        .assign-role-container {
          animation: fadeIn 0.4s ease-out;
        }

        .layout-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 30px;
        }
        @media(max-width: 1000px) { .layout-grid { grid-template-columns: 1fr; } }

        /* Card Styles */
        .glass-card {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.05);
        }

        .card-header {
          margin-bottom: 25px;
          border-bottom: 2px solid #f0f4f8;
          padding-bottom: 10px;
        }
        .card-header h3 {
          margin: 0;
          color: #1e3c72;
          font-size: 1.4rem;
        }
        .card-header p {
          color: #718096;
          margin: 5px 0 0;
          font-size: 0.9rem;
        }

        /* Form Elements */
        .form-group { margin-bottom: 20px; }
        .form-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #4a5568;
        }
        .form-select, .form-textarea {
          width: 100%;
          padding: 12px 15px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          font-family: inherit;
          font-size: 1rem;
          transition: all 0.2s;
        }
        .form-select:focus, .form-textarea:focus {
          outline: none;
          border-color: #1e3c72;
          background: white;
          box-shadow: 0 0 0 3px rgba(30, 60, 114, 0.1);
        }
        .form-textarea { resize: vertical; min-height: 100px; }

        .btn-primary {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(30, 60, 114, 0.2);
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(30, 60, 114, 0.3);
        }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }

        /* Task List */
        .task-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
          max-height: 500px;
          overflow-y: auto;
          padding-right: 5px;
        }

        .task-item {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.2s;
        }
        .task-item:hover {
          background: white;
          border-color: #cbd5e1;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }

        .task-info h4 { margin: 0 0 5px; color: #2d3748; }
        .task-meta { font-size: 0.85rem; color: #718096; display: flex; gap: 10px; align-items: center; }
        .role-badge { 
          background: #e0f2fe; color: #0369a1; 
          padding: 2px 8px; borderRadius: 4px; font-size: 0.75rem; 
        }

        .btn-delete {
          background: #fee2e2;
          color: #b91c1c;
          border: none;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 600;
          transition: background 0.2s;
        }
        .btn-delete:hover { background: #fecaca; }

        /* Alerts */
        .alert {
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 0.95rem;
        }
        .alert-success { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
        .alert-error { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="layout-grid">
        {/* Assign Form */}
        <div className="glass-card">
          <div className="card-header">
            <h3>Assign New Task</h3>
            <p>Delegate responsibilities to staff members</p>
          </div>

          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Staff Member</label>
              <select
                className="form-select"
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
              >
                <option value="">-- Select Staff --</option>
                {staffList.map(staff => (
                  <option key={staff.staffId} value={staff.staffId}>
                    {staff.name} ({staff.designation})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Task Description</label>
              <textarea
                className="form-textarea"
                placeholder="Enter detailed task instructions..."
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Assigning...' : 'Assign Task'}
            </button>
          </form>
        </div>

        {/* Task History */}
        <div className="glass-card">
          <div className="card-header">
            <h3>Active Assignments ({assignedTasks.length})</h3>
            <p>Recently assigned tasks and duties</p>
          </div>

          {assignedTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#a0aec0' }}>
              No tasks currently assigned.
            </div>
          ) : (
            <div className="task-list">
              {assignedTasks.map(t => (
                <div key={t._id} className="task-item">
                  <div className="task-info">
                    <h4>{t.staffName} <span className="role-badge">{t.designation || 'Staff'}</span></h4>
                    <p style={{ margin: '5px 0', color: '#4a5568' }}>{t.task}</p>
                    <div className="task-meta">
                      <span>📅 {new Date(t.assignedAt).toLocaleDateString()}</span>
                      <span style={{
                        background: t.status === 'Done' ? '#dcfce7' : '#fef9c3',
                        color: t.status === 'Done' ? '#166534' : '#854d0e',
                        padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        {t.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(t._id)} className="btn-delete">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignRole;