// Hemsida för dagbok för en planta, ett id är en planta

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  API_deletePlantLogById,
  API_getAllPlantLogsFromUser,
  API_getPlantById,
} from "../../utils/Plants/API_Functions";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import FloatingAddButton from "../../components/FloatingAddButton";

import DialogPlantLog from "../../components/Dialogs/DialogPlantLog";
import DialogConfirCancel from "../../components/Dialogs/DialogConfirmCancel";
import { convertDateToName } from "../../utils/dateConverter";
import ImageFullscreen from "../../components/ImageFullscreen";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import axios from "axios";
import { LogItem } from "../../components/LogItem";
import { Share } from "@mui/icons-material";
import { Box } from "@mui/system";
import DialogShareDiary from "../../components/Dialogs/DialogShareDiary";
import UserAuthGuard from "../../components/UserAuthGuard";

function Diary() {
  const router = useRouter();
  const { plantID } = router.query;

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [plant, setPlant] = useState(null);
  const [error, setError] = useState(false);

  const [open, setOpen] = useState(false);
  const [openShare, setOpenShare] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const fetchData = () => {
    Promise.all([
      API_getAllPlantLogsFromUser(plantID),
      API_getPlantById(plantID),
    ])
      .then((values) => {
        setLogs(values[0].data.data);
        setPlant(values[1].data.data[0]);
      })
      .catch((error) => {
        setError(true);
      })
      .finally((_) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!plantID) {
      return;
    }

    fetchData();
  }, [plantID, open]);

  if (!loading && error) {
    return (
      <>
        <Typography>Den här blomman verkar inte finnas</Typography>
      </>
    );
  } else {
    return (
      <UserAuthGuard>
        {!loading && plant && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              color={"text.primary"}
              sx={{ marginTop: "1rem", marginBottom: "1rem" }}
              variant="h4"
              align="center"
            >
              {plant.nickname}
            </Typography>
            <Button
              onClick={() => setOpenShare(true)}
              variant="contained"
              startIcon={<Share />}
            >
              Share
            </Button>
          </Box>
        )}
        <FloatingAddButton onClick={handleClickOpen} />
        <Timeline position="right">
          {!loading &&
            logs &&
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
                    <LogItem editable onUpdate={fetchData} data={data} />
                  </TimelineContent>
                </TimelineItem>
              );
            })}
        </Timeline>

        {!loading && logs.length === 0 && (
          <Grid
            container
            justify="center"
            alignItems="center"
            direction="column"
          >
            <Typography>Här var det tomt på loggar!</Typography>
            <Button variant="contained" onClick={handleClickOpen}>
              Lägg till
            </Button>
          </Grid>
        )}
        <DialogPlantLog
          plantID={plantID}
          open={open}
          handleClose={handleClose}
        />
        <DialogShareDiary
          plantID={plantID}
          open={openShare}
          onClose={() => setOpenShare(false)}
        />
      </UserAuthGuard>
    );
  }
}

export default Diary;
