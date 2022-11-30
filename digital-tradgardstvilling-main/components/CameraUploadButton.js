import { Box, Button, Input } from "@mui/material";
import React from "react";
import { CameraAltRounded } from "@mui/icons-material";

export default function CameraUploadButton({ onClick }) {
  return (
    <Box>
      <Button
        onClick={onClick}
        startIcon={<CameraAltRounded />}
        variant="contained"
        color="secondary"
        component="label"
      >
        CAMERA
      </Button>
    </Box>
  );
}
