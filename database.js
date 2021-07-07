const sql = require("sqlite3").verbose();

const md5 = require("md5");

const DBSOURCE = "db.sqlite";

let db = new sql.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected to SQLite Database");
    db.run(
      `CREATE TABLE user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name text, 
        email text UNIQUE, 
        password text, 
        CONSTRAINT email_unique UNIQUE (email)
      )`,
      (err) => {
        if (err) {
          console.log("Table not created");
        } else {
          console.log("Table Created");
          var insert =
            "INSERT INTO user (name, email, password) VALUES (?,?,?)";
          db.run(insert, ["admin", "admin@example.com", md5("admin123456")]);
          db.run(insert, ["user", "user@example.com", md5("user123456")]);
        }
      }
    );
  }
});

module.exports = db
