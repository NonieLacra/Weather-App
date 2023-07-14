import { useState } from 'react';
import './App.css';
import searchIcon from './resources/search-icon.png';
import sunny from './resources/sunny.jpg';
import cloudy from './resources/cloudy.jpg';
import rainy from './resources/rainy.jpg';
import storm from './resources/storm.jpg';
import snow from './resources/snow.jpg';
import mist from './resources/mist.jpg';
import sunnyIcon from './resources/sunny-icon.png';
import cloudyIcon from './resources/cloudy-icon.png';
import rainyIcon from './resources/rainy-icon.png';
import stormIcon from './resources/storm-icon.png';
import snowIcon from './resources/snow-icon.png';
import mistIcon from './resources/mist-icon.png';
import { getApiOptions, GEO_API_URL, WEATHER_API_KEY, WEATHER_API_URL } from './api';

function App() {
  const [search, setSearch] = useState('');
  const [weather, setWeather] = useState({});
  const [backgroundImage, setBackgroundImage] = useState('');
  const [weatherIcon, setWeatherIcon] = useState('');

  const convertUnixTo12Hrs = (unixTimestamp) => {
    const dateObj = new Date(unixTimestamp * 1000);
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const amPm = hours >= 12 ? 'PM' : 'AM';
    const twelveHourFormat = ((hours + 11) % 12) + 1;

    return `${twelveHourFormat}:${minutes < 10 ? '0' + minutes : minutes} ${amPm}`;
  };

  const getDayOfWeek = (unixTimestamp) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dateObj = new Date(unixTimestamp * 1000);
    const dayIndex = dateObj.getDay();

    return daysOfWeek[dayIndex];
  };

  const searchPressed = () => {
    return fetch(`${GEO_API_URL}/cities?minPopulation=100000&namePrefix=${search}`, getApiOptions)
      .then((res) => res.json())
      .then((res) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const city = res.data[0];
          const latitude = city.latitude;
          const longitude = city.longitude;

          return fetch(
            `${WEATHER_API_URL}/weather?lat=${latitude}&lon=${longitude}&exclude=hourly&units=metric&appid=${WEATHER_API_KEY}`
          )
            .then((res) => res.json())
            .then((result) => {
              console.log(result)
              const convertedSunrise = convertUnixTo12Hrs(result.sys.sunrise);
              const convertedSunset = convertUnixTo12Hrs(result.sys.sunset);
              const convertedCurrentTime = convertUnixTo12Hrs(result.dt)
              const dayOfWeek = getDayOfWeek(result.dt);
              const weatherType = result.weather[0].main;

              result.sys.sunriseConverted = convertedSunrise;
              result.sys.sunsetConverted = convertedSunset;
              result.coord.currentTimeConverted = convertedCurrentTime
              result.dayOfWeek = dayOfWeek;
              result.weather[0].main = weatherType;

              if (weatherType === 'Clear') {
                setBackgroundImage(sunny);
                setWeatherIcon(sunnyIcon);
              } else if (
                weatherType === 'Clouds'
              ) {
                setBackgroundImage(cloudy);
                setWeatherIcon(cloudyIcon);
              } else if(
                weatherType === 'Rain'
              )
              {
                setBackgroundImage(rainy);
                setWeatherIcon(rainyIcon)
              }
              else if(
                weatherType === 'Thunderstorm'
              )
              {
                setBackgroundImage(storm);
                setWeatherIcon(stormIcon);
              }
              else if(
                weatherType === 'Snow'
              )
              {
                setBackgroundImage(snow);
                setWeatherIcon(snowIcon)
              }
              else if(
                weatherType === 'Mist'
              )
              {
                setBackgroundImage(mist);
                setWeatherIcon(mistIcon)
              }
              else{
                setBackgroundImage(sunny);
                setWeatherIcon(sunnyIcon);
              }
                
              

              setWeather(result);
            });
        } else {
          console.log('No matching city found');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  
  



  return (
    <div className="App" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <header className="App-header">
        <div className="search">
          <input
            type="text"
            className="search-bar"
            placeholder="Enter Location"
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="search-btn" onClick={searchPressed}>
            <img src={searchIcon} className="search-icon" alt="Search" />
          </button>
        </div>

        {typeof weather.main !== 'undefined' ? (
          <div className="main">
            
            <div className="main-info">

              <div className='location-stats'>
                <div className="location">
                  {weather.name}, {weather.sys.country}
                </div>

                <div className="current-time">
                  {weather.coord.currentTimeConverted}, {weather.dayOfWeek}
                </div>
              </div>
            
            
              <div className="temperature">
                <img src={weatherIcon} className='weather-icon'/>
                {weather.main.temp} °C
              </div>

              <div className="weather">
                {weather.weather[0].description.toUpperCase()}
              </div>

            </div>

            <div className="other-info">
              <div className="feels-like">
                {weather.main.feels_like} °C
                <p>Feels Like</p>
              </div>

              <div className="humidity">
                {weather.main.humidity}%
                <p>Humidity</p>
              </div>

              <div className="wind-speed">
                {weather.wind.speed} KM/H
                <p>Wind Speed</p>
              </div>

              <div className="sunrise">
              {weather.sys.sunriseConverted}
              <p>Sunrise</p>
              </div>

              <div className="sunset">
              {weather.sys.sunsetConverted}
              <p>Sunset</p>
              </div>

            </div>

          </div>
        ) 
        : 
        (
          ''
        )
        }
      </header>
    </div>
  );
}

export default App;
