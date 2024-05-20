import mysql from 'mysql2';
import dotenv from 'dotenv';
import { parseISO, getDay } from 'date-fns';
import { BOATS_AVAILABLE } from './constants.js';
import { splitFilter } from './helpers.js';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

// #region users

const getUserColumnsString = 'userId, firstName, lastName, email, role, fishingLicence, points, pcoc, isConfirmed';

export async function getUsers() {
    const [rows] = await pool.query(`SELECT ${getUserColumnsString}, isConfirmed FROM qcl.user`);
    return rows;
}

export async function getAdminEmails() {
    const [rows] = await pool.query(`SELECT email FROM qcl.user WHERE role = 'admin'`);
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

export async function createUser({firstName, lastName, email, password, role, fishingLicence, pcoc, isConfirmed, points}) {
    const [res] = await pool.query(`
        INSERT INTO qcl.user (firstName, lastName, email, password, role, fishingLicence, pcoc, isConfirmed, points)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [firstName, lastName, email, password, role, fishingLicence, pcoc, isConfirmed, points]);
    return getUserById(res.insertId);
}

// For now, we only care about patching isConfirmed and points on a user.
export async function patchUser({isConfirmed, points, userId}) {
    await pool.query(`
        UPDATE qcl.user SET isConfirmed = IFNULL(?, isConfirmed), points = IFNULL(?, points) WHERE userId = ?;
    `, [isConfirmed, points, userId]);
    return true;
}

// For now, we only care about patching isConfirmed and points on a user.
export async function deleteUser({userId}) {
    await pool.query(`
        DELETE FROM qcl.user WHERE userId = ?;
    `, [userId]);
    return true;
}

export async function incrementUserPoints({userId}) {
    await pool.query(`
        UPDATE qcl.user
        SET points = points + 1
        WHERE userId = ?;
    `, [userId]);
    return true;
}

// #endregion

// #region days of the week

export async function getHalfDays({endDate}) {
    const [rows] = await pool.query(`SELECT * FROM qcl.halfDay
    WHERE date > CURDATE() AND date < ?`, [endDate]);
    return rows;
}

/**
 * Check a week in the future to see which days are half days. 
 * Really hacky, but this is only for the admin page. Assumes NUM_DAYS_BOOKABLE is less than 2 weeks.
 */
export async function getFutureHalfDays() {
    const [rows] = await pool.query(`SELECT * FROM qcl.halfDay
    WHERE date > DATE_ADD(CURDATE(), INTERVAL 13 DAY) AND date < DATE_ADD(CURDATE(), INTERVAL 21 DAY)`);
    return rows;
}

export async function isHalfDay({date}) {
    const [rows] = await pool.query('SELECT * FROM qcl.halfDay WHERE date = ?', [date]);
    return rows[0] != null;
}

export async function setDaysHalfDay({dateStringArr}) {
    const values = dateStringArr.map((dateString) => [dateString]);
    await pool.query(`INSERT IGNORE INTO halfDay(date) VALUES ?`, [values]);
    return true;
}

export async function setDaysFullDay({dateStringArr}) {
    await pool.query(`DELETE FROM halfDay WHERE date IN (?)`, [dateStringArr]);
    return true;
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
        `SELECT COUNT(*) FROM boatUnavailable WHERE dateUnavailable = ?;`,
        [date]
    );
    return count[0];
}

export async function createBoatUnavailable({boatId, date}) {
    await pool.query(
        `INSERT IGNORE INTO boatUnavailable (boatId, dateUnavailable)
        VALUES (?, ?);`,
        [boatId, date]
    );
    return true;
}

export async function deleteBoatUnavailable({boatId, date}) {
    await pool.query(
        `DELETE FROM boatUnavailable
        WHERE boatId = ? AND dateUnavailable = ?;`,
        [boatId, date]
    );
    return true;
}

export async function getDatesUnavailableByBoat({boatId}) {
    const [rows] = await pool.query(
        `SELECT dateUnavailable FROM boatUnavailable
        WHERE boatId = ? AND dateUnavailable >= CURDATE();`,
        [boatId]
    );
    return rows;
}

// #endregion


// #region bookings

// Return ordered list of all bookings, ordered such that isPriority is at the top, followed by lowest points, followed by earlier booking
export async function getUsersForBookings({date, isMorningBooking}) {
    const [rows] = await pool.query(
        `SELECT u.points, u.firstName, u.lastName, b.isPriority, b.timeBooked, u.userId
        FROM user AS u JOIN booking AS b ON u.userId = b.userId 
        WHERE b.date = ? AND b.isMorningBooking IS ? 
        ORDER BY b.isPriority DESC, u.points, b.timeBooked ASC;`, 
        [date, isMorningBooking]
    );
    return rows;
}

export async function getBookingsForDayOfWeek({dayOfWeek}) {
    const [rows] = await pool.query(
        `SELECT b.bookingId, u.points, u.firstName, u.lastName, b.isPriority, b.date
        FROM user AS u JOIN booking AS b ON u.userId = b.userId 
        WHERE DAYOFWEEK(date) = ? AND date >= CURDATE() 
        ORDER BY b.date, b.isPriority DESC, u.points, b.timeBooked ASC;`, 
        [dayOfWeek]
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

export async function getUserIdsForBoatAssignments({dateString, isMorningBooking, boatsAvailableForDate}) {
    const [rows] = await pool.query(
        `SELECT  b.userId, u.firstName, u.lastName FROM booking AS b JOIN user AS u ON u.userId = b.userId
        WHERE b.date = ? AND b.isMorningBooking IS ? AND (b.isConfirmed = 1 OR b.isConfirmed IS NULL)
        ORDER BY b.isPriority DESC, u.points, b.timeBooked LIMIT 0, ${boatsAvailableForDate.toString()}`, 
        [dateString, isMorningBooking]
    );
    return rows;
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
        ?, NOW(), ?) ON DUPLICATE KEY UPDATE isPriority = ?;
    `, [date, isMorningBooking, date, isMorningBooking, userPoints, isPriority, isPriority, userId, isPriority, isPriority]);


    return await updateBookingIsConfirmedAfterInsertion({date, isMorningBooking, boatsAvailableForDate});
}

export async function deleteBooking({date, isMorningBooking, userId}) {
    await pool.query(`
    DELETE FROM booking WHERE date = ? AND isMorningBooking IS ? AND userId = ?;
`, [date, isMorningBooking, userId]);
    return true;
}

// By design, we can only get bookings that are today that need confirming
export async function getBookingsNeedingConfirmation({userId}) {
    const  [booking] = await pool.query(`
    SELECT *
    FROM booking
    WHERE date = CURDATE()
    AND userId = ?
    AND isConfirmed is NOT NULL;
    `, [userId]);
    return booking;
}

// Confirm a booking by bookingId. Added in userId so others cant alter my booking
export async function confirmBooking({bookingId, userId}) {
    await pool.query(`
        UPDATE booking
        SET isConfirmed = TRUE
        WHERE bookingId = ?
        AND userId = ?;
    `, [bookingId, userId]);
    return true;
}

export async function unconfirmBooking({bookingId, userId}) {
    await pool.query(`
        UPDATE booking
        SET isConfirmed = FALSE
        WHERE bookingId = ?
        AND userId = ?;
    `, [bookingId, userId]);
    return true;
}

/**
 * Returns an array of userIds to email asking about confirmation.
 * 
 * If the array is empty, no confirmation is needed for the booking period.
 * 
 * If there are two arrays, the day is a half day, and the first array corresponds
 * to the morning bookings, while the second array corresponds to the evenings.
 */
export async function getUserIdsOfBookingsNeedingConfirmation({dateString}) {
    const today = parseISO(dateString);
    const [allBookings] = await pool.query(`
    SELECT *
    FROM booking
    WHERE date = ?;
    `, [today]);

    const isDateAHalfDay = await isHalfDay({date: dateString});
    const numBoatsUnavailable = await getNumBoatsUnavailableByDate({date: today});
    const boatsAvailableForDate = BOATS_AVAILABLE - Object.values(numBoatsUnavailable)[0];

    if(isDateAHalfDay) {
        const { satisfied: morningBookings, unsatisfied: eveningBookings } = 
            splitFilter({array: allBookings, condition: ({isMorningBooking}) => (isMorningBooking)
        })
        const { satisfied: morningConfirmed, unsatisfied: morningNeedsConfirmation } = 
            splitFilter({array: morningBookings, condition: ({isConfirmed}) => (isConfirmed === null)
        })
        const { satisfied: eveningConfirmed, unsatisfied: eveningNeedsConfirmation } = 
            splitFilter({array: eveningBookings, condition: ({isConfirmed}) => (isConfirmed === null)
        })

        return [
            morningConfirmed.length >= boatsAvailableForDate ? [] : morningNeedsConfirmation.map(({userId}) => userId), 
            eveningConfirmed.length >= boatsAvailableForDate ? [] : eveningNeedsConfirmation.map(({userId}) => userId),
        ];
    } else {
        const { satisfied: confirmed, unsatisfied: needsConfirmation } = 
            splitFilter({array: allBookings, condition: ({isConfirmed}) => (isConfirmed === null)});
        return [
            confirmed.length >= boatsAvailableForDate ? [] : needsConfirmation.map(({userId}) => userId)
        ];
    }
}

// #endregion
