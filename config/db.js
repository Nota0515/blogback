const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DB_URL || null ,
    host: `${process.env.HOST}`,
    user: `${process.env.DATABASE_USER}`,
    database: `${process.env.DATABASE}`,
    password: `${process.env.DATABASE_PASSWORD}`,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    maxLifetimeSeconds: 60,
    ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized : false } : false
})

pool.on('connect' , ()=>{
    console.log("connction sucessful we created a active pool")
});

pool.on('error' , (e)=>{
    console.log(`we got this error ${e} while pool creation`)
});

module.exports = pool;