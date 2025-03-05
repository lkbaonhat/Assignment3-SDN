require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const connectDB = require('./config/database');
const jwt = require('jsonwebtoken');
const Member = require('./models/member');

// Connect to database
connectDB();

const app = express();

// Set up EJS as view engine
app.set('view engine', 'ejs');

// Body parser middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Method override middleware
app.use(methodOverride('_method'));

// Add this middleware after your flash middleware
app.use(async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET || 'your_jwt_secret');
      const member = await Member.findById(decoded.id).select('-password');

      if (member) {
        req.member = member;
        res.locals.currentUser = member; // Make user available in all views
      }
    }
    next();
  } catch (error) {
    // Token expired or invalid
    res.clearCookie('jwt');
    next();
  }
});

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false
}));

// Flash middleware
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/brands', require('./routes/brands'));
app.use('/perfumes', require('./routes/perfumes'));
app.use('/collectors', require('./routes/collectors'));

// Error handling middleware
app.use((req, res) => {
  res.status(404).render('404', { title: '404 - Page Not Found' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});