import {
  DateRange,
  Opacity,
  PriorityHigh,
  SortByAlpha,
} from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  getIconButtonUtilityClass,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React from "react";

export default function FilterDialog({ open, onClose, selectedValue }) {
  const sortingOptions = [
    ["needs_watering", "Urgent to water"],
    ["date_asc", "Date ascending"],
    ["date_des", "Date descending"],
    ["alphabetic_asc", "Alphabetic ascending"],
    ["alphabetic_des", "Alphabetic descending"],
  ];

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  const getIcon = (option) => {
    switch (option) {
      case "date_asc":
        return <DateRange color="primary" />;
      case "date_des":
        return <DateRange color="primary" />;
      case "needs_watering":
        return <PriorityHigh color="primary" />;
      case "alphabetic_asc":
        return <SortByAlpha color="primary" />;
      case "alphabetic_des":
        return <SortByAlpha color="primary" />;
    }
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Filter by</DialogTitle>
      <List sx={{ pt: 0 }}>
        {sortingOptions.map((option) => (
          <ListItem
            button
            sx={{
              backgroundColor:
                option[0] === selectedValue ? "#F2FAF3" : "transparent",
              color: option[0] === selectedValue ? "black" : "unset",
            }}
            onClick={() => handleListItemClick(option[0])}
            key={option[0]}
          >
            <ListItemIcon>{getIcon(option[0])}</ListItemIcon>
            <ListItemText primary={option[1]} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}
