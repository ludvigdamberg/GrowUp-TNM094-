import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import NotificationItem from "../components/Notification";
import UserAuthGuard from "../components/UserAuthGuard";
import { API_getAllNotifications } from "../utils/Plants/API_Functions";

export default function Notifications() {
  const [notifications, setNotifications] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    API_getAllNotifications()
      .then((res) => {
        console.log(res);
        setNotifications(
          res.sort((a, b) => {
            if (a.nDaysLeft > b.nDaysLeft) return 1;
            if (a.nDaysLeft < b.nDaysLeft) return -1;
            return 0;
          })
        );
        setLoading(false);
      })
      .catch((er) => {
        console.log(er);
      });
  }, []);
  return (
    <UserAuthGuard>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          padding: "0 1rem",
          height: loading ? "100vh" : "auto",
        }}
      >
        {!loading &&
          notifications &&
          notifications.map((n) => (
            <NotificationItem key={n.plant._id} data={n} />
          ))}

        {loading && (
          <CircularProgress sx={{ alignSelf: "center" }} color="primary" />
        )}
      </Box>
    </UserAuthGuard>
  );
}
