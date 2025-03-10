// const mysql = require('mysql2');

// const connection = mysql.createPool({
//     host: "127.0.0.1",
//     port: 3306,
//     user: "root",
//     password: "(b)y(17~DZN4",
//     database: "bank",
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });

// const getUsers = (callback) => {
//     connection.query("SELECT * FROM users", (err, results) => {
//         if (err) return callback(err, null);
//         callback(null, results);
//     });
// };

// const getAccounts = (callback) => {
//     connection.query("SELECT * FROM accounts", (err, results) => {
//         if (err) return callback(err, null);
//         callback(null, results);
//     });
// };

// module.exports = { getUsers, getAccounts };


const mysql = require("mysql2");

// Create MySQL Connection Pool
const connection = mysql.createPool({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "(b)y(17~DZN4",
    database: "bank",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ✅ Connect & Create Tables
connection.getConnection((err, conn) => {
    if (err) {
        console.error("❌ Error connecting to MySQL:", err);
        return;
    }
    console.log("✅ Connected to MySQL");

    const createUsersTable = `
        CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('customer', 'banker') NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    const createAccountsTable = `
        CREATE TABLE accounts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            transaction_type ENUM('deposit', 'withdrawal') NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `;

    conn.query(createUsersTable, (err) => {
        if (err) return console.error("❌ Error creating Users table:", err);
        console.log("✅ Users table created successfully");
    });

    conn.query(createAccountsTable, (err) => {
        if (err) return console.error("❌ Error creating Accounts table:", err);
        console.log("✅ Accounts table created successfully");
    });

    const insertUsers = `
        INSERT INTO users (name, email, password, role) VALUES
        ('John Doe', 'customer@example.com', '12345', 'customer'),
        ('Alice Smith', 'banker@example.com', '67890', 'banker')
        ON DUPLICATE KEY UPDATE email=email;
    `;

    conn.query(insertUsers, (err) => {
        if (err) return console.error("❌ Error inserting users:", err);
        console.log("✅ Example users inserted successfully");

        conn.query("SELECT id, role FROM users", (err, users) => {
            if (err) {
                console.error("❌ Error fetching users:", err);
                return conn.release();
            }

            if (users.length === 0) {
                console.log("⚠️ No users found. Insert users first.");
                return conn.release();
            }

            const customer = users.find(user => user.role === 'customer');
            const banker = users.find(user => user.role === 'banker');

            if (!customer || !banker) {
                console.log("⚠️ Required user roles not found.");
                return conn.release();
            }

            const insertTransactions = `
                INSERT INTO accounts (user_id, transaction_type, amount) VALUES
                (${customer.id}, 'deposit', 500.00),
                (${customer.id}, 'withdrawal', 200.00),
                (${banker.id}, 'deposit', 1000.00),
                (${banker.id}, 'withdrawal', 300.00);
            `;

            conn.query(insertTransactions, (err) => {
                if (err) {
                    console.error("❌ Error inserting transactions:", err);
                    return conn.release();
                }
                console.log("✅ Example transactions inserted successfully");

                conn.release();
            });
        });
    });
});

// ✅ Fetch Users
const getUsers = (callback) => {
    connection.query("SELECT * FROM users", (err, results) => {
        if (err) return callback(err, null);
        callback(null, results);
    });
};

// ✅ Fetch Accounts
const getAccounts = (callback) => {
    connection.query("SELECT * FROM accounts", (err, results) => {
        if (err) return callback(err, null);
        callback(null, results);
    });
};

// ✅ Export Functions
module.exports = { getUsers, getAccounts, connection };
