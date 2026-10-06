require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");
const propertiesRoutes = require("./routes/properties");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/properties", propertiesRoutes);

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", database: "disconnected" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));