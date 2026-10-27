// require("dotenv").config();
//Steps to separate script from project.
//1. remove dotenv to prevent script fom reading from env

const { Client } = require("pg");

const SQL = `CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  part_name VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NOT NULL
);

INSERT INTO items (part_name, brand)
VALUES
  ('11-speed chain', 'Shimano'),
  ('Inner tube 700x25c', 'Continental');
`;

async function main() {

     const connectionString = process.argv[2];
    // 2.connection string is now from the argv array which will be a url 
    // inserted when calling the script

if (!connectionString) { 
       console.error("Usage: node db/populatedb.js <database-url>");
       process.exit(1);
}
//3. argv has the first 2 items in array filled in automatically (path to node, path to script,), 
// we create the 3 entry to tell script which database to connect to.

  console.log("seeding...");
  
const client = new Client({ connectionString });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();