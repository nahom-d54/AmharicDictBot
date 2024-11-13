const sqlite3 = require("sqlite3").verbose();

class Database {
  constructor() {
    this.db = new sqlite3.Database("botdb.sqlite", (err) => {
      if (err) {
        console.error("Could not connect to database", err);
      } else {
        console.log("Connected to database");
      }
    });
  }

  createTables() {
    const userTable = `
      CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY,
        user_name TEXT
      )
    `;

    const languageChoiceTable = `
      CREATE TABLE IF NOT EXISTS language_choices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        from_language TEXT,
        to_language TEXT,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      )
    `;

    const botLanguageChoiceTable = `
      CREATE TABLE IF NOT EXISTS bot_language_choices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        language TEXT,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      )
    `;

    const responseLanguageChoiceTable = `
      CREATE TABLE IF NOT EXISTS response_language_choices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        language TEXT,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      )
    `;

    this.db.run(userTable, (err) => {
      if (err) {
        console.error("Could not create users table", err);
      } else {
        console.log("Users table created or already exists");
      }
    });

    this.db.run(languageChoiceTable, (err) => {
      if (err) {
        console.error("Could not create language choices table", err);
      } else {
        console.log("Language choices table created or already exists");
      }
    });

    this.db.run(botLanguageChoiceTable, (err) => {
      if (err) {
        console.error("Could not create bot language choices table", err);
      } else {
        console.log("Bot language choices table created or already exists");
      }
    });

    this.db.run(responseLanguageChoiceTable, (err) => {
      if (err) {
        console.error("Could not create response language choices table", err);
      } else {
        console.log(
          "Response language choices table created or already exists"
        );
      }
    });
  }

  saveUser(userId, userName) {
    const insert = `INSERT INTO users (user_id, user_name) VALUES (?, ?)
                    ON CONFLICT(user_id) DO UPDATE SET user_name=excluded.user_name`;
    this.db.run(insert, [userId, userName], (err) => {
      if (err) {
        console.error("Could not insert or update user", err);
      } else {
        console.log("User saved");
      }
    });
  }

  updateLanguageChoice(userId, fromLanguage, toLanguage) {
    const update = `UPDATE language_choices SET from_language = ?, to_language = ? WHERE user_id = ?`;
    const dbInstance = this.db;

    this.db.run(update, [fromLanguage, toLanguage, userId], function (err) {
      if (err) {
        console.error("Could not update language choice", err);
      } else if (this.changes === 0) {
        const insert = `INSERT INTO language_choices (user_id, from_language, to_language) VALUES (?, ?, ?)`;
        dbInstance.run(insert, [userId, fromLanguage, toLanguage], (err) => {
          if (err) {
            console.error("Could not insert language choice", err);
          } else {
            console.log("Language choice inserted");
          }
        });
      } else {
        console.log("Language choice updated");
      }
    });
  }

  getUserLanguageChoice(userId, callback) {
    const select = `SELECT from_language, to_language FROM language_choices WHERE user_id = ?`;
    this.db.get(select, [userId], (err, row) => {
      if (err) {
        console.error("Could not retrieve language choice", err);
        callback(null);
      } else {
        callback(
          row
            ? { fromLanguage: row.from_language, toLanguage: row.to_language }
            : null
        );
      }
    });
  }
  getBotLanguageChoice(userId, callback) {
    const select = `SELECT language FROM bot_language_choices WHERE user_id = ?`;
    this.db.get(select, [userId], (err, row) => {
      if (err) {
        console.error("Could not retrieve bot language choice", err);
        callback(null);
      } else {
        console.log(row);
        callback(row ? row.language : null);
      }
    });
  }

  updateBotLanguageChoice(userId, language) {
    const update = `UPDATE bot_language_choices SET language = ? WHERE user_id = ?`;
    const dbInstance = this.db;
    dbInstance.run(update, [language, userId], function (err) {
      if (err) {
        console.error("Could not update bot language choice", err);
      } else if (this.changes === 0) {
        const insert = `INSERT INTO bot_language_choices (user_id, language) VALUES (?, ?)`;
        dbInstance.run(insert, [userId, language], (err) => {
          if (err) {
            console.error("Could not insert bot language choice", err);
          } else {
            console.log("Bot language choice inserted");
          }
        });
      } else {
        console.log("Bot language choice updated");
      }
    });
  }
  updateResponseLanguageChoice(userId, language) {
    const update = `UPDATE response_language_choices SET language = ? WHERE user_id = ?`;
    const dbInstance = this.db;
    const languageString = JSON.stringify(language);
    dbInstance.run(update, [languageString, userId], function (err) {
      if (err) {
        console.error("Could not update response language choice", err);
      } else if (this.changes === 0) {
        const insert = `INSERT INTO response_language_choices (user_id, language) VALUES (?, ?)`;
        dbInstance.run(insert, [userId, languageString], (err) => {
          if (err) {
            console.error("Could not insert response language choice", err);
          } else {
            console.log("Response language choice inserted");
          }
        });
      } else {
        console.log("Response language choice updated");
      }
    });
  }
  getResponseLanguageChoice(userId, callback) {
    const select = `SELECT language FROM response_language_choices WHERE user_id = ?`;
    this.db.get(select, [userId], (err, row) => {
      if (err) {
        console.error("Could not retrieve response language choice", err);
        callback(null);
      } else {
        callback(row ? JSON.parse(row.language) : null);
      }
    });
  }
  getUser(userId, callback) {
    const select = `SELECT user_id, user_name FROM users WHERE user_id = ?`;
    this.db.get(select, [userId], (err, row) => {
      if (err) {
        console.error("Could not retrieve user", err);
        callback(null);
      } else {
        callback(row);
      }
    });
  }
}

module.exports = Database;
