import { Box, Button, Input } from "@mui/material";
import React from "react";
import { CloudUpload, UploadFileRounded } from "@mui/icons-material";

// Den här funktionen skickar tillbaka bilden i base64 genom funktionen "onUpload"

export default function FileUploadButton({ onUpload }) {
  const acceptableExtensions = ["jpg", "png", "jpeg"];

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleFileRead = async (event) => {
    const file = event.target.files[0];
    if (file === undefined) {
      return;
    }
    const extension = file.type.split("/")[1];
    if (!acceptableExtensions.includes(extension)) {
      return;
    }
    const base64 = await convertBase64(file);
    onUpload(base64);
  };
  return (
    <Box>
      <Button
        color="secondary"
        startIcon={<CloudUpload />}
        variant="contained"
        component="label"
      >
        Upload
        <input
          type="file"
          hidden
          accept=".jpg,.png,.jpeg"
          onAbort={null}
          onChange={(e) => handleFileRead(e)}
        />
      </Button>
    </Box>
  );
}
