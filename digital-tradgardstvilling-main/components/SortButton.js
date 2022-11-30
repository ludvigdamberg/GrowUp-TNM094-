import { FilterList } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React, { useState } from "react";
import FilterDialog from "./Dialogs/FilterDialog";

export default function SortButton({ onChange, selectedValue }) {
  const [open, setOpen] = useState(false);

  const handleSelection = (selectedValue) => {
    onChange(selectedValue);
    setOpen(false);
  };
  return (
    <>
      <FilterDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleSelection}
      />
      <IconButton onClick={() => setOpen(true)} aria-label="filter">
        <FilterList fontSize="5rem" />
      </IconButton>
    </>
  );
}
