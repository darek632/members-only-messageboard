const pool = require("./pool");

async function getAllMessages() { 
    const {rows} = await pool.query("SELECT * FROM messages;");
    return rows;
}


async function getAllUsers() {
    const {rows} = await pool.query("SELECT * FROM users;");
    return rows;

}

async function getAllMessagesWithAuthors() { 
    const {rows} = await pool.query(`
        SELECT messages.id,messages.title,messages.text,messages.timestamp, users.username,users.first_name,users.last_name
        FROM messages
        JOIN users 
        ON messages.user_id = users.id
        ORDER BY messages.timestamp DESC;`);
    
    return rows;
}

async function getUserById(id) {
    // for passport deserialise  middleware to grab user and store info in req
    const {rows} = await pool.query("SELECT * FROM users WHERE id = $1;", [id]);

    return rows[0];
   

}

async function getUserByUsername(username) {
     // for logging in as user only enters username 
        console.log("getUserByUsername called with:", JSON.stringify(username));
         const {rows} = await pool.query("SELECT * FROM users WHERE username = $1;", [username]);
         console.log("Rows found:", rows);
        return rows[0];
}


async function getMessagebyId(messageId) { 

      const {rows} = await pool.query("SELECT * FROM messages WHERE id = $1;", [messageId]);

    return rows[0];

}

async function createUser(first_name,last_name, username, password) {

        const {rows} = await pool.query(`INSERT INTO users (first_name,last_name,username,password)
            VALUES($1,$2,$3,$4);`, [first_name,last_name,username,password]);

        return rows[0];
        
}

async function createMessage(title,text,userId) { 
    await pool.query(`INSERT INTO messages (title,text,user_id)
        VALUES($1,$2,$3);`,[title,text,userId]);
    
}

async function makeMember(userId) {
  await pool.query(
    "UPDATE users SET membership_status = true WHERE id = $1;",
    [userId]
  );


}

async function deleteMessage(id) {
  await pool.query("DELETE FROM messages WHERE id = $1;", [id]);
}

async function makeAdmin(userId) {
  await pool.query(
    "UPDATE users SET is_admin = true WHERE id = $1;",
    [userId]
  );
}


module.exports = { 
    getAllMessages,
    getAllUsers,
    getAllMessagesWithAuthors,
    getUserById,
    getUserByUsername,
    getMessagebyId,
    createUser,
    createMessage,
    makeMember,
    deleteMessage,
    makeAdmin,
  
}