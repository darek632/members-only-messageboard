// require("dotenv").config();
//Steps to separate script from project.
//1. remove dotenv to prevent script fom reading from env

const { Client } = require("pg");

const SQL = `CREATE TABLE users (
  id          INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name  VARCHAR(255) NOT NULL,
  last_name   VARCHAR(255) NOT NULL,
  username    VARCHAR(255) NOT NULL UNIQUE,   
  password    VARCHAR(255) NOT NULL,          
  membership_status BOOLEAN DEFAULT false,
  is_admin BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE messages (
  id         INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title      VARCHAR(255) NOT NULL,
  text       TEXT NOT NULL,
  timestamp  TIMESTAMPTZ DEFAULT NOW(),
  user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (first_name, last_name, username, password, membership_status)
VALUES
  ('Ted', 'Tetley', 'tetleyted', '1234', true),
  ('Sara', 'Lopez', 'lopeysara', '1234', false),
  ('Ben', 'Okafor', 'okben', '1234', true);

INSERT INTO messages (title, text, user_id)
VALUES
  ('Hello world', 'First message on the board!', 1),
  ('Tea recommendations?', 'Looking for a good breakfast tea.', 1),
  ('New here', 'Just joined, hi everyone.', 2),
  ('Members only', 'Glad to finally be a member.', 3),
  ('Weekend plans', 'Anyone going hiking on Saturday?', 3);
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