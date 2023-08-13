const express = require("express");
const app = express();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("weather.db");
const axios = require("axios");
const cors = require("cors");
const PORT = 8080;

app.use(cors());
app.use(express.json());

db.run(`
  CREATE TABLE IF NOT EXISTS weather_snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    temperature REAL,
    weathercode INTEGER,
    timestamp TEXT
  )
`);

app.get("/weather", (_req, res) => {
  axios
    .get(
      "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true"
    )
    .then((response) => {
      const timestamp = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(Date.now());
      const weatherData = { weather: response.data, timestamp: timestamp };
      res.json(weatherData);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/historical", (_req, res) => {
  axios
    .get(
      "https://api.open-meteo.com/v1/dwd-icon?latitude=52.52&longitude=13.41&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=GMT&past_days=5"
    )
    .then((response) => {
      const historicalData = response.data;
      res.json(historicalData);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/snapshots", (_req, res) => {
  const query =
    "SELECT * FROM weather_snapshots ORDER BY timestamp DESC LIMIT 5";

  db.all(query, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Failed to retrieve readings" });
    }
    return res.status(200).json(rows);
  });
});

app.post("/snapshots", (req, res) => {
  const { temperature, weathercode, timestamp } = req.body;
  const query =
    "INSERT INTO weather_snapshots (temperature, weathercode, timestamp) VALUES (?, ?, ?)";

  db.run(query, [temperature, weathercode, timestamp], (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to store reading" });
    }
    return res.status(200).json({ message: "Reading stored successfully" });
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
