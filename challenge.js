// Configuration object for API request
const weatherConfig = {
    latitude: 27.7017,
    longitude: 85.3206,
    daily: [
        "temperature_2m_max",
        "temperature_2m_min",
        "rain_sum",
        "snowfall_sum",
        "windspeed_10m_max",
        "precipitation_hours"
    ],
    timezone: "Asia/Singapore"
};

// Convert config object into query string
const apiQuery = new URLSearchParams(weatherConfig).toString();
const weatherURL = `https://api.open-meteo.com/v1/forecast?${apiQuery}`;

// Fetch weather data from Open-Meteo API
async function getWeatherData() {
    try {
        const res = await fetch(weatherURL);

        if (!res.ok) {
            throw new Error(`Request failed with status ${res.status}`);
        }

        const result = await res.json();
        const dailyInfo = result.daily;

        // Return only the required fields in a clean object
        return {
            dates: dailyInfo.time,
            maxTemp: dailyInfo.temperature_2m_max,
            minTemp: dailyInfo.temperature_2m_min,
            rain: dailyInfo.rain_sum,
            snow: dailyInfo.snowfall_sum,
            wind: dailyInfo.windspeed_10m_max
        };
    } catch (err) {
        console.error("Unable to load weather data:", err);
    }
}

// Convert date into weekday name
function convertToDay(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        weekday: "long"
    });
}

// Decide weather condition based on values
function decideCondition(rain, snow, wind) {
    if (rain > 0) return "Rainy";
    if (snow > 0) return "Snowy";
    if (wind > 15) return "Windy";
    return "Sunny";
}

// Generate weekly weather summary
async function showWeeklyForecast() {
    const forecast = await getWeatherData();
    if (!forecast) return;

    const weeklyReport = forecast.dates.map((date, i) => {
        const dayName = convertToDay(date);

        const high = Math.round(forecast.maxTemp[i]);
        const low = Math.round(forecast.minTemp[i]);

        const condition = decideCondition(
            forecast.rain[i],
            forecast.snow[i],
            forecast.wind[i]
        );

        return `${dayName}: ${high}°C / ${low}°C (${condition})`;
    });

    console.log(weeklyReport);
}

// Run the program
showWeeklyForecast();
