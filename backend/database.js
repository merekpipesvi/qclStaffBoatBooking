import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config();

const getUserColumnsString = 'userId, firstName, lastName, email, role, fishingLicence, pcoc';

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

export async function getUsers() {
    const [rows] = await pool.query(`SELECT ${getUserColumnsString} FROM qcl.user`);
    return rows;
}

export async function getUserForLogIn(email) {
    const [rows] = await pool.query(`SELECT ${getUserColumnsString}, password FROM qcl.user WHERE email = ?`, [email]);
    return rows[0];
}

export async function getUserById(userId) {
    const [rows] = await pool.query(`SELECT ${getUserColumnsString} FROM qcl.user WHERE userId = ?`, [userId]);
    return rows[0];
}

export async function createUser({firstName, lastName, email, password, role, fishingLicence, pcoc}) {
    const [res] = await pool.query(`
        INSERT INTO qcl.user (firstName, lastName, email, password, role, fishingLicence, pcoc)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [firstName, lastName, email, password, role, fishingLicence, pcoc]);
    return getUserById(res.insertId);
}