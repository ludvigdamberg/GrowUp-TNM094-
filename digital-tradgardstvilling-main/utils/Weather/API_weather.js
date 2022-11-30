/*
    Kräver platsinformation för att hämta väder
    Denna funktion behöver inte hämtas flera gånger under ett kortare intervall

    Använd gärna getWeatherInfo.js ifall du vill hämta väderinformation istället för dessa funktioner!
*/
import axios from "axios";

export async function API_getWeatherInfo() {

    console.log("Updated weather with API call")

    //Get location
    const latitude = 58.5892;
    const longitude = 16.1871;

    //API Call
    const link = 'https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&hourly=temperature_2m,weathercode&current_weather=true'
    const result = axios.get(link);

    return result;
}

export function setWeatherLocalStorage(temperature, weatherCode, updateTime) {

    //Set new Local Storage for temperature, weatherCode, and the timestamp of when this info was last updated
    localStorage.setItem('Temperature', temperature)
    localStorage.setItem('WeatherCode', weatherCode)
    localStorage.setItem('LastWeatherUpdateTime', updateTime)
}

export function getWeatherLocalStorage() {

    //Get local storage
    const temperature = localStorage.getItem("Temperature")
    const weatherCode = localStorage.getItem("WeatherCode")
    const updateTime = localStorage.getItem("LastWeatherUpdateTime")
  
    //Check if it's time to update
    const updateInterval = 5 * 60 * 1000  //5 minutes in milliseconds
    const timeForUpdate = parseInt(updateTime) + updateInterval;    //Time of when the local storage is "old"
  
    var result; //return in format [temperature, weatherCode]
  
    if(Date.now() > timeForUpdate)
    {
      result = [null, null]
    }
    else
    {
      result = [temperature, weatherCode]
    }
    
    console.log("Fetched local storage info and got: " + result[0] + " " + result[1])
  
    return result;
  }