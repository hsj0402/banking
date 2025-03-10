const express = require("express");
const router = express.Router();
const { getUsers, getAccounts } = require("../db");

router.post("/:role/login", (req, res) => {
    const { role } = req.params;
    const { email, password } = req.body;

    const credentials = {
        customer: { email: "customer@example.com", password: "12345" },
        banker: { email: "banker@example.com", password: "12345" },
    };

    if (!credentials[role]) {
        return res.status(400).json({ message: "Invalid role", status: "error" });
    }

    if (email === credentials[role].email && password === credentials[role].password) {
        return res.json({ message: "Login successful", status: "success", role });
    } else {
        return res.status(401).json({ message: "Invalid credentials", status: "error" });
    }
});

router.get('/users', (req, res) => {
    getUsers((err, users) => {
        if (err) {
            return res.status(500).json({ error: "Database error", details: err });
        }
        res.json(users);
    });
});

router.get('/accounts', (req, res) => {
    getAccounts((err, accounts) => {
        if (err) {
            return res.status(500).json({ error: "Database error", details: err });
        }
        res.json(accounts);
    });
});

router.post("/transactions", (req, res) => {
    const { account_id, transaction_type, amount } = req.body;

    if (!account_id || !transaction_type || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: "Invalid transaction data" });
    }

    const insertTransaction = `INSERT INTO transactions (account_id, transaction_type, amount) VALUES (?, ?, ?)`;

    connection.query(insertTransaction, [account_id, transaction_type, amount], (err, result) => {
        if (err) return res.status(500).json({ error: "Transaction error" });

        const updateBalance = transaction_type === "deposit"
            ? `UPDATE accounts SET balance = balance + ? WHERE id = ?`
            : `UPDATE accounts SET balance = balance - ? WHERE id = ?`;

        connection.query(updateBalance, [amount, account_id], (err) => {
            if (err) return res.status(500).json({ error: "Balance update error" });

            res.status(201).json({ message: "Transaction successful", transaction_id: result.insertId });
        });
    });
});


module.exports = router;
