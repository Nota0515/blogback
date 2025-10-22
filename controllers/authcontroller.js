const pool = require('../config/db');
const bycrpt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async(req , res) => {
    try {
        const { email , password } = req.body ;
        const result = await pool.query(
            'SELECT * FROM admin WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) return res.status(401).json({message : "Invalid credential"});
        const admin = result.rows[0];
        //compare the password
        const validpassword = await bycrpt.compare(password , admin.password);
        if (!validpassword){
            return res.status(401).json({message : "Invalid credential"});
        };

        const token = jwt.sign({
            adminId :admin.id
        } ,  process.env.JWT_SECRET );


        res.status(200).json({token});
          
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message : "server error : " ,
            error : error.message 
        });
    }
};

module.exports = login ;