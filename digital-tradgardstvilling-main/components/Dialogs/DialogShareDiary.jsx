import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { CircularProgress, Tooltip, Typography } from "@mui/material";
import { CopyAll, Link } from "@mui/icons-material";
import axios from "axios";

export default function DialogShareDiary({ open, onClose, plantID }) {
  const [code, setCode] = React.useState("");
  const [message, setMessage] = React.useState(null);

  const generateLink = () => {
    setCode("loading");
    const data = {
      plant_id: plantID,
    };
    axios
      .post("/api/shared-diary", data)
      .then((response) => {
        setCode(response.data.code);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`localhost:3000/shared-diary/${code}`);
    setMessage("Copied!");
    setTimeout(() => {
      setMessage(null);
    }, 2000);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Generate link for sharing</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography>
            You can generate a link to share your plant diary with your friends.
          </Typography>
          <Typography margin={"1rem 0"} variant="subtitle2">
            Anyone with the link can view.
          </Typography>
        </DialogContentText>
        {code !== "" ? (
          <Tooltip open={message} title={message}>
            <Button
              sx={{ textTransform: "none", borderStyle: "dashed" }}
              onClick={copyToClipboard}
              fullWidth
              variant="outlined"
              startIcon={code !== "loading" ? <CopyAll /> : null}
            >
              {code !== "loading" ? (
                `.../shared-diary/${code}`
              ) : (
                <CircularProgress size={"1.5rem"} />
              )}
            </Button>
          </Tooltip>
        ) : (
          <Button
            onClick={generateLink}
            fullWidth
            variant="contained"
            startIcon={<Link />}
          >
            Generate link
          </Button>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
