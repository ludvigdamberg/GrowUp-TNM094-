import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import axios from 'axios'
import Button from '@mui/material/Button';
import { fontWeight } from '@mui/system';
import Box from '@mui/material/Box';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Fab } from '@mui/material';
import { Add } from '@mui/icons-material';
import { Card } from '@mui/material';
import { CardMedia } from '@mui/material';


export default function valj_vaxt() {

const Image1=[
    '../plant_logo.png'
]

    const button1 = {
        background: 'green',
        border: 0,
        borderRadius: 10,
        color: 'white',
        height: 48,
        padding: '0 30px',
        fontWeight:'bold',
        my:'auto',
        m:3,
       
    };
    const box1 = {

        minHeight:'15vh',
        border: 1 ,
        borderColor:'gray' ,
        padding: '5px 5px',
        borderRadius: 2,
        color:'gray',
        m:1,

      
    };
    const button = {
        minHeight:'15vh',
        border: 1 ,
        borderColor:'gray' ,
        borderRadius: 2,
        color:'gray',
          m: 1,
          textAlign: 'center',
          
      
    };
    const boxtop = {
        
     
        height:'30vh',
        color:'gray',
        fontWeight:'bold',
        color:'gray',
        border: 1 ,
        m:0,
        p:0,
        borderBottomRightRadius: 45, borderBottomLeftRadius: 45,
    };
    const fab = {
        fontWeight:'bold',
        m:0.5,
        background: 'green',
    };


  return (


<>
    
   


   <Card sx={boxtop}>
   <Fab color="primary" aria-label="add" size="small" sx={fab}> <ArrowBackIcon /></Fab>
   <CardMedia
          component="img"
          sx={{objectFit: "cover" }}
          image={Image1}
        />
  


   </Card>


  

    <div >
        <h3>Information</h3>
        <Box  sx={box1}>Hej det här är en box Hej det här är en box Hej det här är en box Hej det här är en box</Box>
        <Box  sx={box1}>Hej det här är en box Hej det här är en box Hej det här är en box Hej det här är en box</Box>
        <Box  sx={box1}>Hej det här är en box Hej det här är en box Hej det här är en box Hej det här är en box</Box>
      

    </div>

    <div>
    <Box  sx={button}>
        <Button sx={button1}
    variant="contained" endIcon={<Add />}>Lägg till</Button>
</Box>
    </div>


</>
    )
}
