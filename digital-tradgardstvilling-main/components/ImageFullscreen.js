import { Close } from '@mui/icons-material'
import { Button } from '@mui/material'
import React from 'react'

export default function ImageFullscreen({open = false, src, onClose }) {

    if(open){
        return (
            <div  style={{position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0, 0, 0, 0.782)", zIndex: 998, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                <img style={{width: "100%"}} src={src}/>
                <Button onClick={onClose} sx={{marginTop: "2rem"}} variant="contained">Stäng</Button>
            </div>
          )

    }
    else{
        return(<></>)
    }
 
}
