import { ArrowBackIos } from "@mui/icons-material";
import { Grid } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

import styles from "../styles/Header.module.scss";
export default function Header() {
  const router = useRouter();

  const getTitleFromRoute = () => {
    const route = router.asPath;
    if (route === "/") {
      return "Mina växter";
    }
    if (route.includes("diary")) {
      return "Dagbok";
    }
    if (route.includes("add-plant")) {
      return "Lägg till planta";
    }
    if (route.includes("search")) {
      return "Search";
    }
    if (route.includes("notifications")) {
      return "Notifications";
    }
  };

  return (
    <Grid className={styles.header} container>
      <Grid xs={3} item>
        {router.asPath !== "/" && (
          <ArrowBackIos onClick={() => router.back()} />
        )}
      </Grid>
      <Grid xs={6} sx={{ textAlign: "center" }} item>
        {getTitleFromRoute()}
      </Grid>
      <Grid xs={3} item></Grid>
    </Grid>
  );
}
