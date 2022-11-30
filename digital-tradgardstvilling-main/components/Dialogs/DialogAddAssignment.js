// Denna fil hanterar dialogen/pop-up:en som kommer upp när användaren
// lägger till en ny uppgift på min-planta-sidan.

import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

import { API_addAssignmentToPlant, API_getPlantById, API_getAssignmentsFromPlant } from "../../utils/Plants/API_Functions";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns'; // npm install --save date-fns
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Box from "@mui/material/Box";

export default function DialogAddAssignment({
    open,
    onClose,
    plantID}) {

    const [newAssignment, setNewAssignment] = React.useState("");
    const [newAssignmentDate, setNewAssignmentDate] = React.useState(new Date(Date.now()));
    
    // Hantera att lägga till eller trycka på cancel
    const handleSubmit = () =>{
        addAssignmentByPlantId();
        onClose();
    }

    const handleCancel= () =>{
        onClose();
    }

    // Hantera förändring när man väljer datum med date-picker
    const handleChange = (newValue) => {
      setNewAssignmentDate(newValue);
    };

    const [plants, setPlants] = React.useState(null);

    
    const fetchData = () => {
    API_getPlantById(plantID)
      .then((response) => {
        setPlants(response.data.data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if(plantID) {
      fetchData();
    }
    
  }, [plantID]);

  // Hämta uppgifterna
  const fetchAssignments = () => {
    API_getAssignmentsFromPlant(plantID)
      .then((response) => {
        setAssignments(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Från API:et
const addAssignmentByPlantId = () => {
    const assignment = {
      text: newAssignment,
      done: false, 
      duedate: newAssignmentDate
    };
    API_addAssignmentToPlant(plants._id, assignment)
      .then((response) => {
        fetchData();
        console.log(assignment[0]);
      })
      .catch((error) => {
        console.log(error);
      });
      fetchAssignments();
  };

  return (
      <Dialog
        open={open}
        onClose={handleCancel}
      >
        <DialogTitle>Add an assignment</DialogTitle>

        <DialogContent>

        <Box sx={{marginBottom: 2}}>
          <DialogContentText>
            Here you can add an assignment by giving the assignment a name and a due date.
          </DialogContentText>
          </Box>

          <DialogContentText>
            What is the name of the assignment?
          </DialogContentText>

          <TextField type="text" autoFocus margin="dense" id="assignment" 
          label="Write your new assignment here" 
          fullWidth variant="outlined" onChange={(e) => setNewAssignment(e.target.value)}/>
          
          <Box sx={{marginTop: 2}}>
            <DialogContentText>
              What is the due date of the assignment?
            </DialogContentText>
          </Box>
          
          <Box sx={{marginTop: 2}}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>

            <MobileDatePicker
              label="Pick a date"
              inputFormat="MM/dd/yyyy"
              value={newAssignmentDate}
              onChange={handleChange}
              renderInput={(params) => <TextField {...params} />}
          />
          </LocalizationProvider>
        </Box>
 
        </DialogContent>
          <DialogActions>
            <Button variant="contained" color='primary' onClick={handleSubmit} autoFocus>
              Add new assignment
            </Button>
            <Button variant="contained" onClick={handleCancel} color='secondary'>Cancel</Button>
        </DialogActions>
      </Dialog>
  );
}