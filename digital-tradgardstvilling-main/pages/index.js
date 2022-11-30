import React, { useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import { TabContext } from "@mui/lab"; // npm install @mui/lab
import TabList from "@mui/lab/TabList";
import Tabs from "@mui/material/Tabs";
import TabPanel from "@mui/lab/TabPanel";

import RoomView from "../components/RoomView.js";
import AllPlants from "../components/AllPlants.js";
import FloatingAddButton from "../components/FloatingAddButton.js";
import { useRouter } from "next/router";
import UserAuthGuard from "../components/UserAuthGuard.jsx";
import AddPlant from "../components/AddPlant.js";

// Vet inte exakt hur vi ska göra med routing, om vi bara ska kalla denna
// "Home" eller om vi ska lägga till Home/RoomView respektive Home/AllPlants
// Finns ett sätt att göra det på men då måste vi ändra i app.js
// och just nu sköter väl den routingen på något sätt?

// export default function homeBar() {
/*const homeBar = props => {
    const {match} = props;
    const {params} = match;
    const {page} = page;
 */

export default function HomeBar({ status }) {
  /*These two handles the state so it can keep track of which tab is active */
  const [value, setValue] = useState("1");
  const [openAddplant, setOpenAddplant] = useState(false);
  const router = useRouter();
  console.log(status);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCloseAddplant = () => {
    setOpenAddplant(false);
  };

  return (
    <UserAuthGuard>
      <AddPlant onClose={handleCloseAddplant} open={openAddplant} />
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          {/*Box that holds the tabs */}
          <Box sx={{ borderBottom: 0, borderColor: "divider" }}>
            {/*Colors we will fix from a theme that we will overwrite */}
            <TabList
              onChange={handleChange}
              aria-label="home"
              textColor="primary"
              indicatorColor="primary"
              scrollButtons
              centered
            >
              <Tab label="RUM VY" value="1" wrapped />
              <Tab label="ALLA VÄXTER" value="2" wrapped />
            </TabList>
          </Box>

          {/* The content is in tabpanels */}
          <TabPanel value="1">
            <RoomView />
          </TabPanel>
          <TabPanel value="2">
            <AllPlants />
          </TabPanel>
        </TabContext>
        <FloatingAddButton onClick={() => setOpenAddplant(true)} />
      </Box>
    </UserAuthGuard>
  );
}
