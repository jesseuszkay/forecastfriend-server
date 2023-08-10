const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");
const PORT = 8080;

app.use(cors());

app.get("/api/home", (req, res) => {
  res.json({ message: "Howdy!", people: ["It works!?!?!", "Jesse", "Autumn"] });
});

app.get("/weather", (req, res) => {
  axios
    .get(
      "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true"
    )
    .then((response) => {
      const timestamp = Date.now();
      const weatherData = { weather: response.data, timestamp: timestamp };
      res.json(weatherData);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
