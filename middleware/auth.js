const pool = require('../config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config;

exports.auth = async (req , res , next ) => {
    try {
        const { token } = req.headers.authorization?.split('')[1];
        if (!token) return res.status(404).json({ error: "NOT FOUND" });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = await pool.query("SELECT * FROM admin WHERE id = $1", [decoded.adminId]);

        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError'){
            res.status(401).json({error : 'Invalid Token'});
        }
        if (error.name === 'TokenExpiredError'){
            res.status(401).json({error : 'Token Expired'});
        };
        return res.status(500).json({error : 'Internal Server Error'});
    }
};