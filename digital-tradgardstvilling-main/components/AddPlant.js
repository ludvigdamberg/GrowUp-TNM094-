import { Add, Close } from "@mui/icons-material";
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
const defaultSettings = {
  nickname: "",
  flower_name: "",
  water_interval: 0,
  location: "",
  wiki_url: "",
  information: "",
  img: null,
};

export default function AddPlant({ open, prefill = defaultSettings, onClose }) {
  const [imageURI, setURI] = useState(prefill.img);
  const [camera, setCamera] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(true);
  const [suggestions, setSuggestions] = useState(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [settings, setSettings] = useState(prefill);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  console.log("fill");

  useEffect(() => {
    API_getPlantRooms()
      .then((response) => {
        setRooms(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });

    setURI(prefill.img);
    setSettings(prefill);
    console.log("tjo");
  }, [open]);

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
    onClose();
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
        setSubmitting(false);
        closeDialog();
      })
      .catch((error) => {
        setSubmitting(false);
        setError("Något gick snett. Försök igen");
      });
  };

  return (
    <Dialog open={open} fullScreen>
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
              <Typography textAlign={"center"}>No matches found...</Typography>
            )}
            {!suggestions && (
              <CircularProgress
                sx={{ justifySelf: "center", alignSelf: "center" }}
              />
            )}
            <Button onClick={closeDialog}>Cancel</Button>
          </Dialog>
        )}
        <Grid item xs={12}>
          <Close
            onClick={onClose}
            fontSize="large"
            sx={{ position: "absolute", top: 10, left: 10 }}
          />
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
                Identify and fill automatically
              </Button>
            )}

            <FormControl fullWidth sx={{ gap: "1rem" }}>
              <Typography>Add plant to collection</Typography>
              <TextField
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                id="input_nickname"
                label="Name of your plant"
                required
                value={settings.nickname}
                onChange={(event) => {
                  setSettings({ ...settings, nickname: event.target.value });
                }}
              />
              <TextField
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                id="input_scientific"
                label="Scientific name"
                value={settings.flower_name}
                onChange={(event) => {
                  setSettings({ ...settings, flower_name: event.target.value });
                }}
              />
              <Box className={styles.autoComplete}>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }}
                  type={"number"}
                  variant="outlined"
                  id="input_interval"
                  label="Water interval"
                  value={settings.water_interval}
                  onChange={(event) => {
                    setSettings({
                      ...settings,
                      water_interval: event.target.value,
                    });
                  }}
                />
                <Autocomplete
                  value={settings.location}
                  onChange={(event, newValue) => {
                    setSettings({ ...settings, location: newValue });
                  }}
                  filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    const { inputValue } = params;
                    // Suggest the creation of a new value
                    const isExisting = rooms.some(
                      (option) => inputValue === option
                    );
                    if (inputValue !== "" && !isExisting) {
                      filtered.push(inputValue);
                    }

                    return filtered;
                  }}
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  id="free-solo-with-text-demo"
                  options={[...rooms]}
                  getOptionLabel={(option) => {
                    return option;
                  }}
                  renderOption={(props, option) => (
                    <li {...props}>
                      {rooms.includes(option) ? (
                        option
                      ) : (
                        <>
                          <span
                            style={{
                              fontStyle: "italic",
                              marginRight: "0.5rem",
                            }}
                          >{`+ Add `}</span>{" "}
                          <span>{" " + option}</span>
                        </>
                      )}
                    </li>
                  )}
                  sx={{ width: 300 }}
                  freeSolo
                  renderInput={(params) => (
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      {...params}
                      label="Room"
                    />
                  )}
                />
              </Box>
              <TextField
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                id="input_url"
                label="URL"
                value={settings.wiki_url}
                onChange={(event) => {
                  setSettings({ ...settings, wiki_url: event.target.value });
                }}
              />
              <TextField
                InputLabelProps={{ shrink: true }}
                value={settings.information}
                variant="outlined"
                id="input_information"
                label="Description / Information"
                multiline
                rows={4}
                onChange={(event) => {
                  setSettings({ ...settings, information: event.target.value });
                }}
              />
              {error && <Alert severity="error">{error}</Alert>}

              <Button
                onClick={handleSubmit}
                size="large"
                fullWidth
                variant="contained"
              >
                {submitting ? (
                  <CircularProgress sx={{ color: "white" }} />
                ) : (
                  "Save"
                )}
              </Button>
              <Button onClick={closeDialog} variant="outlined">
                Cancel
              </Button>
            </FormControl>
          </Box>
        </Grid>
      </Grid>
    </Dialog>
  );
}
