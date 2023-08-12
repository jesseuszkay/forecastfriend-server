const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");
const PORT = 8080;

app.use(cors());

app.get("/weather", (req, res) => {
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

app.get("/historical", (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
