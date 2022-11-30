import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react'

export default function SelectRoom({rooms, selectRoom, selectedRoom}) {

    const handleChange = (event) => {
      selectRoom(event.target.value);
    };
  
    return (
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Room</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedRoom}
            label="Room"
            onChange={handleChange}
          >
              <MenuItem value={"all"}>All</MenuItem>
              {rooms.map(room =>{
                  return <MenuItem  key={room} value={room}> {room}</MenuItem>
              })}
          </Select>
        </FormControl>
      </Box>
    );
}
