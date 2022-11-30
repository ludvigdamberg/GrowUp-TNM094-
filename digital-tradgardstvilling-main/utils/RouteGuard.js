import { useState, useEffect } from "react";

import { useUser } from "@auth0/nextjs-auth0";
import LoginPage from "../components/LoginPage";

export { RouteGuard };

function RouteGuard({ children }) {
  const { user } = useUser();

  if (user) {
    return <>{children}</>;
  } else {
    return <LoginPage />;
  }
}
