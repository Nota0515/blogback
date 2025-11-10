const pool = require('../config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.auth = async (req , res , next ) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        console.log(token);
        if (!token) return res.status(401).json({ message: "Authentication Required , TOKEN NOT FOUND" });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = await pool.query("SELECT * FROM admin WHERE id = $1", [decoded.adminId]);

        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError'){
            return res.status(401).json({message : 'Invalid Token'});
        }
        if (error.name === 'TokenExpiredError'){
           return res.status(401).json({message : 'Token Expired'});
        };
        return res.status(500).json({message : 'Internal Server Error'});
    }
};