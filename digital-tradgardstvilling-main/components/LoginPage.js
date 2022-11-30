import { Typography, Button, Grid } from "@mui/material";
import React from "react";
import logo from "../public/plant_logo.png";
import styles from "../styles/Login.module.scss";
export default function LoginPage() {
  return (
    <div className={styles.login_container}>
      <img src={logo.src} />
      <h1>GrowUp</h1>
      <Grid
        container
        marginTop={4}
        justifyContent={"center"}
        alignItems="center"
        sx={{ padding: "0 2rem" }}
        gap={1}
      >
        <Button
          href="/api/auth/login"
          color="primary"
          fullWidth
          variant="contained"
        >
          Login
        </Button>
        <Typography>or</Typography>
        <Button
          href="/api/auth/login"
          color="secondary"
          fullWidth
          variant="contained"
        >
          Sign up
        </Button>
      </Grid>
    </div>
  );
}
