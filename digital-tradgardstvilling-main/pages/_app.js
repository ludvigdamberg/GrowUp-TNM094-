import "../styles/globals.scss";
import App from "next/app";
import { UserProvider } from "@auth0/nextjs-auth0";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Navbar from "../components/Navbar.js";
import Header from "../components/Header";
import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { CssBaseline } from "@mui/material";

// Your themeing variables, test dark mode

export const DarkModeContext = createContext();

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const [isDarkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const themeMode = localStorage.getItem("theme-mode");

    if (themeMode !== undefined) {
      setDarkMode(themeMode === "true");
    }
  }, []);

  const theme = createTheme({
    palette: isDarkMode
      ? {
          mode: "dark",
          primary: {
            main: "#55C66E",
            contrastText: "#fff",
          },
          secondary: {
            main: "#2C2C2C",
          },
          background: {
            default: "#202020",
            paper: "#2C2C2C",
          },
          myplant: {
            default: "#4d4d4d",
            fabs: "#b3b3b3",
            doneassignment: "#5a7b51",
            doneicon: "#c1f0c1",
            late: "#ff3300",
            infogradient: 'linear-gradient(#4d4d4d 80%, #333333)',
          },
        }
      : {
          mode: "light",
          primary: {
            main: "#55C66E",
            contrastText: "#FCFFFD",
          },
          secondary: {
            main: "#2C2C2C",
          },
          background: {
            default: "#FCFFFD",
          },
          myplant: {
            default: "#f2f2f2",
            fabs: "#2C2C2C",
            doneassignment: "#c0fdb4",
            doneicon: "##248f24",
            late: "#E34949",
            infogradient: 'linear-gradient(#f2f2f2 80%, #b3b3b3)',
          },
        },
  });

  useEffect(() => {
    console.log(router.asPath);
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <DarkModeContext.Provider value={{ isDarkMode, setDarkMode }}>
          <UserProvider>
            <Component {...pageProps} />
          </UserProvider>
        </DarkModeContext.Provider>
      </ThemeProvider>
    </>
  );
}
export default MyApp;
