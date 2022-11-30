import { Add } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import {
  API_getAllPlantsFromUser,
  API_getPlantRooms,
  API_updatePlantById,
} from "../utils/Plants/API_Functions";
import PlantsFromRoom from "./PlantsFromRoom";
import SelectRoom from "./SelectRoom";

export default function RoomView() {
  const [rooms, setRooms] = useState(null);
  const [plants, setPlants] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState("all");
  const [waterLoading, setWaterLoading] = useState("");

  //Comment test

  const fetchData = () => {
    Promise.all([API_getPlantRooms(), API_getAllPlantsFromUser()])
      .then((response) => {
        setRooms([...response[0].data.data, "Unassigned plants"]);
        setPlants(response[1].data.data);
        setWaterLoading("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const waterPlantById = (id) => {
    const content = {
      last_watered: Date.now(),
    };
    API_updatePlantById(id, content)
      .then((response) => {
        return;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const waterAllPlantsInRoom = (room) => {
    const plantsInRoom = plants.filter((plant) => {
      return plant.location === room ? true : false;
    });

    setWaterLoading(room);
    plantsInRoom.forEach((plant) => {
      waterPlantById(plant._id);
    });
    fetchData();
  };

  const getRooms = () => {
    return rooms
      .filter((room) => {
        if (selectedRoom === "Unassigned plants") {
          return false;
        }
        if (selectedRoom === "all") {
          return true;
        }
        if (selectedRoom === room) {
          return true;
        }
        return false;
      })
      .map((room, index) => {
        return (
          <Grid key={index} item>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginTop: "6rem",
                marginBottom: "1.5rem",
              }}
            >
              <Typography variant="h6">{room}</Typography>
              <Button
                disabled={waterLoading === room}
                onClick={() => waterAllPlantsInRoom(room)}
                size="small"
                variant="outlined"
              >
                {waterLoading === room ? (
                  <>
                    <CircularProgress size={20} />
                    Watering all plants
                  </>
                ) : (
                  "Water all plants"
                )}
              </Button>
            </Box>

            <PlantsFromRoom fetchData={fetchData} plants={plants} room={room} />
          </Grid>
        );
      });
  };

  const handleSelectRoom = (value) => {
    setSelectedRoom(value);
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        {rooms && (
          <SelectRoom
            selectedRoom={selectedRoom}
            rooms={rooms}
            selectRoom={handleSelectRoom}
          />
        )}
      </Grid>

      {rooms && plants && getRooms()}
      {(selectedRoom === "Unassigned plants" || selectedRoom === "all") &&
        rooms && (
          <Grid key={rooms.length} item>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginTop: "6rem",
                marginBottom: "1.5rem",
              }}
            >
              <Typography variant="h6">Unassigned plants</Typography>
            </Box>

            <PlantsFromRoom fetchData={fetchData} plants={plants} room={""} />
          </Grid>
        )}

      {!plants &&
        [...Array(5).keys()].map((index) => {
          return (
            <Grid
              key={index}
              xs={6}
              minWidth={"100%"}
              sx={{ marginBottom: "1rem" }}
              item
            >
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
      {rooms && rooms.length === 0 && (
        <Grid
          container
          flex={1}
          flexDirection="column"
          justifyContent={"center"}
          alignItems="center"
        >
          <Typography
            textAlign={"center"}
            sx={{ padding: "1rem 2.5rem" }}
            variant="body"
            marginTop={12}
          >
            You dont seem to have any room registered yet.
          </Typography>
          <Button variant="contained">
            <Add />
            Add room
          </Button>
        </Grid>
      )}
    </Grid>
  );
}
