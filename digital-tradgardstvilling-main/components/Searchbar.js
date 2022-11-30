import { Search } from "@mui/icons-material";
import {
  IconButton,
  InputAdornment,
  OutlinedInput,
  TextField,
} from "@mui/material";
import React from "react";

//aiwdjaowidjaw

export default function Searchbar({ placeholder, onChange }) {
  return (
    <TextField
      placeholder={placeholder}
      autoComplete="false"
      variant="outlined"
      onChange={(event) => onChange(event)}
      id="outlined-start-adornment"
      sx={{ width: "100%" }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
      }}
    />
  );
}
