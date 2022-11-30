import {
  Assignment,
  CalendarMonth,
  Notifications,
  Opacity,
} from "@mui/icons-material";
import { Box, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import PlaceHolderImage from "../public/plant_placeholder.png";

export default function NotificationItem({ data }) {
  const router = useRouter();
  console.log(data.plant);
  return (
    <Box
      padding="1rem 1rem"
      margin={"0.5rem 0"}
      display="flex"
      minHeight={"6rem"}
      sx={{ boxShadow: "0px 4px 11px -5px #00000075" }}
      alignItems="center"
      justifyContent={"space-between"}
      onClick={() => router.push(`/plant/${data.plant._id}`)}
      flex={1}
    >
      <Box width="20%">
        <img
          width={"50px"}
          style={{ borderRadius: "100%" }}
          height={"50px"}
          src={data.plant.img || PlaceHolderImage.src}
        />
      </Box>

      <Box
        style={{
          alignSelf: "flex-start",
          display: "flex",
          alignItems: "flex-start",
          flexDirection: "column",
          width: "40%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {data.type === "water" ? (
            <Opacity sx={{ color: "#62A9D1" }} />
          ) : (
            <Assignment color="primary" />
          )}
          <Typography variant="body">
            {data.type === "water" ? "Water" : "Assignment"}
          </Typography>
        </div>

        <Typography variant="body2">{data.info}</Typography>
      </Box>

      <Box
        style={{
          alignSelf: "flex-start",
          display: "flex",
          alignItems: "flex-start",
          flexDirection: "column",
          width: "40%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CalendarMonth />
          <Typography variant="body">Due in</Typography>
        </div>

        <Typography variant="body2">{data.nDaysLeft} days</Typography>
      </Box>
    </Box>
  );
}
