import { User } from '../models/User.js'
// Login form
export const loginPage = async (req, res) => {
  res.render('/adminLogin', { error: null, form: {} });
};

// Login submit
export const login = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password || '';

    const form = { email };

    if (!email || !password) {
      return res.render('auth/login', { error: 'Email and password are required.', form });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.render('auth/login', { error: 'Invalid login.', form });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.render('auth/login', { error: 'Invalid login.', form });
    }

    req.session.userId = user._id.toString();

    res.redirect('/admin');
  } catch (err) {
    next(err);
  }
};

// Logout
export const logout = async (req, res) => {
  req.session.destroy(err => {
    if (err) return next(err);
    res.redirect('/login');
  });
};
