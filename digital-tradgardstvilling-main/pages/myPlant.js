import * as React from "react";
import ReactDOM from "react-dom";

// Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // npm install @mui/icons-material
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import OpacityIcon from "@mui/icons-material/Opacity";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import YardIcon from "@mui/icons-material/Yard";

import Fab from "@mui/material/Fab";

// Boxes and Buttons
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";

// Style
import { bottom, textAlign } from "@mui/system";
import { positions } from "@mui/system";
import { BorderBottom } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@mui/material";

// API
import {
  API_addPlantLogToPlant,
  API_addPlantToUser,
  API_deletePlantById,
  API_getAllPlantLogsFromUser,
  API_getAllPlantsFromUser,
  API_getPlantById,
  API_updatePlantById,
  API_updatePlantLogById,
} from "../utils/Plants/API_Functions";
import { useEffect, useState } from "react";
import { Collapse, ListItemButton } from "@mui/material";

import { plant, nickname } from "../models/plant";

// List
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { ImageList, ImageListItem } from "@mui/material";

import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";

{
  /* ----------------- @T0D0's: ---------------------------*/
}
{
  /* @T0D0: Hantera klick/navigering: Tillbaka, Edit, Vattna, Dagbok, Lägg till uppgift?*/
}
{
  /* @T0D0: Lägg till "riktig" info från API:et*/
}
{
  /* @T0D0: Lägga till styles + typography så koden blir mer läsbar [X] */
}
{
  /* @T0D0: Snygga till koden [X] */
}
{
  /* @T0D0: Lägg till uppgifter som MUI-lista [/] */
}
{
  /* @T0D0: Funktionalitet: Kunna swipea till nästa planta, Kunna “vattna” plantan, 
Lägga till uppgifter att göra för resp. planta*/
}
{
  /* @T0D0: Rensa bland imports*/
}

