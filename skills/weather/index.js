const process = require('process');

const args = process.argv.slice(2);
const location = args.join(' ');

if (!location) {
    console.error("Usage: node index.js <location>");
    process.exit(1);
}

async function getWttr(loc) {
    try {
        const url = `https://wttr.in/${encodeURIComponent(loc)}?format=j1`;
        const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        
        const current = data.current_condition[0];
        const temp = current.temp_C;
        const desc = current.weatherDesc[0].value;
        const humidity = current.humidity;
        const wind = current.windspeedKmph;
        
        return `🌦️ **Weather for ${loc} (wttr.in)**\n` +
               `- Temp: ${temp}°C\n` +
               `- Condition: ${desc}\n` +
               `- Humidity: ${humidity}%\n` +
               `- Wind: ${wind} km/h`;
    } catch (e) {
        // console.error(`wttr.in failed: ${e.message}`);
        return null;
    }
}

async function getOpenMeteo(loc) {
    try {
        // 1. Geocode
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(loc)}&count=1&language=en&format=json`;
        const geoRes = await fetch(geoUrl, { signal: AbortSignal.timeout(5000) });
        const geoData = await geoRes.json();
        
        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("Location not found");
        }
        
        const { latitude, longitude, name, country } = geoData.results[0];
        
        // 2. Weather
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
        const weatherRes = await fetch(weatherUrl, { signal: AbortSignal.timeout(5000) });
        const weatherData = await weatherRes.json();
        
        const w = weatherData.current_weather;
        
        // Weather Code Interpretation (Simplified)
        const codes = {
            0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
            45: 'Fog', 48: 'Depositing rime fog',
            51: 'Drizzle: Light', 53: 'Drizzle: Moderate', 55: 'Drizzle: Dense',
            61: 'Rain: Slight', 63: 'Rain: Moderate', 65: 'Rain: Heavy',
            71: 'Snow: Slight', 73: 'Snow: Moderate', 75: 'Snow: Heavy',
            80: 'Rain showers: Slight', 81: 'Rain showers: Moderate', 82: 'Rain showers: Violent',
            95: 'Thunderstorm'
        };
        const condition = codes[w.weathercode] || `Code ${w.weathercode}`;
        
        return `🌍 **Weather for ${name}, ${country} (Open-Meteo)**\n` +
               `- Temp: ${w.temperature}°C\n` +
               `- Condition: ${condition}\n` +
               `- Wind: ${w.windspeed} km/h`;
        
    } catch (e) {
        // console.error(`Open-Meteo failed: ${e.message}`);
        return null;
    }
}

async function run() {
    // Try wttr.in first
    let result = await getWttr(location);
    if (result) {
        console.log(result);
        return;
    }
    
    // Fallback
    console.log("⚠️ wttr.in failed, switching to Open-Meteo...");
    result = await getOpenMeteo(location);
    
    if (result) {
        console.log(result);
    } else {
        console.error("❌ All weather services failed.");
        process.exit(1);
    }
}

run();
