import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function DialogConfirCancel({open=false, onCancel, onConfirm, title, content, confirmMessage="OK"}) {
 
    const handleConfirm = () =>{
        onConfirm();
        
    }

    const handleCancel= () =>{
        onCancel();
    }

  return (
      <Dialog
        open={open}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
           {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Avbryt</Button>
          <Button variant="contained" sx={{backgroundColor: "red"}} onClick={handleConfirm} autoFocus>
            {confirmMessage}
          </Button>
        </DialogActions>
      </Dialog>
  );
}