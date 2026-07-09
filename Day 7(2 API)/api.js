export async function fetchgcs(city) {
    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json`
    );

    if (!response.ok) {
        throw new Error(response.status);
    }

    return response.json();
}

export async function fetchWeather(latitude, longitude) {
    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );

    if (!response.ok) {
        throw new Error(response.status);
    }

    return response.json();
}