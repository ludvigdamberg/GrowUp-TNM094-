import { Delete, DeleteForever } from "@mui/icons-material";
import { Button, Paper, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function ManageSharedDiaries() {
  const [diaries, setDiaries] = useState(null);
  const [message, setMessage] = useState(null);

  const getDiaries = () => {
    axios
      .get("/api/all-shared-diaries")
      .then((res) => {
        setDiaries(res.data.data);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(`localhost:3000/shared-diary/${code}`);
    setMessage([code, "Copied!"]);
    setTimeout(() => {
      setMessage(null);
    }, 2000);
  };

  useEffect(() => {
    getDiaries();
  }, []);

  const deleteSharedDiary = (id) => {
    axios
      .delete(`/api/shared-diary/`, { params: { code: id } })
      .then((res) => {
        getDiaries();
      })
      .catch((e) => {
        console.error(e);
      });
  };
  console.log(diaries);
  return (
    <Box sx={{ padding: "0 1.5rem" }}>
      <Typography textAlign={"center"} marginBottom="1rem" variant="h6">
        Manage shared diaries
      </Typography>
      {diaries &&
        diaries.map((diary, i) => {
          return (
            <Tooltip
              key={i}
              open={message && message[0] === diary.code}
              title={message && message[1]}
            >
              <Paper
                onClick={() => copyToClipboard(diary.code)}
                sx={{
                  display: "flex",
                  width: "100%",
                  border: "1px dashed #55C66E",
                  justifyContent: "space-between",
                  padding: "1rem 1rem",
                  marginBottom: "1rem",
                  alignItems: "center",
                }}
              >
                <Typography>
                  {new Date(diary.created_at).toDateString()}
                </Typography>
                <Typography>
                  <b>{diary.code}</b>
                </Typography>
                <Button
                  onClick={() => deleteSharedDiary(diary.code)}
                  sx={{ color: "#FF7B7B" }}
                >
                  <DeleteForever />
                </Button>
              </Paper>
            </Tooltip>
          );
        })}

      {diaries == undefined && (
        <Typography textAlign={"center"}>
          You havent shared any diaries yet
        </Typography>
      )}
    </Box>
  );
}
