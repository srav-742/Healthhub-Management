// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// ✅ Debug: confirm .env loaded
console.log('🔧 PORT:', process.env.PORT);
console.log('🔧 MONGO_URI (redacted):', process.env.MONGO_URI?.replace(/:.+@/, ':***@'));

if (!process.env.MONGO_URI) {
  console.warn('MONGO_URI is not set. Configure it in the backend environment.');
}

const connectDB = require('./config/db');

const app = express();

const normalizeOrigin = (origin = '') => origin.trim().replace(/\/$/, '');
const configuredOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URLS,
  process.env.CORS_ORIGIN,
  process.env.ALLOWED_ORIGINS,
]
  .filter(Boolean)
  .flatMap((value) => value.split(','))
  .map(normalizeOrigin)
  .filter(Boolean);

const isLocalOrigin = (origin) => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  const normalizedOrigin = normalizeOrigin(origin);
  if (isLocalOrigin(normalizedOrigin)) return true;

  if (configuredOrigins.length === 0) return true;

  return configuredOrigins.includes(normalizedOrigin);
};

const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS policy: Origin not allowed (${origin})`));
  },
  credentials: true,
};

// 📌 Connect to MongoDB
if (configuredOrigins.length > 0) {
  console.log('Allowed frontend origins:', configuredOrigins.join(', '));
} else {
  console.warn('No FRONTEND_URLS configured. Allowing requests from any origin.');
}

// 📌 Middleware
app.use(cors(corsOptions));
app.use(express.json());

// 📌 Routes

// Authentication
app.use('/api/auth', require('./routes/authSimple'));

// Patient Management
app.use('/api/patients', require('./routes/patients'));

// Staff Routes
app.use('/api/staff', require('./routes/staffRoutes'));

// Doctor Routes
app.use('/api/doctor', require('./routes/doctorRoutes'));
app.use('/api/doctor', require('./routes/doctorAppointments'));
app.use('/api/doctor', require('./routes/doctorPrescriptions'));
app.use('/api/doctor', require('./routes/doctorDocumentRoutes'));
app.use('/api/doctor', require('./routes/doctorHistory'));

// ✅ NEW: Doctor Completion Route
app.use('/api/doctor', require('./routes/doctorCompletion')); // Handles appointment completion

// Admin Routes
app.use('/api/admin', require('./routes/adminRoutes'));

// Patient Profile
app.use('/api/patient', require('./routes/patientProfile'));

// Appointment Routes
app.use('/api/appointment', require('./routes/appointmentRoutes'));

// Document Upload Routes
app.use('/api/document', require('./routes/documentRoutes'));

// Billing Routes
app.use('/api/billing', require('./routes/billingRoutes'));

// Medical History Routes
app.use('/api/history', require('./routes/historyRoutes'));

// Prescriptions Routes
app.use('/api/prescription', require('./routes/prescriptionRoutes'));

// ✅ NEW: Staff Task Assignment API
app.use('/api/staff-tasks', require('./routes/staffTasks')); // Assign tasks to staff

// ✅ Admin Staff List API (if exists, otherwise safe to keep)
app.use('/api/admin', require('./routes/adminStaff')); // Optional: additional admin endpoints

// ✅ Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// 🔽 ADD THIS LINE (no existing code changed)
app.use('/api/tasks', require('./routes/userTasks'));

app.use('/api/appointments/view', require('./routes/appointmentView'));

app.use('/api/doctors/view', require('./routes/doctorView'));

// 📌 Health check endpoint
app.get('/', (req, res) => {
  res.send(`
    <h2>🏥 HealthHub Backend</h2>
    <p>✅ Server is running!</p>
    <p>🔗 Complete Appointment: <code>PUT /api/doctor/appointments/complete/:id</code></p>
    <p>📄 Doctor Appointments: <code>GET /api/doctor/appointments</code></p>
    <p>📋 Doctor Patients: <code>GET /api/doctor/patients</code></p>
    <p>💊 Prescriptions: <code>GET /api/prescription/my</code></p>
    <p>📁 Documents: <code>POST /api/document/upload</code></p>
    <p>🌐 Uploads: <code>/uploads/patient-docs/filename.pdf</code></p>
  `);
});

// 📌 Start server
app.use((err, req, res, next) => {
  if (!err) return next();

  if (err.message && err.message.startsWith('CORS policy:')) {
    return res.status(403).json({ msg: err.message });
  }

  console.error('Unhandled server error:', err);
  return res.status(500).json({ msg: 'Internal server error.' });
});
startServer();

async function startServer() {
  await connectDB();

  const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`🔗 Doctor API: /api/doctor/*`);
  console.log(`🔗 Staff API: /api/staff/*`);
  console.log(`🔗 Admin API: /api/admin/*`);
  console.log(`🔗 Patient API: /api/patients/*`);
  console.log(`📅 Appointments API: /api/appointment/*`);
  console.log(`📋 Doctor Appointments API: /api/doctor/appointments`);
  console.log(`💊 Doctor Patients API: /api/doctor/patients`);
  console.log(`📂 Doctor Documents API: /api/doctor/patient/:id/documents`);
  console.log(`📁 Document API: /api/document/*`);
  console.log(`🌐 Uploads served at: /uploads/patient-docs/filename.pdf`);
  console.log(`💳 Billing API: /api/billing/*`);
  console.log(`📋 History API: /api/history/*`);
  console.log(`💊 Prescription API: /api/prescription/*`);
  console.log(`✅ New: Complete Appointment → /api/doctor/appointments/complete/:id`);
  console.log(`✅ New: Staff Tasks → /api/staff-tasks`);
});
}
