import { Grid, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { daysFromDate } from "../utils/daysFromDate";
import { API_getAllPlantsFromUser } from "../utils/Plants/API_Functions";
import PlantItem from "./PlantItem";
import Searchbar from "./Searchbar";
import SortButton from "./SortButton";

export default function AllPlants() {
  const [plants, setPlants] = useState(null);
  const [searchString, setSearchString] = useState("");
  const [sortBy, setSortBy] = useState("date_asc");

  const fetchData = () => {
    API_getAllPlantsFromUser()
      .then((response) => {
        setPlants(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredPlants = () => {
    return plants
      .filter((plant) => {
        return (
          plant.flower_name.toLowerCase().indexOf(searchString) > -1 ||
          plant.nickname.toLowerCase().indexOf(searchString) > -1
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "date_asc":
            if (daysFromDate(a.created_at) > daysFromDate(b.created_at)) {
              return 1;
            }
            if (daysFromDate(a.created_at) < daysFromDate(b.created_at)) {
              return -1;
            }
            return 0;
          case "date_des":
            if (daysFromDate(a.created_at) < daysFromDate(b.created_at)) {
              return 1;
            }
            if (daysFromDate(a.created_at) > daysFromDate(b.created_at)) {
              return -1;
            }
            return 0;
          case "needs_watering":
            if (
              a.water_interval - daysFromDate(a.last_watered) >
              b.water_interval - daysFromDate(b.last_watered)
            ) {
              return 1;
            }
            if (
              a.water_interval - daysFromDate(a.last_watered) <
              b.water_interval - daysFromDate(b.last_watered)
            ) {
              return -1;
            }
            return 0;
          case "alphabetic_asc":
            return a.nickname.localeCompare(b.nickname);
          case "alphabetic_des":
            return -1 * a.nickname.localeCompare(b.nickname);
        }
      });
  };

  const handleFilterSelection = (selectedValue) => {
    setSortBy(selectedValue);
  };

  const handleSearch = (event) => {
    if (event.target.value.trim() !== "") {
      setSearchString(event.target.value.toLowerCase());
    } else {
      setSearchString("");
    }
  };

  return (
    <Grid spacing={2} container direction="row">
      <Grid xs={10} item>
        <Searchbar placeholder={"Filter your plants"} onChange={handleSearch} />
      </Grid>
      <Grid xs={2} item alignItems={"center"} justifyContent="center">
        <SortButton selectedValue={sortBy} onChange={handleFilterSelection} />
      </Grid>

      {plants &&
        filteredPlants().map((plant) => {
          return (
            <Grid xs={6} minWidth={"100%"} key={plant._id} item>
              <PlantItem onUpdate={fetchData} plant={plant} />
            </Grid>
          );
        })}

      {!plants &&
        [...Array(5).keys()].map((i) => {
          return (
            <Grid key={i} xs={6} minWidth={"100%"} item>
              <Skeleton
                sx={{ marginBottom: "0.5rem" }}
                variant="rectangular"
                height={"100px"}
                width={"100%"}
              />
              <Skeleton variant="h1" sx={{ marginBottom: "0.5rem" }} />
              <Skeleton variant="h3" width="60%" />
            </Grid>
          );
        })}
    </Grid>
  );
}
