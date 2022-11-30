import React, { useState, useEffect } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import CameraUploadButton from "../CameraUploadButton";
import FileUploadButton from "../FileUploadButton";
import {
  API_updatePlantLogById,
  API_addPlantLogToPlant,
} from "../../utils/Plants/API_Functions";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import ImagePreview from "../Camera/ImagePreview";

// Om det är redigering måste du skicka med logData
export default function DialogPlantLog({
  open,
  handleClose,
  plantID,
  isEditMode = false,
  logData,
}) {
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState(null);
  const [camera, openCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (isEditMode && logData.img) {
      setImageURL(logData.img);
      setDescription(logData.description);
    }

    return () => {
      openCamera(false);
    };
  }, []);

  const handleSubmit = () => {
    setLoading(true);
    setErrorMessage(null);

    const content = {
      description: description,
      img: imageURL,
    };
    if (isEditMode) {
      API_updatePlantLogById(logData.plant_id, logData._id, content)
        .then((response) => {
          setImageURL(null);
          closeDialog();
        })
        .catch((error) => {
          setErrorMessage("Filen är för stor.");
        });
      setLoading(false);
    } else {
      API_addPlantLogToPlant(plantID, content)
        .then((response) => {
          setImageURL(null);
          closeDialog();
        })
        .catch((error) => {
          setErrorMessage("Filen överstiger 5mb");
        });
    }
    setLoading(false);
  };

  const toggleCameraView = (arg) => {
    if (arg === "camera") {
      openCamera(true);
    } else {
      openCamera(false);
    }
  };

  const handleTakePhoto = (dataURI) => {
    openCamera(false);
    setImageURL(dataURI);
  };

  const handleFileUpload = (uri) => {
    setImageURL(uri);
  };
  const handleDelete = () => {
    openCamera(false);
    setImageURL(null);
  };

  const closeDialog = () => {
    openCamera(false);
    setImageURL(null);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={() => closeDialog()}>
      <DialogTitle>Lägg till logg</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Lägg till en logg för din planta genom en beskrivning, bild eller båda
          två.
        </DialogContentText>
        <TextField
          margin="dense"
          id="description"
          multiline
          rows={3}
          defaultValue={isEditMode ? logData.description : ""}
          label="Beskrivning"
          type="text"
          fullWidth
          onChange={(e) => setDescription(e.target.value)}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            padding: "1rem 0",
          }}
        >
          <CameraUploadButton onClick={() => toggleCameraView("camera")} />

          <FileUploadButton onUpload={(uri) => handleFileUpload(uri)}>
            <input
              onChange={() => toggleCameraView("file")}
              hidden
              type="file"
            />
          </FileUploadButton>
        </div>
        {camera && (
          <Camera
            isSilentMode
            onTakePhoto={(dataUri) => handleTakePhoto(dataUri)}
          />
        )}

        {imageURL && <ImagePreview onDelete={handleDelete} uri={imageURL} />}
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={handleClose}>
          Avbryt
        </Button>
        <Button
          disabled={(description === "" && imageURL === "") || loading}
          variant="contained"
          onClick={handleSubmit}
        >
          {loading ? (
            <CircularProgress size={20} sx={{ color: "white" }} />
          ) : isEditMode ? (
            "Spara"
          ) : (
            "Lägg till"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
