import React from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import Navbar from "./Navbar";
import Header from "./Header";
export default function UserAuthGuard({ children }) {
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress color="primary" />
      </div>
    );
  }
  if (error) {
    return <div>Error aijwodaw</div>;
  }

  if (user) {
    return (
      <>
        <Header />
        {children}
        <Navbar />
      </>
    );
  } else {
    router.push("/login");
    return <div></div>;
  }
}
