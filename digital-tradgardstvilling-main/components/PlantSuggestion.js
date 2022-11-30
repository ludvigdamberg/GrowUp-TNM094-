import { Add, Percent } from "@mui/icons-material";
import styles from "../styles/Suggestion.module.scss";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { Box, height } from "@mui/system";
import React from "react";

export default function PlantSuggestion({ suggestion, onSelect }) {
  const percentage = Math.floor(suggestion.probability * 100);
  const getColorFromPercent = (percent) => {
    if (percent <= 50) {
      return "#FD6666";
    } else if (percent <= 80) {
      return "#FFEE51";
    } else {
      return "#55C66E";
    }
  };

  return (
    <List
      onClick={() => onSelect(suggestion)}
      sx={{
        width: "90%",
        maxWidth: 360,
        bgcolor: "background.paper",
        border: "1px solid #C4C4C4",
        margin: "0 auto",
        marginBottom: "1rem",
        borderRadius: "4px",
      }}
    >
      <ListItem>
        <ListItemAvatar>
          <Avatar
            sx={{
              bgcolor: "transparent",
              backgroundColor: `${getColorFromPercent(percentage)}`,
            }}
          >
            <Typography sx={{ color: "black" }} variant="subtitle2">
              {percentage}%
            </Typography>
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            suggestion.plant_details.common_names
              ? suggestion.plant_details.common_names[0]
              : "Ej tillgängligt"
          }
          secondary={suggestion.plant_name}
        />
        <Button endIcon={<Add />}></Button>
      </ListItem>
    </List>
  );
}
