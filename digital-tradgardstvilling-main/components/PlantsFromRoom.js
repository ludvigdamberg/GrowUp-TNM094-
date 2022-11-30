import { Grid, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { API_getAllPlantsFromUser } from "../utils/Plants/API_Functions";
import PlantItem from "./PlantItem";

export default function PlantsFromRoom({ room, plants, fetchData }) {
  return (
    <Grid spacing={4} container>
      {plants &&
        plants.map((plant) => {
          if (plant.location === room) {
            return (
              <Grid xs={6} minWidth={"100%"} key={plant._id} item>
                <PlantItem onUpdate={fetchData} plant={plant} />
              </Grid>
            );
          }
        })}
    </Grid>
  );
}
