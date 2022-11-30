import { Timeline } from "@mui/icons-material";
import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";
import { Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { LogItem } from "../../components/LogItem";
import { API_getAllPlantLogsFromUser } from "../../utils/Plants/API_Functions";
const axios = require("axios");

export default function SharedDiary() {
  const router = useRouter();
  const [plant, setPlant] = useState(null);
  const [logs, setLogs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const { code } = router.query;

  const fetchData = async () => {
    if (!plant) return;

    API_getAllPlantLogsFromUser(plant)
      .then((response) => {
        setLogs(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(true);
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, [plant]);

  useEffect(() => {
    setError(false);
    setLoading(true);
    if (code) {
      axios
        .get("/api/shared-diary/", { params: { code: code } })
        .then((response) => {
          setPlant(response.data.data);
        })
        .catch((error) => {
          fetchData();
          console.log(error);
        });
    }
  }, [code]);

  console.log(loading, plant, error);
  return (
    <div style={{ padding: "2rem" }}>
      {logs &&
        logs.map((data) => {
          return (
            <TimelineItem key={data._id}>
              <TimelineSeparator>
                <TimelineDot color="primary" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineOppositeContent
                sx={{ flex: 0 }}
              ></TimelineOppositeContent>
              <TimelineContent flex={"1"}>
                <LogItem onUpdate={fetchData} data={data} />
              </TimelineContent>
            </TimelineItem>
          );
        })}
    </div>
  );
}
