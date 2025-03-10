require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./database/db');
const authRoutes = require('./routes/auth');
const memberRoutes = require('./routes/member');
const brandRoutes = require('./routes/brand');
const perfumeRoutes = require('./routes/perfume');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/perfumes', perfumeRoutes);

// Special collectors endpoint (as per task 4)
app.use('/api/collectors', memberRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));