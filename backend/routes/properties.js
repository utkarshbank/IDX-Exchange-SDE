const express = require("express");
const router = express.Router();
const pool = require("../db");

const ID_REGEX = /^[A-Za-z0-9_-]{1,50}$/;

router.get("/", async (req, res) => {
  let { city, zipcode, minPrice, maxPrice, beds, baths, limit, offset } = req.query;

  limit = limit !== undefined ? Number(limit) : 20;
  offset = offset !== undefined ? Number(offset) : 0;

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    return res.status(400).json({ error: "limit must be an integer between 1 and 100" });
  }
  if (!Number.isInteger(offset) || offset < 0) {
    return res.status(400).json({ error: "offset must be a non-negative integer" });
  }

  const conditions = [];
  const values = [];

  if (city !== undefined) {
    conditions.push("LOWER(TRIM(L_City)) = LOWER(TRIM(?))");
    values.push(city);
  }
  if (zipcode !== undefined) {
    conditions.push("L_Zip = ?");
    values.push(zipcode);
  }
  if (minPrice !== undefined) {
    const n = Number(minPrice);
    if (Number.isNaN(n)) return res.status(400).json({ error: "minPrice must be a number" });
    conditions.push("L_SystemPrice >= ?");
    values.push(n);
  }
  if (maxPrice !== undefined) {
    const n = Number(maxPrice);
    if (Number.isNaN(n)) return res.status(400).json({ error: "maxPrice must be a number" });
    conditions.push("L_SystemPrice <= ?");
    values.push(n);
  }
  if (beds !== undefined) {
    const n = Number(beds);
    if (Number.isNaN(n)) return res.status(400).json({ error: "beds must be a number" });
    conditions.push("L_Keyword2 = ?");
    values.push(n);
  }
  if (baths !== undefined) {
    const n = Number(baths);
    if (Number.isNaN(n)) return res.status(400).json({ error: "baths must be a number" });
    conditions.push("LM_Dec_3 = ?");
    values.push(n);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  try {
    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM rets_property ${whereClause}`,
      values
    );
    const total = countRows[0].total;

    const [results] = await pool.query(
      `SELECT * FROM rets_property ${whereClause} LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );

    res.json({ total, limit, offset, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Must be registered BEFORE "/:id"
router.get("/:id/openhouses", async (req, res) => {
  const { id } = req.params;
  if (!ID_REGEX.test(id)) {
    return res.status(400).json({ error: "Invalid listing ID format" });
  }

  try {
    const [props] = await pool.query(
      "SELECT L_ListingID FROM rets_property WHERE L_ListingID = ? LIMIT 1",
      [id]
    );
    if (props.length === 0) {
      return res.status(404).json({ error: `No property found with listing ID ${id}` });
    }

    const [rows] = await pool.query(
      "SELECT * FROM rets_openhouse WHERE L_ListingID = ? ORDER BY OpenHouseDate, OH_StartTime",
      [id]
    );
    res.json(rows);
  } catch (err) {
    console.error("openhouses error for", id, err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!ID_REGEX.test(id)) {
    return res.status(400).json({ error: "Invalid listing ID format" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM rets_property WHERE L_ListingID = ? LIMIT 1",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: `No property found with listing ID ${id}` });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;