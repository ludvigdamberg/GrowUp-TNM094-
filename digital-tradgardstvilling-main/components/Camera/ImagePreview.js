import { Delete, DeleteForever, Refresh } from "@mui/icons-material";
import { Avatar, Button, Grid } from "@mui/material";
import React, { useState } from "react";

export default function ImagePreview({ uri, onDelete }) {
  return (
    <div style={{ width: "100%" }}>
      <div style={{ position: "relative" }}>
        <img style={{ width: "100%", objectFit: "contain" }} src={uri} />
        <Button
          onClick={onDelete}
          variant="contained"
          sx={{
            color: "white",
            backgroundColor: "red",
            position: "absolute",
            bottom: 10,
            left: "50%",
            transform: "translateX(-50%)",
          }}
          startIcon={<DeleteForever />}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
