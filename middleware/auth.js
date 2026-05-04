import User from '../models/User.js';

export function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

export function requireManager(req, res, next) {
  if (!req.session.userId || req.session.role !== 'manager') {
    return res.status(403).send('Forbidden: managers only');
  }
  next();
}