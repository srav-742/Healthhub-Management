const express = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Doctor = require('../models/Doctor');

const router = express.Router();

const getAuthErrorMessage = (err, fallbackMessage) => {
  if (err.code === 8000 || err.message?.includes('not allowed to do action')) {
    return 'Database permissions are not configured correctly. Grant the Atlas user readWrite access to the healthhub database.';
  }

  return fallbackMessage;
};

router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ msg: 'All fields are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ msg: 'Password must be at least 6 characters.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'Email already registered.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      status: role === 'patient' ? 'approved' : 'pending',
    });

    await user.save();

    const { password: pwd, ...userWithoutPassword } = user._doc;

    return res.status(201).json({
      msg:
        role === 'patient'
          ? 'Registration successful! You can now complete your profile.'
          : 'Registration successful! Awaiting admin approval.',
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: getAuthErrorMessage(err, 'Server error during registration.') });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials.' });
    }

    if (user.role !== 'patient' && user.status !== 'approved') {
      return res.status(401).json({
        msg: 'Your account is pending approval. Please wait for admin confirmation.',
      });
    }

    const token = user._id.toString();
    const { password: pwd, contact, ...safeUserData } = user._doc;

    let userDataToSend = {
      ...safeUserData,
      phone: contact || 'Not Provided',
    };

    if (user.role === 'doctor') {
      const doctor = await Doctor.findOne({ email }).exec();
      if (doctor) {
        userDataToSend = {
          ...userDataToSend,
          name: doctor.name,
          doctorId: doctor.doctorId,
          contact: doctor.phone || contact || 'Not Provided',
          specialization: doctor.specialization || 'Not Provided',
          qualification: doctor.qualification || 'Not Provided',
          experience: doctor.experience || 'Not Provided',
          availableDays: doctor.availableDays || [],
          availableTimings: doctor.availableTime || 'Not Provided',
          consultationFee: doctor.consultationFee || 0,
          address: doctor.address || 'Not Provided',
          dob: doctor.dob ? new Date(doctor.dob).toISOString().split('T')[0] : 'Not Provided',
          age: doctor.age || 'Not Provided',
          gender: doctor.gender || 'Not Provided',
        };
      }
    }

    return res.json({
      msg: 'Login successful!',
      token,
      user: userDataToSend,
    });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ msg: getAuthErrorMessage(err, 'Server error during login.') });
  }
});

module.exports = router;
