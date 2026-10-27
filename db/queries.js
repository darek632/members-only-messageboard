const pool = require("./pool");

async function getAllItems() { 
    const {rows} = await pool.query("SELECT * FROM items");
    return rows;
}

async function insertItem(partName, brand) {
     await pool.query("INSERT INTO items (part,brand) VALUES ($1, $2)", [partName,brand]);
 }

module.exports = { 
    getAllItems,
    insertItem,
}