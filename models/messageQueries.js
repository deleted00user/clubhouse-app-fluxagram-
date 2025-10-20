const pool = require('../db/pool');

async function newMessage (title, text, userId){
    try{
        const inserting = await pool.query(
            "INSERT INTO messages (title, text, user_id) VALUES ($1, $2, $3) RETURNING *",
            [title, text, userId]
        )
        return inserting.rows[0]
    } catch (error) {
        throw error;
    }
}

async function getAllMessages(){
    try{
        const result = await pool.query(`
            SELECT 
                messages.id,
                messages.title,
                messages.text,
                messages.timestamp,
                users.firstname,
                users.lastname
            FROM messages
            JOIN users ON messages.user_id = users.id
            ORDER BY messages.timestamp DESC`
        );
        return result.rows
    } catch (error) {
        throw error;
    }
}

async function deleteMessage (messageId){
    try{
        await pool.query(
            'DELETE FROM messages WHERE id = $1', [messageId]
        )
    } catch (error) {
        throw error;
    }
}

module.exports = {
    newMessage,
    getAllMessages,
    deleteMessage
}