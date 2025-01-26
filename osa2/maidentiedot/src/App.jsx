import { useState, useEffect } from 'react'
import countryService from './services/countries'
import weatherService from './services/weather'

const SearchForm = ({ handleChange, countryName }) => {
  return (
    <form>
      <div>
        find countries: <input value={countryName} onChange={handleChange} />
      </div>
    </form>
  )
}

const CountryList = ({ countries, countryName, handleShow, weather }) => {
  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(countryName.toLowerCase())
  )

  if (filteredCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (filteredCountries.length === 1) {
    return <CountryInfo country={filteredCountries[0]} weather={weather} />
  }

  return (
    <div>
      {filteredCountries.map(country => (
        <div key={country.name.common}>
          {country.name.common}
          <button onClick={() => handleShow(country.name.common)}>show</button>
        </div>
      ))}
    </div>
  )
}

const CountryInfo = ({ country, weather }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <h3>languages</h3>
      <ul>
        {Object.values(country.languages).map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} width="200" />
      <WeatherInfo weather={weather} capital={country.capital} />
    </div>
  )
}

const WeatherInfo = ({ weather, capital }) => {
  if (!weather) {
    return <p>Loading weather data...</p>
  }
  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>temperature: {(weather.main.temp - 273.15).toFixed(2)} Celsius</p>
      <img src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`}/>
      <p>wind: {weather.wind.speed} m/s</p>
    </div>
  )
}

const App = () => {
  const [countryName, setCountryName] = useState('')
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const filteredCountries = countries.filter(country =>
      country.name.common.toLowerCase().includes(countryName.toLowerCase())
    )
    
    if (filteredCountries.length === 1) {
      setSelectedCountry(filteredCountries[0])
    } else {
      setSelectedCountry(null)
      setWeather(null)
    }
  }, [countries, countryName])

  useEffect(() => {
    if (selectedCountry) {
      const [lat, lng] = selectedCountry.capitalInfo.latlng
      weatherService
        .getWeather(lat, lng)
        .then(weatherData => setWeather(weatherData))
    }
  }, [selectedCountry])

  const handleChange = (event) => {
    setCountryName(event.target.value)
    countryService
      .getAll()
      .then(countries => setCountries(countries))
  }

  const handleShow = (name) => {
    setCountryName(name)
    const matchingCountry = countries.find(
      country => country.name.common.toLowerCase() === name.toLowerCase()
    )
    setSelectedCountry(matchingCountry)
    setWeather(null)
  }

  

  return (
    <div>
      <SearchForm handleChange={handleChange} countryName={countryName} />
      <CountryList
        countries={countries}
        countryName={countryName}
        handleShow={handleShow}
        weather={weather}
      />
    </div>
  )
}

export default App
