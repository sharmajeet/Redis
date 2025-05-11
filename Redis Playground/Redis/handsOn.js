// const {client} = require('./client');
const express = require('express');
const axios = require('axios').default;
const client = require('./client');

const app = express();


app.get('/' , async (req, res) => {

    const cacheData = await client.get('weather');
    if (cacheData) {
        console.log("Cache hit");
        return res.json(JSON.parse(cacheData));
    }

    console.log("Cache miss");
    // Fetch data from the API
     console.log("Fetching data from API");
     // const { data } = await axios.get('https://jsonplaceholder.typicode.com/todos/1')
     // return res.json(data);
     // Fetching all the todos
    const { data } = await axios.get('https://historical-forecast-api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&start_date=2025-04-24&end_date=2025-05-08&hourly=temperature_2m,weather_code,pressure_msl,surface_pressure,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,soil_temperature_0cm')
    // Set the data in Redis with an expiry time of 10 seconds
    await client.set('weather', JSON.stringify(data));
    await client.expire('weather', 6000);

    return res.json(data);
});


app.listen(3000, () => {
    console.log("Server is running on port 3000");
}
);