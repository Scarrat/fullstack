import axios from 'axios'
const apikey = import.meta.env.VITE_SOME_KEY

const getWeather = (lat,lon) => {
    const request = axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`)
    return request.then(response => response.data)
  }
  
  
  export default { 
    getWeather: getWeather
  }