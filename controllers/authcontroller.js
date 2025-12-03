const pool = require('../config/db');
const bycrpt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query(
            'SELECT * FROM admin WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) return res.status(401).json({ message: "Invalid credential" });
        const admin = result.rows[0];
        //compare the password
        const validpassword = await bycrpt.compare(password, admin.password);
        if (!validpassword) {
            return res.status(401).json({ message: "Invalid credential" });
        };

        const token = jwt.sign({
            adminId: admin.id
        }, process.env.JWT_SECRET,
        {
            expiresIn: '1h'
        }
        );
        console.log(token);

        res.cookie('adminToken', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000
        });


        res.status(200).json({ token });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Internal server error "
        });
    }
};

module.exports = login;