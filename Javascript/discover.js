// WEATHER API
async function athens_weather() {
    // Athens coordinates
    const latitude = 37.9838;
    const longitude = 23.7275;
    
    // Open-Meteo URL - making the request
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`;

    const weather_description = document.querySelector('#weather-description');
    const weather_temperature = document.querySelector('#weather-temperature');
    const weather_icon = document.querySelector('#weather-icon');

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        //temperature and weather code
        const temp = Math.round(data.current.temperature_2m);
        const code = data.current.weather_code;

        let condition = "Clear";
        let iconClass = "bi-sun";

        if (code === 0) { 
            condition = "Clear Sky"; 
            iconClass = "bi-sun"; 
        }
        else if (code >= 1 && code <= 3) { 
            condition = "Cloudy"; 
            iconClass = "bi-clouds"; 
        }
        else if (code >= 45 && code <= 48) { 
            condition = "Foggy"; 
            iconClass = "bi-cloud-haze"; 
        }
        else if (code >= 51 && code <= 67) { 
            condition = "Rainy"; 
            iconClass = "bi-cloud-rain"; 
        }
        else if (code >= 71 && code <= 77) { 
            condition = "Snowy"; 
            iconClass = "bi-snow"; 
        }
        else if (code >= 95 && code <= 99) { 
            condition = "Thunderstorms"; 
            iconClass = "bi-cloud-lightning-rain"; 
        }

        weather_temperature.textContent = temp + '°C';
        weather_description.textContent = condition;
        weather_icon.className = `bi ${iconClass}`;

    } catch (error) {
        console.error("Error fetching weather:", error);
        weather_description.textContent = "Weather unavailable";
        weather_icon.className = "bi bi-cloud-slash";
    }
}

document.addEventListener("DOMContentLoaded", athens_weather);