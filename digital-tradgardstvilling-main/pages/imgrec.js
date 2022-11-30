import { Add } from "@mui/icons-material";
const axios = require("axios");
import {
  Alert,
  Autocomplete,
  Button,
  CircularProgress,
  createFilterOptions,
  Dialog,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  Input,
  InputLabel,
  List,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import ImagePreview from "../components/Camera/ImagePreview";
import CameraUploadButton from "../components/CameraUploadButton";
import FileUploadButton from "../components/FileUploadButton";
import styles from "../styles/AddPlant.module.scss";
import {
  API_addPlantToUser,
  API_getPlantRooms,
} from "../utils/Plants/API_Functions";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import { useRouter } from "next/router";
import PlantSuggestion from "../components/PlantSuggestion";
import UserAuthGuard from "../components/UserAuthGuard";

const filter = createFilterOptions();

export default function AddPlant() {
  const defaultSettings = {
    nickname: "",
    flower_name: "",
    water_interval: 0,
    location: "",
    wiki_url: "",
    information: "",
  };
  const [imageURI, setURI] = useState(defaultSettings.img);
  const [camera, setCamera] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(true);
  const [suggestions, setSuggestions] = useState(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [settings, setSettings] = useState(defaultSettings);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    API_getPlantRooms()
      .then((response) => {
        setRooms(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleUpload = (uri) => {
    setURI(uri);
    setSuggestions(null);
    setCamera(false);
  };

  const identifyPlant = () => {
    setLoadingSuggestions(true);
    const body = {
      base64: imageURI,
    };
    axios
      .post(`/api/search/img`, body)
      .then((res) => {
        setSuggestions(
          res.data.data.suggestions.filter((suggestion) => {
            return suggestion.probability >= 0.1;
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleOpenCamera = () => {
    setURI(false);
    setCamera(true);
  };

  const onDeletePhoto = () => {
    setURI(null);
  };

  const onSelectIdentifiedPlant = (plant) => {
    setLoadingSuggestions(false);
    const nickname =
      plant.plant_details.common_names > 0
        ? plant.plant_details.common_names
        : "";
    setSettings({
      nickname: nickname,
      flower_name: plant.plant_name,
      water_interval: 7,
      location: "",
      wiki_url: plant.plant_details.url,
      information: plant.plant_details.wiki_description
        ? plant.plant_details.wiki_description.value
        : "",
    });

    setSuggestions(null);
  };

  const closeDialog = () => {
    setSuggestions(null);
    setLoadingSuggestions(false);
  };

  const handleSubmit = () => {
    setError(null);

    if (settings.nickname.trim() === "") {
      setError("Du behöver namnge din planta");
      return;
    }
    setSubmitting(true);
    const data = { ...settings, img: imageURI };
    API_addPlantToUser(data)
      .then((response) => {
        router.push("/");
      })
      .catch((error) => {
        setSubmitting(false);
        setError("Något gick snett. Försök igen");
      });
  };

  return (
    <UserAuthGuard>
      <Grid container>
        {loadingSuggestions && (
          <Dialog onClose={closeDialog} open={true} fullWidth>
            <DialogTitle>Välj växt att importera</DialogTitle>
            {suggestions &&
              suggestions.map((suggestion, index) => {
                return (
                  <PlantSuggestion
                    onSelect={onSelectIdentifiedPlant}
                    key={index}
                    suggestion={suggestion}
                  />
                );
              })}
            {suggestions && suggestions.length === 0 && (
              <Typography textAlign={"center"}>
                Tyvärr inga matchningar
              </Typography>
            )}
            {!suggestions && (
              <CircularProgress
                sx={{ justifySelf: "center", alignSelf: "center" }}
              />
            )}
            <Button onClick={closeDialog}>Avbryt</Button>
          </Dialog>
        )}
        <Grid item xs={12}>
          {imageURI && (
            <>
              <ImagePreview onDelete={onDeletePhoto} uri={imageURI} />
            </>
          )}

          {!imageURI && !camera && (
            <Box className={styles.imagePreview}>
              <FileUploadButton onUpload={(uri) => handleUpload(uri)} />
              <CameraUploadButton onClick={handleOpenCamera} />
            </Box>
          )}
          {camera && (
            <Camera
              isSilentMode
              onTakePhoto={(dataUri) => handleUpload(dataUri)}
            />
          )}
        </Grid>
        <Grid item xs={12} sx={{ padding: "1rem" }}>
          <Box
            component={"form"}
            sx={{ width: "100%" }}
            noValidate
            autoComplete="off"
          >
            {imageURI && (
              <Button
                className={styles.identify}
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginBottom: "1rem" }}
                onClick={identifyPlant}
              >
                Identifiera och fyll i automatiskt
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </UserAuthGuard>
  );
}
