import * as React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

export default function FloatingAddButton({onClick}) {
  return (
    <Box onClick={onClick} sx={{ position: "fixed", zIndex: "999", bottom: 80, right: 15}}>
      <Fab color="primary" aria-label="add">
        <AddIcon />
      </Fab>
    </Box>
  );
}