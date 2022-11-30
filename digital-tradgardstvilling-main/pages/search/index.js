// Sidan för att söka efter nya växter
// Här finns textinmatning, bildigenkänning och kategorier

import React, { useState } from "react";
// Search API test
import plants from "../../utils/textSearch_list.json";
import UserAuthGuard from "../../components/UserAuthGuard";
import { useRouter } from "next/router";
import Searchbar from "../../components/Searchbar";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import AddIcon from "@mui/icons-material/Add";
import Image from "next/image";
import AddPlant from "../../components/AddPlant";
import { Modal } from "@mui/material";

import {
  Stack,
  Typography,
  styled,
  Container,
  IconButton,
  Collapse,
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Grid,
  Skeleton,
} from "@mui/material";
import Camera from "react-html5-camera-photo";
import ImagePreview from "../../components/Camera/ImagePreview";
import PlantSuggestion from "../../components/PlantSuggestion";
import { Brightness1 } from "@mui/icons-material";


// Hur söker jag
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const Category = styled(Card)(({ theme }) => ({
  display: "flex",
}));

function Search() {
  // Hur söker jag
  const [expanded, setExpanded] = React.useState(false);
  const [openCamera, setOpenCamera] = useState(false);
  const [imageURI, setURI] = useState(null);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const router = useRouter();


  const Plants = plants.plants;

  // Sök efter en planta
  const handleSearch = (event) => {
    if (event.target.value.trim() !== "") {
      setSearchString(event.target.value.toLowerCase());
    } else {
      setSearchString("");
    }
  };

  const filterPlants = (inputPlant) => {
    if (searchString.trim() == "") {
      return [];
    }
    return inputPlant.filter((planta) => {
      return (
        planta.plantName
          .toLowerCase()
          .indexOf(searchString.toLocaleLowerCase()) > -1 ||
        planta.scientificName
          .toLowerCase()
          .indexOf(searchString.toLocaleLowerCase()) > -1
      );
    });
  };

  const [searchString, setSearchString] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Öppna växt till addplant
  const [openAddPlant, setOpenAddPlant] = React.useState(false);

  const hadleCloseAddPlant = () => {
    setOpenAddPlant(false);
  };

  const defaultSettings = {
    nickname: "",
    flower_name: "",
    water_interval: 0,
    location: "",
    wiki_url: "",
    information: "",
    img: null,
  };

  const [settings, setSettings] = useState(defaultSettings);

  const handleSelectPlant = (inputPlant) => {
    prefillPlant(inputPlant);
    setOpenAddPlant(true);
  };

  const prefillPlant = (inputPlant) => {
    const nickname = inputPlant.plantName.length > 0 ? inputPlant.plantName : "";
    setSettings((prev) => ({
      ...prev,
      nickname: nickname,
      flower_name: inputPlant.scientificName,
      img: inputPlant.picture,
    }));
  };


  const defaultmodalInfo = {
    plantname: "",
    scientific: "",
    img: null,
  };

  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);

  const [checkModal, setModal] = React.useState(null);



  const handleOpen = (plantInput) => {
    setModal(plantInput) 

    

   setOpen(true);
  };

 


  const modal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 2,
    borderRadius: 2,

  };
  const results = {
    display: "flex", 
    flexDirection: "column", 
    minHeight:'20vh',
  
    padding: '5px 5px',
    borderRadius: 2,
    m:0.5,
  };



  /*********************************/

  return (
    <UserAuthGuard>
      {openCamera && (
        <Camera
          isSilentMode
          onTakePhoto={(dataUri) => identifyPlant(dataUri)}
        />
      )}

      <AddPlant
        prefill={settings}
        open={openAddPlant}
        onClose={hadleCloseAddPlant}
      />

{ checkModal && <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={modal}>
        <CardMedia
                        component="img"
                        sx={{ width: 100 }}
                        image={checkModal.picture}
                        alt="Bild på växt"
                      />
        <Typography component="div" variant="h5"> 
        {checkModal.plantName}
        </Typography>
        <Typography component="div" variant="p"> 
        {checkModal.scientificName}
        </Typography>
        <Button
                            onClick={() => handleSelectPlant(checkModal)}
                            variant="contained"
                            startIcon={<AddIcon />}
                            component="span"
                            color="primary"
                          >
                            Lägg till
                          </Button>
        </Box>
      </Modal>  }

      <Container maxWidth="xs">
        <Stack spacing={0}>
          {/* // Search bar */}

          <Searchbar
            placeholder={"Search for a plant"}
            onChange={handleSearch}
          />


          {filterPlants(Plants).map((val, key) => {


            return (
              <Grid key={key} xs={6} minWidth={"100%"} marginTop={2} item>
                <div>
                  <Card display="flex" sx={results}>
                    <Stack direction="row">
                      <CardMedia
                        component="img"
                        sx={{ width: 100, minHeigth: 20 }}
                        image={val.picture}
                        alt="Bild på växt"
                      />
                      <Box sx={{ display: "flex", flexDirection: "column" }} onClick={() => handleOpen(val)}>
                        <CardContent sx={{ flex: "1 0 auto" }}>
                          <Typography component="div" variant="h5">
                            {val.plantName}
                          </Typography>
                          <Typography component="div" variant="p">
                            {val.scientificName}
                          </Typography>
                          
                        </CardContent>
                      </Box>
                    </Stack>
                  </Card>
                </div>
              </Grid>
             
            );
          })}
  


          {/* // Hur söker jag */}
          <Stack direction="row" spacing={2}>
            <CardActions disableSpacing onClick={handleExpandClick}>
              <div>
                <p>How to search</p>
              </div>
              <ExpandMore
                expand={expanded}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </CardActions>
          </Stack>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Typography>
              Search for a new plant by either using the text feild above, by
              image recognition or by the categories below.
            </Typography>
          </Collapse>
        </Stack>
        <Stack spacing={2} alignItems="center">
          {/* Bildigenkänning */}
          <Button
            variant="contained"
            startIcon={<AddAPhotoIcon />}
            component="span"
            color="primary"
            onClick={() => setOpenCamera(true)}
          >
            Image recognition
          </Button>
          {/* Kategorier */}
          {/* Gör om till en komponent */}
          <Card sx={{ display: 'flex' }} onClick={() => router.push("/search/easy")}>
            <Stack direction="column" spacing={2}>
              <div style={{position: "relative",
                          height: 150}}>
              <CardMedia
                component="img"
                sx = {{filter: 'brightness(50%)'}}
                image="https://images.unsplash.com/photo-1477554193778-9562c28588c0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
                alt="Bild på växt"
              />
                <Typography variant="h4" 
                            component="div"
                            style = {{position: " absolute", 
                            top: "35%", 
                            left: "15%", 
                            color: "white"}}
                            >
                  Easy to care for
                </Typography>
              </div>
            </Stack>
          </Card>
          <Card sx={{ display: 'flex' }} onClick={() => router.push("/search/flowering")}>
            <Stack direction="column" spacing={2}>
              <div style={{position: "relative",
                          height: 150}}>
              <CardMedia
                component="img"
                sx = {{filter: 'brightness(50%)'}}
                image="https://images.unsplash.com/photo-1556442314-11283516d695?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
                alt="Bild på växt"
              />
                <Typography variant="h4" 
                            component="div"
                            style = {{position: " absolute", 
                            top: "35%", 
                            left: "15%", 
                            color: "white"}}
                            >
                  Flowering plants
                </Typography>
              </div>
            </Stack>
          </Card>
          
          <Card sx={{ display: 'flex' }} onClick={() => router.push("/search/cacti")}>
            <Stack direction="column" spacing={2}>
              <div style={{position: "relative",
                          height: 150}}>
              <CardMedia
                component="img"
                sx = {{filter: 'brightness(50%)'}}
                image="https://images.unsplash.com/photo-1551893665-f843f600794e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
                alt="Bild på växt"
              />
                <Typography variant="h4" 
                            component="div"
                            style = {{position: " absolute", 
                            top: "35%", 
                            left: "9%", 
                            color: "white"}}
                            >
                  Cacti and succulents
                </Typography>
              </div>
            </Stack>
          </Card>
          <Card sx={{ display: 'flex' }} onClick={() => router.push("/search/herbs")}>
            <Stack direction="column" spacing={2}>
              <div style={{position: "relative",
                          height: 150}}>
              <CardMedia
                component="img"
                sx = {{filter: 'brightness(50%)'}}
                image="https://images.unsplash.com/photo-1611625105602-42ee06be977e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=871&q=80"
                alt="Bild på växt"
              />
                <Typography variant="h4" 
                            component="div"
                            style = {{position: " absolute", 
                            top: "35%", 
                            left: "15%", 
                            color: "white"}}
                            >
                  Herbs and spices
                </Typography>
              </div>
            </Stack>
          </Card>
        </Stack>
        {/* Skelettkod */}
        {!plants &&
          [...Array(5).keys()].map((i) => {
            return (
              <Grid key={i} xs={6} minWidth={"100%"} item>
                <Skeleton
                  sx={{ marginBottom: "0.5rem" }}
                  variant="rectangular"
                  height={"100px"}
                  width={"100%"}
                />
                <Skeleton variant="h1" sx={{ marginBottom: "0.5rem" }} />
                <Skeleton variant="h3" width="60%" />
              </Grid>
            );
          })}
      </Container>
    </UserAuthGuard>
  );
}

export default Search;
