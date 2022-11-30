/*
En banner som visas på rumvyn

*/

/*
Currently Unused
*/

/*
import React, { useEffect, useState } from "react";


import { Box, Typography, Zoom } from "@mui/material";
import { getWeatherInfo } from "../utils/Weather/getWeatherInfo";
import { WbSunny } from "@mui/icons-material";





function WeatherBanner() {
    
    const weatherInfo = getWeatherInfo();

    //Get Weather Info
    const temperature = weatherInfo["Temperature"];

    //Display Text
    const temperatureText = temperature + "\u{00B0}" + "C"
    const weatherDescription = "Weather Code: " + weatherInfo["WeatherCode"]

    //Scroll
    const [scroll, setScroll] = useState(150);

    useEffect(() => {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    });
  
    const handleScroll = () => {
      setScroll(250 - window.scrollY*0.5)
    };

    //Weather Banner transition
    const [sticky, setSticky] = useState(false);
    const stickyThreshold = 150;

    useEffect(() => {
      if(scroll > stickyThreshold)
        setSticky(true);
      else
        setSticky(false);
    }, [scroll]);
    

    return (
      <>

      sticky ? (
        <Typography variant="h6" fontSize="0.5rem"> Weather Banner here: </Typography>
        <Box position="fixed" zIndex="1" top="3.5rem" width="100%" style={{height: 150}} bgcolor={'lightblue'} display="flex" justifyContent="space-evenly" alignItems="center" flexDirection="column">
              <Box height={75} width={150} bgcolor={'red'} display="flex" justifyContent="center" alignItems="center" flexDirection="column">

                  <WbSunny sx={{color: "white"}}></WbSunny>
                  <Typography color="white">{weatherDescription}</Typography>
              </Box>
            <Zoom in={true}>
            <Typography variant="h5" color="white">{temperatureText}</Typography>
            </Zoom>
        </Box>
      ) : (
        
      )
      </>
    );
  }
  export default WeatherBanner;
  */