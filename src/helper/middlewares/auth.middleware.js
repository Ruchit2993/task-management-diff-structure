import jwt from 'jsonwebtoken';
import messages from '../constants/messages.js';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: messages.ERROR.NO_TOKEN });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: messages.ERROR.TOKEN_FORMAT });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, isAdmin: decoded.isAdmin, email: decoded.email };
    next();
  } catch (error) {
    return res.status(401).json({ message: messages.ERROR.INVALID_TOKEN });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: messages.ERROR.ADMIN_REQUIRED });
  }
  next();
};

export { verifyToken, isAdmin };