import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import {
  API_deletePlantLogById,
  API_getAllPlantLogsFromUser,
  API_getPlantById,
} from "../utils/Plants/API_Functions";

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

import DialogPlantLog from "../components/Dialogs/DialogPlantLog";
import DialogConfirCancel from "../components/Dialogs/DialogConfirmCancel";
import { convertDateToName } from "../utils/dateConverter";
import ImageFullscreen from "../components/ImageFullscreen";
import { Delete, Edit, MoreVert } from "@mui/icons-material";

export function LogItem({ data, onUpdate, editable = false }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const openMenu = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDeleteLog = () => {
    setAnchorEl(null);
    setOpenConfirmation(false);
    API_deletePlantLogById(data.plant_id, data._id)
      .then((response) => {
        console.log(response);
        onUpdate();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleEditLog = () => {
    setAnchorEl(null);
  };

  return (
    <Card sx={{ maxWidth: 345, marginBottom: "5rem" }}>
      <CardHeader
        action={editable ? <MoreVert onClick={handleClick} /> : null}
        subheader={
          <span style={{ fontSize: "1rem" }}>
            {convertDateToName(data.created_at.slice(0, 10))}
          </span>
        }
      />
      {data.img && (
        <CardMedia
          onClick={() => setShowImage(true)}
          component="img"
          height="194"
          image={data.img}
          alt="Flower"
        />
      )}
      <CardContent>
        <Typography variant="subtitle" color="text.secondary">
          {data.description}
        </Typography>
      </CardContent>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={openMenu}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          sx={{ gap: "0.8rem" }}
          onClick={() => {
            setAnchorEl(null);
            setOpenConfirmation(true);
          }}
        >
          <Delete /> Ta bort
        </MenuItem>
        <MenuItem
          sx={{ gap: "0.8rem" }}
          onClick={() => {
            setAnchorEl(null);
            setOpenEdit(true);
          }}
        >
          <Edit onClick={handleEditLog} /> Redigera
        </MenuItem>
      </Menu>
      <DialogPlantLog
        isEditMode={true}
        logData={data}
        plantID={data.plant_id}
        open={openEdit}
        handleClose={() => {
          setOpenEdit(false);
          onUpdate();
        }}
      />
      <DialogConfirCancel
        confirmMessage="Ta bort"
        open={openConfirmation}
        onConfirm={handleDeleteLog}
        onCancel={() => setOpenConfirmation(false)}
        title={`Är du säker på att du vill ta bort den här loggen?`}
      />
      <ImageFullscreen
        onClose={() => setShowImage(false)}
        open={showImage}
        src={data.img}
      />
    </Card>
  );
}
