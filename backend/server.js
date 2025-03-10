const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");

app.use("/api", authRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to the Banking Backend!");
});

app.get("/api/data", (req, res) => {
    res.json({ message: "Hello from the API", status: "success" });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});