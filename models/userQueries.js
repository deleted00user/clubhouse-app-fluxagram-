const pool = require('../db/pool')

async function createUser (firstName, lastName, email, hashedPassword){
    try{
        const result = await pool.query(
        `INSERT INTO users(firstName, lastName, email, password, membershipStatus, admin) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [firstName, lastName, email, hashedPassword, false, false]
    );
        return result.rows[0]; // Return the new user
    } catch (error) {
        throw error;
    }
}

async function updateMembershipStatus (userId) {
    try {
        const result = await pool.query(
            'UPDATE users SET membershipStatus = true WHERE id = $1 RETURNING *', 
            [userId]
        );
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

async function findUserByEmail (email) {
    try{
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1', [email]
        );
        return result.rows[0]; // Return the user, or undefined if not found
    } catch (error) {
        throw error;
    }
}

async function findUserById (userId) {
    try{
        const result = await pool.query(
            'SELECT * FROM users WHERE id = $1', [userId]
        );
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

async function updateAdminStatus(userId) {
    try{
        const result = await pool.query(
            'UPDATE users SET admin = true WHERE id = $1 RETURNING *', [userId]
        )
        return result.rows[0]
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createUser,
    updateMembershipStatus,
    findUserByEmail,
    findUserById,
    updateAdminStatus
}