// src/Dashboards/Staff/TodayAssignedRole.js
import React, { useState, useEffect } from 'react';

const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5000') + '';

const TodayAssignedRole = () => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      setError('');
      setTask(null);

      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        setError('User not logged in.');
        setLoading(false);
        return;
      }

      let staffId;
      try {
        const user = JSON.parse(storedUser);
        staffId = user.staffId || localStorage.getItem('staffId');
      } catch (err) {
        setError('Invalid user session.');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('authToken');
      if (!staffId || !token) {
        setError('Authentication details missing.');
        setLoading(false);
        return;
      }

      try {
        const url = `${API_BASE}/api/tasks/my?staffId=${staffId}`;
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const tasks = await res.json();
        if (Array.isArray(tasks) && tasks.length > 0) {
          setTask(tasks[0]);
        } else {
          setError('No tasks have been assigned to you for today.');
        }
      } catch (err) {
        console.error('Fetch task failed:', err);
        setError('Could not load your assigned role. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, []);

  const updateStatus = async (newStatus) => {
    if (!task?._id) return;
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_BASE}/api/staff-tasks/task/${task._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ status: newStatus }),
      });

      let data;
      try {
        data = await res.json();
      } catch (e) {
        // Response was likely HTML (404 Not Found)
        alert('Action Required: The backend server needs a restart to recognize this new feature. Please restart "node server.js" in your terminal.');
        return;
      }

      if (res.ok) {
        setTask(prev => ({ ...prev, status: newStatus }));
      } else {
        alert(data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Update failed:', err);
      alert('Network error - check console for details');
    }
  };

  return (
    <div className="assigned-role-container">
      <style>{`
        .assigned-role-container {
          animation: fadeIn 0.5s ease-out;
        }

        .role-card {
          background: white;
          border-radius: 20px;
          padding: 40px;
          border: 1px solid rgba(255,255,255,0.6);
          box-shadow: 0 10px 40px rgba(0,0,0,0.05);
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          overflow: hidden;
        }

        .role-card::before {
          content: "";
          position: absolute;
          top: 0; left: 0; width: 100%; height: 5px;
          background: linear-gradient(90deg, #134E5E, #71B280);
        }

        .header-section {
          text-align: center;
          margin-bottom: 30px;
        }

        .header-section h2 {
          font-size: 2rem;
          color: #134E5E;
          margin-bottom: 10px;
        }

        .header-section p {
          color: #718096;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 15px 0;
          border-bottom: 1px dashed #e2e8f0;
        }
        .detail-row:last-of-type { border-bottom: none; }
        
        .label { font-weight: 600; color: #4a5568; }
        .value { color: #2d3748; font-family: monospace; font-size: 1.1rem; }

        .task-box {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 12px;
          padding: 25px;
          margin-top: 30px;
          color: #166534;
        }

        .task-title {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .empty-state {
          text-align: center;
          padding: 50px;
          color: #a0aec0;
          font-size: 1.1rem;
        }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {loading ? (
        <div className="empty-state">🔄 Fetching your daily assignment...</div>
      ) : error ? (
        <div className="role-card" style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#718096' }}>No Active Tasks</h3>
          <p style={{ marginTop: '10px', color: '#a0aec0' }}>{error}</p>
        </div>
      ) : (
        <div className="role-card">
          <div className="header-section">
            <h2>Today's Assignment</h2>
            <p>Assigned on {new Date(task.assignedAt).toLocaleDateString()}</p>
          </div>

          <div className="detail-row">
            <span className="label">Staff Name</span>
            <span className="value">{task.staffName}</span>
          </div>
          <div className="detail-row">
            <span className="label">Department</span>
            <span className="value">{task.department}</span>
          </div>
          <div className="detail-row">
            <span className="label">Designation</span>
            <span className="value">{task.designation}</span>
          </div>
          <div className="detail-row">
            <span className="label">Assigned By</span>
            <span className="value">{task.assignedBy || 'Admin'}</span>
          </div>

          <div className="task-box">
            <div className="task-title" style={{ justifyContent: 'space-between' }}>
              <span>🎯 Primary Objective</span>
              <span style={{
                fontSize: '0.8rem',
                padding: '4px 8px',
                borderRadius: '6px',
                background: task.status === 'Done' ? '#dcfce7' : '#fef9c3',
                color: task.status === 'Done' ? '#166534' : '#854d0e',
                border: `1px solid ${task.status === 'Done' ? '#bbf7d0' : '#fde047'}`
              }}>
                {task.status || 'Pending'}
              </span>
            </div>
            <p style={{ lineHeight: '1.6', marginBottom: '20px' }}>{task.task}</p>

            <div className="action-buttons" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <button
                onClick={() => updateStatus('Done')}
                disabled={task.status === 'Done'}
                style={{
                  padding: '8px 16px', borderRadius: '8px', border: 'none',
                  background: task.status === 'Done' ? '#bbf7d0' : '#22c55e',
                  color: task.status === 'Done' ? '#166534' : 'white',
                  cursor: task.status === 'Done' ? 'default' : 'pointer',
                  fontWeight: '600'
                }}
              >
                ✅ Mark Done
              </button>
              <button
                onClick={() => updateStatus('Pending')}
                disabled={task.status !== 'Done'}
                style={{
                  padding: '8px 16px', borderRadius: '8px', border: '1px solid #f59e0b',
                  background: task.status !== 'Done' ? '#fef3c7' : 'white',
                  color: '#d97706',
                  cursor: task.status !== 'Done' ? 'default' : 'pointer',
                  fontWeight: '600'
                }}
              >
                Pending
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayAssignedRole;