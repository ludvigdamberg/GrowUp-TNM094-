import {
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Camera from "react-html5-camera-photo";
import CameraUploadButton from "../components/CameraUploadButton";
import FileUploadButton from "../components/FileUploadButton";
import PlantSuggestion from "../components/PlantSuggestion";
import "react-html5-camera-photo/build/css/index.css";
import ImagePreview from "../components/Camera/ImagePreview";
import { Box } from "@mui/system";
const axios = require("axios");
export default function ImageSearch() {
  const [suggestions, setSuggestions] = useState(null);
  const [camera, setCamera] = useState(false);
  const [imageURI, setURI] = useState(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const identifyPlant = (base64) => {
    setLoadingSuggestions(true);
    const body = {
      base64: base64,
    };
    axios
      .post(`/api/search/img`, body)
      .then((res) => {
        setSuggestions(
          res.data.data.suggestions.filter((suggestion) => {
            return suggestion.probability >= 0.1;
          })
        );
        setLoadingSuggestions(false);
        console.log(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpload = (uri) => {
    setURI(uri);
    setSuggestions(null);
    setCamera(false);
  };

  const handleOpenCamera = () => {
    setURI(null);
    setCamera(true);
  };

  return (
    <>
      <Grid
        container
        flexDirection={"column"}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "0.5rem",
              margin: "2rem 0",
            }}
          >
            <FileUploadButton onUpload={(uri) => handleUpload(uri)} />
            <CameraUploadButton onClick={handleOpenCamera} />
          </Box>
        </Grid>
        <Grid item>
          {camera && (
            <Camera
              isSilentMode
              onTakePhoto={(dataUri) => handleUpload(dataUri)}
            />
          )}
          {imageURI && (
            <div
              style={{
                width: "300px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <ImagePreview uri={imageURI} onDelete={() => setURI(null)} />

              {imageURI && (
                <Button
                  disabled={loadingSuggestions}
                  fullWidth
                  onClick={() => identifyPlant(imageURI)}
                  variant="contained"
                >
                  {loadingSuggestions ? (
                    <>
                      Identifierar
                      <CircularProgress
                        size={"1.2rem"}
                        sx={{ color: "white", marginLeft: "0.5rem" }}
                      />{" "}
                    </>
                  ) : (
                    "Identifiera"
                  )}
                </Button>
              )}
            </div>
          )}
        </Grid>
        {}
        <Grid item sx={{ paddingBottom: "3rem" }}>
          <Box
            display={"flex"}
            flexDirection="column"
            justifyContent={"center"}
            alignItems="center"
          >
            {!loadingSuggestions && suggestions && (
              <div style={{ marginTop: "2rem" }}>
                <Typography marginBottom={"2rem"} variant="subtitle">
                  Vi tror detta är
                </Typography>
              </div>
            )}
            {suggestions &&
              !loadingSuggestions &&
              suggestions.map((suggestion, index) => {
                return <PlantSuggestion key={index} suggestion={suggestion} />;
              })}
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
