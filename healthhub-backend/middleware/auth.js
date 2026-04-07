const User = require('../models/User');

module.exports = async function (req, res, next) {
  let token = req.header('x-auth-token');

  if (!token) {
    token = req.header('Authorization')?.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ msg: 'No token, access denied' });
  }

  try {
    const user = await User.findById(token).select('_id role email status');

    if (!user) {
      return res.status(401).json({ msg: 'Invalid login token' });
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
      status: user.status,
    };

    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Invalid login token' });
  }
};
