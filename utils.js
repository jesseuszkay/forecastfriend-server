function convertWeatherCode(weathercode) {
  if (weathercode === 0) {
    return "clear skies";
  } else if (weathercode === 1 || weathercode === 2 || weathercode === 3) {
    return "partial clouds";
  } else if (weathercode === 45 || weathercode === 48) {
    return "fog";
  } else if (weathercode === 51 || weathercode === 53 || weathercode === 55) {
    return "a drizzle";
  } else if (weathercode === 56 || weathercode === 57) {
    return "a frozen drizzle";
  } else if (weathercode === 61 || weathercode === 63 || weathercode === 65) {
    return "rain";
  } else if (weathercode === 66 || weathercode === 67) {
    return "frozen rain";
  } else if (weathercode === 71 || weathercode === 73 || weathercode === 75) {
    return "snow";
  } else if (weathercode === 77) {
    return "snow grains";
  } else if (weathercode === 80 || weathercode === 81 || weathercode === 82) {
    return "rain showers";
  } else if (weathercode === 85 || weathercode === 86) {
    return "snow showers";
  } else if (weathercode === 95) {
    return "thunderstorms";
  } else {
    return "thunderstorms with hail ";
  }
}

function getForecastImage(weathercode) {
  if (weathercode === 0) {
    return "/sun.png";
  } else if (
    weathercode === 1 ||
    weathercode === 2 ||
    weathercode === 3 ||
    weathercode === 45 ||
    weathercode === 48
  ) {
    return "/cloud.png";
  } else if (
    weathercode === 71 ||
    weathercode === 73 ||
    weathercode === 75 ||
    weathercode === 77 ||
    weathercode === 85 ||
    weathercode === 86
  ) {
    return "/snow.png";
  } else if (weathercode === 95 || weathercode === 96 || weathercode === 99) {
    return "/thunderstorm.png";
  } else {
    return "/rain.png";
  }
}

module.exports = {
  convertWeatherCode,
  getForecastImage,
};