function MyPlant({ plant }) {
  const [openInfo, setOpenInfo] = React.useState(false);
  const [openTasks, setOpenTasks] = React.useState(false);

  // Hanterar drop-down-funktionen för användarens egna information om växten
  const showInformation = () => {
    setOpenInfo(!openInfo);
  };

  // Hanterar drop-down-funktionen för att visa användarens uppgifter
  const showTasks = () => {
    setOpenTasks(!openTasks);
  };

  // Denna är bara för att visa alla som behöver klick-hantering
  const iNeedAClickFunction = () => {
    // hejhej
  };

  // Variabler som måste läggas till
  const flower_name = "Växtnamn";
  const flower_type = "Pengaträd, Crassula ovata";
  const location = "Vardagsrum";

  const last_watered = "2022-02-01";
  const water_in_days = 3;
  const water_interval = 7;

  const created_at = "2022-02-01";
  const days_since_created = 5;
  const birth_years = 1;
  const birth_days_left = 83;

  const assignments = "Byt jord";
  const wiki_url = "https://en.wikipedia.org/wiki/Crassula_ovata";
  const img = "Image";

  const information =
    "Den här växten är min finaste växt och jag gillar den väldigt mycket. Fick den när jag fyllde år så den är väldigt viktig för mig.";

  return (
    <>
      {/* ------- Bild med tillbaka-ikon, edit-ikon och rum-text ------- */}
      <Box
        sx={{
          height: 270,
          backgroundColor: "DarkSeaGreen",
          position: "relative",
          borderBottomRightRadius: 45,
          borderBottomLeftRadius: 45,
        }}
      >
        <Fab
          onClick={iNeedAClickFunction}
          color="secondary"
          aria-label="backIcon"
          sx={{ position: "absolute", top: 5, left: 5, boxShadow: 5 }}
        >
          {" "}
          <ArrowBackIcon />
        </Fab>

        <Fab
          onClick={iNeedAClickFunction}
          color="secondary"
          aria-label="edit"
          sx={{ position: "absolute", bottom: 30, right: 30, boxShadow: 5 }}
        >
          <EditIcon />
        </Fab>
      </Box>

      <Box sx={{ position: "absolute", top: 2, right: 15 }}>
        <Typography
          variant="h6"
          sx={{
            color: "#4E4E4E",
            textTransform: "uppercase",
            textShadow: "2px #000000",
          }}
        >
          {location}
        </Typography>
      </Box>

      {/* ------- Växtnamn, art och länk till hemsida -------*/}
      <Box sx={{ marginTop: 1, textAlign: "center" }}>
        <Typography variant="h5" sx={{ color: "#000000", fontWeight: "bold" }}>
          {flower_name}
        </Typography>

        <Box sx={{}}>
          <Typography variant="subtitle1" sx={{ color: "#828282" }}>
            {flower_type}
          </Typography>
        </Box>
        <Box sx={{ marginTop: -1 }}>
          <Link variant="caption" underline="none" sx={{ color: "#828282" }}>
            {wiki_url}
          </Link>
        </Box>
      </Box>

      {/* ------- Vattna-knapp och vattningsinformation ------- */}
      <Box
        sx={{
          marginTop: 3,
          display: "flex",
          justifyContent: "space-between",
          margin: 2,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: "WhiteSmoke",
            borderRadius: 2,
            width: 200,
            textAlign: "center",
            boxShadow: 1,
          }}
        >
          <Typography
            variant="body1"
            sx={{ color: "#000000", marginTop: "4%" }}
          >
            Vattna om {water_in_days} dagar
          </Typography>
        </Box>

        <Box
          sx={{
            textAlign: "center",
            position: "middle",
            paddingTop: 0,
            margin: 0.5,
          }}
        >
          <Button
            onClick={iNeedAClickFunction}
            variant="contained"
            color="primary"
            startIcon={<OpacityIcon />}
          >
            Vattna
          </Button>
        </Box>
      </Box>

      <Box sx={{ marginLeft: 2, marginTop: -2, width: "100%" }}>
        <Typography variant="overline" sx={{ color: "secondary" }}>
          Vattningsintervall: var {water_interval}e dag
        </Typography>
      </Box>

      {/* ------- Dagbok och information om hur länge växten levt osv ------- */}
      <Box
        sx={{
          marginTop: 3,
          display: "flex",
          justifyContent: "space-between",
          margin: 2,
        }}
      >
        <Box
          sx={{
            backgroundColor: "WhiteSmoke",
            borderRadius: 2,
            width: 200,
            textAlign: "center",
            boxShadow: 1,
          }}
        >
          <Typography variant="body1" sx={{ color: "#000000" }}>
            Denna växt har du tagit hand om i {days_since_created} dagar. Den
            fyller {birth_years} år om {birth_days_left} dagar.
          </Typography>
        </Box>

        <Box sx={{ textAlign: "center", position: "middle", paddingTop: 1.5 }}>
          <Button
            onClick={iNeedAClickFunction}
            variant="contained"
            color="primary"
            startIcon={<ViewTimelineIcon />}
          >
            Dagbok
          </Button>
        </Box>
      </Box>

      {/* ------- Egen Information om plantan ------- */}
      <Box
        sx={{
          direction: "row",
          alignItems: "center",
          textAlign: "center",
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        <Typography variant="h6" sx={{ color: "#000000" }}>
          Egen information
        </Typography>
      </Box>

      <Box
        sx={{
          textAlign: "center",
          alignItems: "center",
          marginTop: 1,
          marginLeft: "5%",
          backgroundColor: "WhiteSmoke",
          borderRadius: 2,
          width: "90%",
          textAlign: "center",
          boxShadow: 1,
        }}
      >
        <Typography variant="body1" sx={{ color: "#000000" }}>
          {information}
        </Typography>
      </Box>

      {/* Test: Drop-down info/uppgifter */}
      {/* Alternativ 1: Boxar. Funkar bra men ikonen
          ej centrerad med texten. */}

      {/*
          <Box onClick={showInformation} sx={{direction: "row", alignItems: "center", textAlign: "center", fontSize: 20, fontWeight: "bold"}}>
            <span>Egen information</span>
          {openInfo ? <ExpandMore /> : <ExpandLess />}
          </Box>
          
          <Collapse in={openInfo} timeout="auto" unmountOnExit>
            <Box sx={{textAlign: "center", alignItems: "center"}}><span>Information om växten. Information om växten.</span></Box></Collapse>
          */}

      {/* Alternativ 2: Lista. Centreras ej på skärm
          men ikonen blir centrerad */}
      {/*
          <List sx={{position: "relative", textAlign: "center"}} >
            <ListItemButton onClick={handleClick} sx={{position: "relative", textAlign: "center", alignItems: "center"}}><ViewTimelineIcon />
              <h3>Information</h3>
            {open ? <ExpandMore /> : <ExpandLess />}</ListItemButton>

            <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding><ListItemButton sx={{ pl: 1 }}>Information om växten. Information om växten.</ListItemButton>
            </List>
            </Collapse>
          </List>
          */}

      {/* ------- Uppgifter  ------- */}
      <Box
        sx={{
          direction: "row",
          alignItems: "center",
          textAlign: "center",
          fontSize: 20,
          fontWeight: "bold",
          marginTop: 2,
        }}
      >
        <Typography variant="h6" sx={{ color: "#000000" }}>
          Uppgifter
        </Typography>
      </Box>

      <Grid sx={{ textAlign: "center", marginTop: -2, marginLeft: "17%" }}>
        <List>
          <ListItem>
            <ListItemIcon>
              <YardIcon sx={{ color: "#739900" }}></YardIcon>
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body1" sx={{ color: "#000000" }}>
                  {assignments}
                </Typography>
              }
            />

            <Checkbox
              onClick={iNeedAClickFunction}
              sx={{ marginRight: "25%" }}
            ></Checkbox>
          </ListItem>

          <ListItem sx={{ marginTop: -3 }}>
            <ListItemIcon>
              <YardIcon sx={{ color: "#739900" }}></YardIcon>
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body1" sx={{ color: "#000000" }}>
                  {assignments}
                </Typography>
              }
            />

            <Checkbox
              onClick={iNeedAClickFunction}
              sx={{ marginRight: "25%" }}
            ></Checkbox>
          </ListItem>
        </List>
      </Grid>

      {/* Test: Uppgifter med drop down-lista men tyckte det var fult */}
      {/*
          <Box onClick={showTasks} sx={{direction: "row", alignItems: "center", textAlign: "center", fontSize: 20, fontWeight: "bold", marginTop: 2}}>
            <span>Uppgifter</span>
          {openTasks ? <ExpandMore /> : <ExpandLess />}</Box>

          <Collapse in={openTasks} timeout="auto" unmountOnExit>
          <Box sx={{textAlign: "center", marginTop: 2}}><Button variant="contained" color="primary" endIcon={<DoneAllIcon />}>
              Markera alla som klara
            </Button>
          </Box>

            <Box sx={{marginTop: 3, display: "flex", justifyContent: "space-between", margin: 4}}>
              <Box sx={{backgroundColor: 'WhiteSmoke', borderRadius: 2, width: 200, textAlign: "center", boxShadow: 1}}>
              <Typography variant="h6" sx={{textAlign: 'center', color: '#4E4E4E', padding: '1em'}}>
                {assignments}
            </Typography>
                </Box>

            <Box sx={{textAlign: "center", position: "middle", paddingTop: 3}}>
            <Button variant="contained" color="primary" startIcon={<DoneIcon/>}>Klart</Button></Box>
              </Box>
            </Collapse>
            */}

      {/* Lägg till en uppgift-knapp */}
      <Box sx={{ marginTop: 4, position: "center", textAlign: "center" }}>
        <Button
          onClick={iNeedAClickFunction}
          variant="contained"
          color="primary"
          endIcon={<AddCircleIcon />}
        >
          Lägg till en uppgift
        </Button>
      </Box>
    </>
  );
}
export default MyPlant;
