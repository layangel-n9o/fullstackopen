import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(false)
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY

  useEffect(() => {
    if (!apiKey || !capital) return

    let active = true
    setWeather(null)
    setError(false)

    axios
      .get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          q: capital,
          units: 'metric',
          appid: apiKey,
        },
      })
      .then((response) => {
        if (active) {
          setWeather(response.data)
        }
      })
      .catch(() => {
        if (active) {
          setError(true)
        }
      })

    return () => {
      active = false
    }
  }, [capital, apiKey])

  if (!apiKey) {
    return <p>Set VITE_WEATHER_API_KEY in a .env file to see the weather.</p>
  }

  if (error) {
    return <p>Could not load weather for {capital}.</p>
  }

  if (!weather) {
    return <p>Loading weather...</p>
  }

  const icon = weather.weather[0].icon

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>temperature {weather.main.temp} Celsius</p>
      <img
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt={weather.weather[0].description}
      />
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

export default Weather
