const pool = require('../config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.auth = async (req, res, next) => {
    try {
        const token =
            req.cookies?.adminToken ||
            req.headers.authorization?.split(' ')[1];

        if (!token) {
            return req.accepts('html')
                ? res.redirect('/admin/login')
                : res.status(401).json({ message: "Invalid or Token expired" });
        };

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('verified done');
        req.admin = await pool.query("SELECT * FROM admin WHERE id = $1", [decoded.adminId]);

        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return req.accepts('html')
                ? res.redirect('/admin/login')
                : res.status(401).json({ message: 'Invalid Token' });
        }
        console.error('Auth error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};