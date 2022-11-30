import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../styles/Home.module.css";

//Mui
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

//icons
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import YardIcon from "@mui/icons-material/Yard";
import SettingsIcon from "@mui/icons-material/Settings";

//Router
import { useRouter } from "next/router";
import { Notifications } from "@mui/icons-material";
import { API_getAllNotifications } from "../utils/Plants/API_Functions";
import { Badge } from "@mui/material";

function Navbar() {
  const router = useRouter();

  const getPageNumber = () => {
    if (router.pathname.includes("settings")) {
      return 3;
    }
    if (router.pathname.includes("search")) {
      return 1;
    }
    if (router.pathname.includes("notifications")) {
      return 2;
    } else {
      return 0;
    }
  };

  const [pageNumber, setPageNumber] = useState(getPageNumber());
  const [nNotifications, setNotifications] = useState(null);

  useEffect(() => {
    getPageNumber();
    API_getAllNotifications().then((res) => {
      if (res.length > 0) {
        setNotifications(res.length);
      }
    });
  }, [router]);

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          maxWidth: "100%",
          zIndex: 999,
        }}
      >
        <BottomNavigation
          showLabels
          value={pageNumber}
          onChange={(event, newValue) => {
            setPageNumber(newValue);
          }}
        >
          <BottomNavigationAction
            label="Home"
            icon={<HomeIcon />}
            onClick={() => router.push("/")}
          />
          <BottomNavigationAction
            label="Search"
            icon={<SearchIcon />}
            onClick={() => router.push("/search")}
          />

          <BottomNavigationAction
            label="Notifications"
            icon={
              <Badge color="primary" badgeContent={nNotifications}>
                <Notifications />
              </Badge>
            }
            onClick={() => router.push("/notifications")}
          />

          <BottomNavigationAction
            label="Settings"
            icon={<SettingsIcon />}
            onClick={() => router.push("/settings")}
          />
        </BottomNavigation>
      </Box>
    </>
  );
}
export default Navbar;
