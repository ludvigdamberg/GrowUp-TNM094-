import { Cake, LocationOn, Opacity } from "@mui/icons-material";
import {
  Badge,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import PlaceHolderImage from "../public/plant_placeholder.png";

import React, { useEffect, useState } from "react";
import { daysFromDate } from "../utils/daysFromDate";
import { Box } from "@mui/system";
import { API_updatePlantById } from "../utils/Plants/API_Functions";
import { useRouter } from "next/router";

export default function PlantItem({ plant, onUpdate }) {
  const router = useRouter();
  const [waterLoading, setWaterLoading] = useState(false);
  const waterPlantById = () => {
    setWaterLoading(true);
    const content = {
      last_watered: Date.now(),
    };
    API_updatePlantById(plant._id, content)
      .then((response) => {
        onUpdate();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    setWaterLoading(false);
  }, [plant]);
  const daysTilWater = plant.water_interval - daysFromDate(plant.last_watered);
  return (
    <Card sx={{ display: "flex" }}>
      <CardMedia
        onClick={() => router.push(`/plant/${plant._id}`)}
        component="img"
        sx={{ width: "40%" }}
        image={plant.img || PlaceHolderImage.src}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <CardContent
          sx={{ width: "100%" }}
          onClick={() => router.push(`/plant/${plant._id}`)}
        >
          <Typography marginBottom={0} variant="h6" component="div">
            {plant.nickname}
          </Typography>
          <Typography sx={{ marginBottom: "1rem" }} variant="subtitle2">
            {plant.flower_name}
          </Typography>
          {/* <Box display={"flex"} marginTop="0.5rem" alignItems="center">
            <Cake color={"primary"} sx={{ marginRight: "0.3rem" }} />
            <Typography variant="subtitle2">
              {daysFromDate(plant.created_at)} dagar gammal
            </Typography>
          </Box> */}
          <Box marginTop="0.5rem" display={"flex"} alignItems="center">
            <Opacity sx={{ color: "#62A9D1", marginRight: "0.3rem" }} />
            {daysTilWater <= 0 && (
              <Chip
                sx={{ backgroundColor: "#FFDBDB", color: "#E34949" }}
                label="Vattna snarast!"
              />
            )}
            {daysTilWater > 0 && (
              <Typography variant="subtitle2">{`Vattna om ${daysTilWater} dagar`}</Typography>
            )}
          </Box>
          <Box marginTop="0.5rem" display={"flex"} alignItems="center">
            <LocationOn sx={{ marginRight: "0.3rem" }} />
            <Typography
              sx={{ fontStyle: plant.location !== "" ? "normal" : "italic" }}
              variant="subtitle2"
            >
              {plant.location !== "" ? plant.location : "No room assigned"}
            </Typography>
          </Box>
        </CardContent>
        <Button
          sx={{ backgroundColor: "#62A9D1", margin: "0.5rem", width: "90%" }}
          variant="contained"
          startIcon={waterLoading ? null : <Opacity />}
          onClick={waterPlantById}
          disabled={waterLoading}
        >
          {waterLoading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Water plant"
          )}
        </Button>
      </Box>
    </Card>
  );
}
