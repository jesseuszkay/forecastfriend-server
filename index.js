const express = require("express");
const app = express();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("weather.db");
const axios = require("axios");
const cors = require("cors");
const utils = require("./utils");
const PORT = 8080;

app.use(cors());
app.use(express.json());

db.run(`
  CREATE TABLE IF NOT EXISTS weather_snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    temperature REAL,
    weatherType TEXT,
    forecastImage TEXT,
    timestamp TEXT
  );
`);

db.run(`
  CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    latitude REAL,
    longitude REAL
  );
`);

app.post("/location", express.json(), (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ error: "Latitude and longitude are required" });
  }

  db.run(
    "INSERT INTO locations (latitude, longitude) VALUES (?, ?)",
    [latitude, longitude],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error storing location data" });
      }

      res.json({ message: "Location data stored successfully" });
    }
  );
});

app.get("/locations", (_req, res) => {
  db.get("SELECT * FROM locations ORDER BY id DESC LIMIT 1", (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (!row) {
      return res.status(400).json({ error: "No location data found" });
    }

    res.json(row);
  });
});

app.get("/weather", (_req, res) => {
  db.get("SELECT * FROM locations ORDER BY id DESC LIMIT 1", (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (!row) {
      return res.status(400).json({ error: "No location data found" });
    }

    const { latitude, longitude } = row;

    axios
      .get(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
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

        const weatherType = utils.convertWeatherCode(
          response.data.current_weather.weathercode
        );

        const forecastImage = utils.getForecastImage(
          response.data.current_weather.weathercode
        );

        const weatherData = {
          temperature: response.data.current_weather.temperature,
          weatherType: weatherType,
          forecastImage: forecastImage,
          timestamp: timestamp,
        };
        res.json(weatherData);
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

app.get("/historical", (_req, res) => {
  db.get("SELECT * FROM locations ORDER BY id DESC LIMIT 1", (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (!row) {
      return res.status(400).json({ error: "No location data found" });
    }

    const { latitude, longitude } = row;

    axios
      .get(
        `https://api.open-meteo.com/v1/dwd-icon?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=GMT&past_days=5`
      )
      .then((response) => {
        const allWeatherData = response.data.daily;
        const fiveDayWeather = [];
        for (let i = 0; i < 5; i++) {
          fiveDayWeather.push({
            id: i,
            temp_max: allWeatherData.temperature_2m_max[i],
            temp_min: allWeatherData.temperature_2m_min[i],
            date: allWeatherData.time[i],
            weatherType: utils.convertWeatherCode(
              allWeatherData.weathercode[i]
            ),
            forecastImage: utils.getForecastImage(
              allWeatherData.weathercode[i]
            ),
          });
        }
        res.json(fiveDayWeather);
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

app.get("/snapshots", (_req, res) => {
  const query = "SELECT * FROM weather_snapshots ORDER BY id DESC LIMIT 5";

  db.all(query, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Failed to retrieve readings" });
    }
    return res.status(200).json(rows);
  });
});

app.post("/snapshots", (req, res) => {
  const { temperature, weatherType, forecastImage, timestamp } = req.body;
  const query =
    "INSERT INTO weather_snapshots (temperature, weatherType, forecastImage, timestamp) VALUES (?, ?, ?, ?)";

  db.run(query, [temperature, weatherType, forecastImage, timestamp], (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to store reading" });
    }
    return res.status(200).json({ message: "Reading stored successfully" });
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
