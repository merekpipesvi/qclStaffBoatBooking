import mysql from 'mysql2'
import dotenv from 'dotenv'
import { BOATS_AVAILABLE } from './constants.js';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

// #region users

const getUserColumnsString = 'userId, firstName, lastName, email, role, fishingLicence, points, pcoc';

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

export async function createUser({firstName, lastName, email, password, role, fishingLicence, pcoc, points}) {
    const [res] = await pool.query(`
        INSERT INTO qcl.user (firstName, lastName, email, password, role, fishingLicence, pcoc, points)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [firstName, lastName, email, password, role, fishingLicence, pcoc, points]);
    return getUserById(res.insertId);
}

// #endregion

// #region days of the week

export async function getDaysOfWeek() {
    const [rows] = await pool.query('SELECT * FROM qcl.day');
    return rows;
}

// #endregion

// #region boats

export async function getBoatsUnavailableDates({startDate, endDate}) {
    const [rows] = await pool.query(
        `SELECT boatId, dateUnavailable
        FROM boatUnavailable
        WHERE dateUnavailable BETWEEN ? AND ? ORDER BY dateUnavailable;`, 
        [startDate, endDate]
    );
    return rows;
}

export async function getNumBoatsUnavailableByDate({date}) {
    const [count] = await pool.query(
        `SELECT COUNT(*) FROM boatunavailable WHERE dateUnavailable = ?;`,
        [date]
    );
    return count[0];
}

// #endregion


// #region bookings

// Return ordered list of all bookings, ordered such that isPriority is at the top, followed by lowests points, followed by earlier booking
export async function getUsersForBookings({userId, date, isMorningBooking}) {
    const [rows] = await pool.query(
        `SELECT u.points, u.firstName, u.lastName, b.isPriority, b.timeBooked,
        CASE 
            WHEN u.userId = ? THEN 1 ELSE 0
        END AS isMe
        FROM user AS u JOIN booking AS b ON u.userId = b.userId 
        WHERE b.date = ? AND b.isMorningBooking IS ? 
        ORDER BY b.isPriority DESC, u.points, b.timeBooked ASC;`, 
        [userId, date, isMorningBooking]
    );
    return rows;
}

export async function updateBookingIsConfirmedAfterInsertion({date, isMorningBooking, boatsAvailableForDate}) {
    await pool.query(
        `UPDATE booking AS b LEFT JOIN (SELECT  b.userId FROM booking AS b JOIN user AS u ON u.userId = b.userId
            WHERE b.date = ? AND b.isMorningBooking IS ?
            ORDER BY b.isPriority DESC, u.points, b.timeBooked LIMIT 0, ${boatsAvailableForDate.toString()}) AS subq ON b.userId = subq.userId 
            SET b.isConfirmed = 0
            WHERE subq.userId IS NULL AND b.date = ? AND isMorningBooking IS ? AND isConfirmed IS NULL;`, 
        [date, isMorningBooking, date, isMorningBooking]
    );
    return true;
}

export async function createBooking({date, isMorningBooking, userPoints, isPriority, userId}) {
    const numBoatsUnavailable = await getNumBoatsUnavailableByDate({date});
    const boatsAvailableForDate = BOATS_AVAILABLE - Object.values(numBoatsUnavailable)[0];
    

    await pool.query(`
        INSERT INTO booking (date, isMorningBooking, isConfirmed, userId, timeBooked, isPriority)
        VALUES (?, ?, 
            CASE 
                WHEN (SELECT COUNT(*) FROM user AS u JOIN booking AS b ON u.userId = b.userId
                        WHERE b.date = ? AND b.isMorningBooking IS ? AND 
                        ( (u.points <= ? AND b.isPriority >= ?) OR b.isPriority > ?)
                ) < ${boatsAvailableForDate} THEN NULL else 0 END, 
        ?, NOW(), ?);
    `, [date, isMorningBooking, date, isMorningBooking, userPoints, isPriority, isPriority, userId, isPriority]);


    return updateBookingIsConfirmedAfterInsertion({date, isMorningBooking, boatsAvailableForDate});
}

export async function deleteBooking({date, isMorningBooking, userId}) {
    await pool.query(`
    DELETE FROM booking WHERE date = ? AND isMorningBooking IS ? AND userId = ?;
`, [date, isMorningBooking, userId]);
    return true;
}

// #endregion
