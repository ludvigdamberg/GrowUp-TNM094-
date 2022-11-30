/*
Hämta det nuvarande vädret

Returnerar temperatur samt vilken typ av väder som identifieras av en siffra, t.ex. (2,3 eller 4 = sol), (7,8 eller 9 = regn)

@todo, hämta plats från användarinställningar, t.ex. platstjänst

Exempel på hur man hämtar:
{
  const weather = getWeatherInfo()
  
  const temperature = weather["Temperature"]
  const weatherCode = weather["WeatherCode"]
}

*/
import { useEffect, useState } from "react";

//API funktioner
import { API_getWeatherInfo} from "./API_weather";
import { setWeatherLocalStorage } from "./API_weather";
import { getWeatherLocalStorage } from "./API_weather";

export function getWeatherInfo(){ 

    /* Följande kod kanske flyttas till annan fil*/

    const [result, setResult] = useState({"Temperature": null, "WeatherCode": null})
    const [count, setCount] = useState(0)   //Track updates, skip eventual effects

    const fetchData = () => {

      var temperature_local, weatherCode_local
      [temperature_local, weatherCode_local] = getWeatherLocalStorage()

      if(temperature_local != null && weatherCode_local != null)
      {
        //Update with Local Storage
        setResult({"Temperature": temperature_local, "WeatherCode": weatherCode_local})
      }
      else
      {
        //Update with New API call
        Promise.all([API_getWeatherInfo()])
          .then((response) => {
            
            const temperature = response[0].data.current_weather.temperature;
            const weatherCode = response[0].data.current_weather.weathercode;

            //Update state variable
            setResult({"Temperature": temperature, "WeatherCode": weatherCode})

            //Update local storage for future calls
            setWeatherLocalStorage(temperature, weatherCode, Date.now())
          })
          .catch((error) => {
            console.log(error);
          });
      }
    };

    useEffect(() => {
        fetchData();
    }, [count]);
    /* ----- */

    //console.log("uppdaterar i util")
    return result
}