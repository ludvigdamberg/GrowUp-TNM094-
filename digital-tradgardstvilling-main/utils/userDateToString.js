import { Typography } from '@mui/material';
import * as React from 'react';

// Function specifically used for Myplant-sidan
// Send in a date-string and convert to "Date Month, Year" (ex. 11 April, 2022)
export function dateToString(dateString) {
    
    let date = new Date(dateString);

    let year = date.getFullYear();

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let month = months[date.getMonth()];

    let day = date.getDate();

    return `${day} ${month}, ${year}`

  }
  
  