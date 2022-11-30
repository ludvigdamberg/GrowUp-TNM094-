// Hemsida för en planta, ett id är en planta

import { useRouter } from "next/router";
import * as React from "react";

// Icons
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import OpacityIcon from "@mui/icons-material/Opacity";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import Fab from "@mui/material/Fab";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import AddIcon from "@mui/icons-material/Add";
import AddTaskIcon from "@mui/icons-material/AddTask";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import UndoIcon from "@mui/icons-material/Undo";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";

// Boxes, buttons, list osv
import Box from "@mui/material/Box";
import {
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
} from "@mui/material";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";

// Style
import { Typography } from "@mui/material";

// Dialogs
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CameraUploadButton from "../../components/CameraUploadButton";
import Camera from "react-html5-camera-photo";
import FileUploadButton from "../../components/FileUploadButton";
import DialogConfirCancel from "../../components/Dialogs/DialogConfirmCancel";
import ImagePreview from "../../components/Camera/ImagePreview";
import DialogAddAssignment from "../../components/Dialogs/DialogAddAssignment";

// Funktionalitet
import { useEffect, useState, useReducer, onUpdate } from "react";
import {
  API_getPlantById,
  API_updatePlantById,
  API_deletePlantById,
  API_getAssignmentsFromPlant,
  API_deleteAssignmentByID,
  API_toggleAssignmentComplete,
} from "../../utils/Plants/API_Functions";
import logo from "../../public/plant_logo.png"; //ta bort sen
import { daysFromDate } from "../../utils/daysFromDate";
import { dateToString } from "../../utils/userDateToString";

// UserAuthGuard
import UserAuthGuard from "../../components/UserAuthGuard";

{
  /* ----------------- Saker som kan läggas till/fixas: ---------------------------*/
}
{
  /* Problem/Ej klart:
      - Egen information om plantan: indikera på scrolling: gradient: typ lite mörkt längst ner när man scrollar [
        myplant.infogradient vill inte funka när den är i theme men funkar annars??
        Hjälp: Varför funkar inte gradienten när man lägger den i färg-temat?
      - Ändra planta: Varna innan användaren tar bort en planta [] - Fokusera på eller ej?
      - Ändra planta: Kunna ändra plantart och hemsida [] - Fokusera på eller ej?
      - Ändra planta: Lägg till lista som kommer upp när man väljer rum [prefill] - Fokusera på eller ej? (Förstår ej)
      - Uppgifter: Varna innan användaren tar bort en uppgift ("Are you sure..?") [] - Fokusera på eller ej?
      - Mörk bakgrund på "Location" vid dark mode (???)
    
      Ej relevant kanske:
        - Own information och information about your plant (pop up dialog?) [hinner ej]
        - Uppgifter: Tryck-ner-rutan-knapp i DialogAddAssignments [relevant?]
        - Uppgifter: Kunna ha att göra något ex. varannan vecka istället för duedate
        - Uppgifter: Kanske fixa så det blir en animation (ex. rutan blir grön) när man klickar i att uppgiften är klar [blir grön men ej relevant]
        - Ändra planta: Kameran lite buggig ibland (?).
        - Övrigt: Kunna swipea till nästa planta [relevant?]
        - Övrigt: Fixa default-bild för alla plantor? (Just nu loggan) (?????)
        - Övrigt: Dela upp koden i olika filer, t.ex. Dialogs (?????)

        Klart:
        - Ändra planta: Hantera för många tecken [x --> rum + namn]
        - Ändra planta: Remove istället för Delete bild (Edit plant) [x]
        - Ändra planta: Delete-knapp röd på plantan (Edit plant) [x]
        - Övrigt: Designfix [x]
        - Uppgifter: Undo-knapp (måste fixas en API-funktion) [x]
        - Uppgifter: Listan sorteras efter datum (mest akuta t.ex.) [x]
        - Uppgifter: Fixa en varning som kommer upp pga map-funktionen (webbläsaren) [x]
        - Uppgifter: Fixa så det re-renderera:s istället för att ladda om hela sidan vid delete/add/mark done uppgift [X]
        - Uppgifter: Visa indikation på att uppgiften är sen om datumet är passerat [x]
      ] */
}

function Plants({}) {
  // För testning: plant/plantID:
  //622f08932281005192333cad
  //623adb0414a50305eeca4994

  /* --------- Edit plant --------- 
      States för att sätta ny information samt öppna dialoger */
  const [openEdit, setOpenEdit] = React.useState(false);
  const [newName, setNewName] = useState("");
  const [newInformation, setNewInformation] = useState("");
  const [newRoom, setNewRoom] = useState("");
  const [newimageURL, setnewImageURL] = useState(null);
  const [camera, openCamera] = useState(false);
  const [openConfirm, setOpenCorfirm] = React.useState(false);
  const [openFileImage, setOpenFileImage] = React.useState(false);
  const [openCameraDialog, setOpenCameraDialog] = React.useState(false);
  const [openNewAssignmentDialog, setOpenNewAssignmentDialog] = React.useState(false);

  /* - Edit plant: Handle the opening of the whole pop-up edit-page - */
  const handleEditOpen = () => {
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
  };

  /* Edit plant: Handle a pop-up of confirming if user want to delete current picture */
  const handleConfirmOpen = () => {
    setOpenCorfirm(true);
  };

  const handleConfirmClose = () => {
    setOpenCorfirm(false);
  };

  /* Edit plant: Handle a pop-up of camera view */
  const handleCameraOpen = () => {
    setOpenCameraDialog(true);
  };

  const handleCameraClose = () => {
    setOpenCameraDialog(false);
    setnewImageURL(null);
  };

  const handleCameraCloseAndSave = () => {
    handleImageSave();
    setOpenCameraDialog(false);
  };

  /*Edit plant: Handle a pop-up of the file image the user has added */
  const handleFileImageOpen = () => {
    setOpenFileImage(true);
  };

  const handleFileImageClose = () => {
    setOpenFileImage(false);
  };

  const handleFileImageCloseAndSave = () => {
    handleImageSave();
    setOpenFileImage(false);
  };

  /* ------- Hantering av sparande av all ny information från Edit plant ------ 
      Informationen kan ändras genom att användaren klickar på pennan på sidan. 

      För att inte köra för många funktioner kollar funktionen "handleEditSave" om
      det är bara en specifik information som sparas. Måste också uppdatera den nya
      informationen utan att de andra skrivs över med en tom sträng. */
  const handleEditSave = () => {
    // För att slippa många function calls om all information ska ändras
    if (
      newName != "" &&
      newInformation != "" &&
      newRoom != "" &&
      newimageURL != ""
    ) {
      handleAllSave();
      newName = "";
      newInformation = "";
      newRoom = "";
      newimageURL = "";
    } else {
      if (newName != "") {
        handleNicknameSave();
        newName = "";
      }
      if (newInformation != "") {
        handleInformationSave();
        newInformation = "";
      }
      if (newRoom != "") {
        handleRoomSave();
        newRoom = "";
      }
      if (newimageURL != null) {
        handleImageSave();
        newimageURL = "";
      }
    }
    setnewImageURL(null);
    handleEditClose();
  };

  /* - Hantering av sparande av all ny information: Plantans namn - */
  const handleNicknameSave = () => {
    const content = {
      nickname: newName,
    };
    API_updatePlantById(plants._id, content)
      .then((response) => {
        fetchData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /* -Hantering av sparande av all ny information: Plantans information - */
  const handleInformationSave = () => {
    const content = {
      information: newInformation,
    };
    API_updatePlantById(plants._id, content)
      .then((response) => {
        fetchData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /* -Hantering av sparande av all ny information: Plantans rum - */
  const handleRoomSave = () => {
    const content = {
      location: newRoom,
    };
    API_updatePlantById(plants._id, content)
      .then((response) => {
        fetchData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /* -Hantering av sparande av all ny information: Plantans bild - */
  const handleImageSave = () => {
    const content = {
      img: newimageURL,
    };
    API_updatePlantById(plants._id, content)
      .then((response) => {
        fetchData();
      })
      .catch((error) => {
        console.log(error);
      });
    setnewImageURL(null);
  };

  /* -Hantering av sparande av all ny information: All information - */
  const handleAllSave = () => {
    const content = {
      nickname: newName,
      information: newInformation,
      location: newRoom,
      img: newimageURL,
    };
    API_updatePlantById(plants._id, content)
      .then((response) => {
        fetchData();
        handleEditClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /* ------- Hantering av uppladdning av bilder genom fil och kamera ------ */

  /* - Hantering av att bilden tas bort - 
        Här sätts bilden till en default-bild, vilket just nu är loggan.
        Loggan ändras kanske till något annat senare. */
  const handleDeleteCurrentPicture = () => {
    const content = {
      img: logo.src,
    };
    API_updatePlantById(plants._id, content)
      .then((response) => {
        fetchData();
      })
      .catch((error) => {
        console.log(error);
      });
    handleConfirmClose();
  };

  /* - Hanterar uppladdning via både fil och kamera -
           Om det laddas upp via kamera, öppnas kameran med en pop-up ruta.
           Om det laddas upp via fil visas sedan bilden i en pop-up ruta  */
  const toggleCameraView = (arg) => {
    if (arg === "camera") {
      openCamera(true);
      handleCameraOpen();
    } else {
      openCamera(false);
      handleFileImageOpen();
    }
  };

  /* - Hanterar att ladda upp bild via kamera -
        Kameran måste sättas falsk och nya informationen måste sättas.  */
  const handleTakePhoto = (dataURI) => {
    openCamera(false);
    setnewImageURL(dataURI);
  };

  /* - Hanterar att ladda upp bild via fil -
           Nya informationen måste sättas och en pop-up ruta med den uppladdade bilden visas.  */
  const handleFileUpload = (uri) => {
    setnewImageURL(uri);
    handleFileImageOpen();
  };

  /* - Dessa funktioner hanterar möjligheten att kunna ta bort
    // ett nytaget foto eller nyuppladdad fil. Informationen/bilden måste sättas till null, 
      annars ligger den kvar.  */
  const handleDeleteinCameraMode = () => {
    openCamera(true);
    setnewImageURL(null);
  };

  const handleDeleteinFileMode = () => {
    handleFileImageClose();
    setnewImageURL(null);
  };

  /* ------- Get the plant by ID: -------
      Här hämtas den specifika plantan från det
      ID som skickas med. */
  const router = useRouter();
  const { plantID } = router.query;
  console.log(plantID);
  const [plants, setPlants] = useState(null);

  const fetchData = () => {
    API_getPlantById(plantID)
      .then((response) => {
        setPlants(response.data.data[0]);
        console.log(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (plantID) {
      fetchData();
      fetchAssignments();
    }
  }, [plantID]);

  /* ------- Water plant by ID: -------
      Här sköts vattningen av plantan genom att
      plantans information uppdateras. */
  const waterPlantById = () => {
    const content = {
      last_watered: Date.now(),
    };
    API_updatePlantById(plants._id, content)
      .then((response) => {
        fetchData();
        console.log("Vattnad");
        console.log(plants.last_watered);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /* ------ Delete plant by ID: ------ */
  //API_deletePlantById(id)
  const deletePlantById = () => {
    API_deletePlantById(plants._id)
      .then((response) => {
        fetchData();
      })
      .catch((error) => {
        console.log(error);
      });
    router.push(`../`);
  };

  /* ------- Add assignments: ------- */
  const [assignments, setAssignments] = useState(null);

  // Öppnar och stänger lägg-till-uppgift-dialogen som finns i
  // filen "DialogAddAssignment"
  const handleAssignmentDialogOpen = () => {
    setOpenNewAssignmentDialog(true);
  };

  // Kallar på fetchAssignments två gånger så att den re-renderar rätt
  // Kallar man på den en gång så re-renderar den bara en gång
  const handleAssignmentDialogClose = () => {
    fetchAssignments();
    setOpenNewAssignmentDialog(false);
    fetchAssignments();
  };

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

  // Ta bort en uppgift
  // Kallar på fetchAssignments två gånger så att den re-renderar rätt
  // Kallar man på den en gång så re-renderar den bara en gång
  const deleteAssignment = (assignmentID) => {
    fetchAssignments();
    console.log("delete assignment");
    API_deleteAssignmentByID(plantID, assignmentID)
      .then((response) => {
        console.log("borta");
      })
      .catch((error) => {
        console.log(error);
      });
      fetchAssignments();
  };

  // Markera uppgift som klar
  // Kallar på fetchAssignments två gånger så att den re-renderar rätt
  // Kallar man på den en gång så re-renderar den bara en gång
  const markAssignmentAsDone = (assignmentID) => {
    fetchAssignments();
    API_toggleAssignmentComplete(plantID, assignmentID)
      .then((response) => {
        console.log("done");
      })
      .catch((error) => {
        console.log(error);
      });
      fetchAssignments();
  };

  // Loading indicator placed in the middle of the screen:
  if (!plants || !assignments) {
    return (
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  /* Variabler som visar diverse information. 
        birth_days_left kan man behöva ändra på eftersom det blir olika när det
        är skottår. */
  const daysTilWater = plants.water_interval - daysFromDate(plants.last_watered);
  const days_since_created = daysFromDate(plants.created_at);
  const birth_days_left = 365 - daysFromDate(plants.created_at);
  const birth_years = Math.ceil(daysFromDate(plants.created_at) / 365);

  /* ------- Return -------
        Det är en hel del som renderas i return. Möjligtvis skulle det kunna delas upp i olika filer.*/
  return (
    <>
    <UserAuthGuard>
      {/* ------- Bild med tillbaka-ikon, edit-ikon och rum-text -------*/}
      <Box sx={{ float: "right", marginRight: 2, marginBottom: -5 }}>
        <Typography variant="overline">
          Location: {plants.location}
        </Typography>
      </Box>

      <Card
        sx={{
          display: "grid",
          height: "18em",
          width: "100%",
          borderBottomRightRadius: 45,
          borderBottomLeftRadius: 45,
        }}
      >
        <CardContent>
          <Box sx={{ position: "absolute", top: "32%", right: "9%" }}>
            <Fab
              onClick={handleEditOpen}
              aria-label="edit"
              sx={{ position: "sticky", boxShadow: 5, backgroundColor:'myplant.fabs', color:'background.default' }}
            >
              <EditIcon />
            </Fab>
          </Box>
        </CardContent>
        <CardMedia
          component="img"
          sx={{ display: "flex", height: "100%", paddingBottom: "50%" }}
          image={plants.img}
        />
      </Card>

      {/* ------- Edit plant: -------
      -----------------------------------
      {/* Opens a pop-up window which covers the screen. Användaren kan ändra
          namn, rum, information och bild.
          Skulle kanske kunna sättas i en egen fil. */}
      <Dialog fullScreen open={openEdit} onClose={handleEditClose}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <DialogTitle sx={{ marginTop: 2, color: 'primary.main' }}>
            Edit your plant
          </DialogTitle>
          <Fab onClick={handleEditClose} sx={{ marginRight: 1, marginTop: 1 }}>
            <CloseIcon></CloseIcon>
          </Fab>
        </Box>

        <DialogContent>
          <DialogContentText>
            Here you can edit your plants name, location, information and
            picture. When you are done, press the Save-button. If your plant
            sadly has passed away, you can also delete the plant.
          </DialogContentText>

          <DialogContentText
            sx={{ marginTop: 2, fontWeight: "bold" }}
          >
            Name
          </DialogContentText>
          <DialogContentText sx={{ fontStyle: "italic" }}>
            Current name: {plants.nickname}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Write your new name here"
            inputProps={{ maxLength: 33 }}
            fullWidth
            variant="outlined"
            onChange={(e) => setNewName(e.target.value)}
          />

          <DialogContentText
            sx={{ marginTop: 2, fontWeight: "bold"}}
          >
            Room
          </DialogContentText>
          <DialogContentText sx={{ fontStyle: "italic" }}>
            Current room: {plants.location}
          </DialogContentText>
          <TextField
            margin="dense"
            id="room"
            label="Write your new room here"
            type="text"
            fullWidth
            variant="outlined"
            onChange={(e) => setNewRoom(e.target.value)}
          />

          <DialogContentText
            sx={{ marginTop: 2, fontWeight: "bold"}}
          >
            Information
          </DialogContentText>
          <TextField
            margin="dense"
            variant="outlined"
            id="description"
            label="Write your new information here"
            type="text"
            fullWidth
            multiline
            rows={3}
            onChange={(e) => setNewInformation(e.target.value)}
          />

          <DialogContentText
            sx={{ marginTop: 2, fontWeight: "bold" }}
          >
            Picture
          </DialogContentText>
          <DialogContentText>
            To change the picture you can upload a new picture or take a photo
            from your device. If you want to delete your picture you will get
            the default picture for this plant.
          </DialogContentText>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 2,
            }}
          >
            {/* - Edit plant: Filuppladdning - */}
            {/* Här hanteras möjligheten att ladda upp filen. När filen har laddats upp visas den för användaren, 
            som kan välja att behålla den eller lägga till direkt (utan att trycka på Save) */}
            <FileUploadButton onUpload={(uri) => handleFileUpload(uri)}>
              <input
                onChange={() => toggleCameraView("file")}
                hidden
                type="file"
              />
            </FileUploadButton>

            {(() => {
              if (newimageURL) {
                return (
                  <Dialog open={openFileImage} onClose={handleDeleteinFileMode}>
                    <Box>
                      <ImagePreview
                        onDelete={handleDeleteinCameraMode}
                        uri={newimageURL}
                      />
                      <DialogActions>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<AddAPhotoIcon />}
                          onClick={handleFileImageCloseAndSave}
                        >
                          Add new image
                        </Button>
                      </DialogActions>
                    </Box>
                  </Dialog>
                );
              }
            })()}

            {/* - Edit plant: Uppladdning av fil via kamera - */}
            {/* Här hanteras möjligheten att ladda upp filen via kamera. När filen har laddats upp visas den för användaren, 
            som kan välja att behålla den eller lägga till direkt (utan att trycka på Save).

            Buggar finns: Kameran är ibland för bred för dialogen och ibland dyker ej kameraknappen upp.
            Måste ofta gå till "Diary" för att fixa detta, så troligen är det att något inte uppdateras här */}
            <CameraUploadButton onClick={() => toggleCameraView("camera")} />

            <Dialog open={openCameraDialog} onClose={handleCameraClose}>
              {camera && (
                <Camera
                  isSilentMode
                  onTakePhoto={(dataUri) => handleTakePhoto(dataUri)}
                />
              )}

              {(() => {
                if (newimageURL) {
                  return (
                    <Box>
                      <ImagePreview
                        onDelete={handleDeleteinCameraMode}
                        uri={newimageURL}
                      />
                      <DialogActions>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<AddAPhotoIcon />}
                          onClick={handleCameraCloseAndSave}
                        >
                          Add new image
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={handleCameraClose}
                        >
                          Cancel
                        </Button>
                      </DialogActions>
                    </Box>
                  );
                } else {
                  return (
                    <DialogActions>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleCameraClose}
                      >
                        Cancel
                      </Button>
                    </DialogActions>
                  );
                }
              })()}
            </Dialog>

            {/* - Edit plant: Möjlighet att ta bort sin bild. - 
                En dialogruta kommer upp som frågar om användaren är säker på att ta bort bilden.
                Bilden ersätts med en default-bild. (Just nu loggan). */}
            <Button
              variant="contained"
              color="secondary"
              startIcon={<DeleteIcon />}
              onClick={handleConfirmOpen}
            >
              Remove
            </Button>

            <Dialog open={openConfirm} onClose={handleConfirmClose}>
              <DialogTitle>
                Are you sure you want to remove your current picture?
              </DialogTitle>
              <DialogActions>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleConfirmClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteCurrentPicture}
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </Box>

          {/* Slutet av Edit-plant  */}
          <DialogContentText
            sx={{ marginTop: 2, fontWeight: "bold" }}
          >
            Delete your plant
          </DialogContentText>
          <DialogContentText sx={{ fontStyle: "italic" }}>
            Obs! There is no going back for this
          </DialogContentText>
          <Button
            onClick={() => deletePlantById(plantID)}
            variant="contained"
            color="error"
            sx={{ marginTop: 1 }}
          >
            Delete
          </Button>
        </DialogContent>
        <DialogActions>
          <Box sx={{ textAlign: "center", justifyContent: "center" }}>
            <Button
              onClick={handleEditSave}
              variant="contained"
              color="primary"
            >
              Save
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* ------- Växtnamn, art och länk till hemsida -------
          Alla dessa hämtas från plants genom dess ID */}
      <Box sx={{ marginTop: 1, textAlign: "center" }}>
        <Typography variant="h5" sx={{fontWeight: "bold" }}>
          {plants.nickname}
        </Typography>

        <Box sx={{}}>
          <Typography variant="subtitle1" sx={{ color: "#828282" }}>
            {plants.flower_name}
          </Typography>
        </Box>
        <Box sx={{ marginTop: -1 }}>
          <Link variant="caption" underline="none" sx={{ color: "#828282" }}>
            {plants.wiki_url}
          </Link>
        </Box>
      </Box>

      {/* ------- Vattna-knapp och vattningsinformation ------- 
            Vattningsinformationen baseras på hur långt tid det är kvar till att vattna och därför
            kollas det vad "daysTilWater" är innan informationen returneras. */}

      <Box
        sx={{
          marginTop: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: 'myplant.default',
            padding: 1,
            marginLeft: "6%",
            borderRadius: 2,
            width: 200,
            textAlign: "center",
            boxShadow: 1,
          }}
        >
          {daysTilWater <= 0 && (
            <Typography
              variant="body1"
              sx={{ color: 'myplant.late', marginTop: "4%", fontWeight: "bold" }}
            >
              Water as soon as possible!
            </Typography>
          )}
          {daysTilWater == 1 && (
            <Typography
              variant="body1"
              sx={{marginTop: "4%", fontWeight: "bold" }}
            >{`Water tomorrow`}</Typography>
          )}
          {daysTilWater > 1 && (
            <Typography
              variant="body1"
              sx={{marginTop: "4%" }}
            >{`Water in ${daysTilWater} days`}</Typography>
          )}
        </Box>

        <Box sx={{ textAlign: "center", padding: 1, marginRight: "6%" }}>
          <Button
            onClick={waterPlantById}
            sx={{ minWidth: 110 }}
            variant="contained"
            color="primary"
            startIcon={<OpacityIcon />}
          >
            Water
          </Button>
        </Box>
      </Box>

      <Box sx={{ marginLeft: "6%"}}>
        <Typography variant="overline" sx={{ color: "secondary" }}>
          Water interval: every {plants.water_interval}th day
        </Typography>
      </Box>

      {/* ------- Dagbok-knapp och information om hur länge växten levt osv ------- 
            Informationen hanteras olika beroende hur lång tid användaren har haft växten.
            Blir lite roligare information. */}
      <Box
        sx={{
          marginTop: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box 
          sx={{
            backgroundColor: 'myplant.default',
            padding: 1,
            marginLeft: "6%",
            borderRadius: 2,
            width: 200,
            textAlign: "center",
            boxShadow: 1,
          }}
        >
          {(() => {
            if (days_since_created == 0) {
              return (
                <Typography variant="body1">
                  This is your first day taking care of this plant. Why not add
                  a picture and a diary entry?
                </Typography>
              );
            } else if (days_since_created > 1 && birth_days_left == 1) {
              return (
                <Typography variant="body1">
                  You have taken care of this plant for {days_since_created}{" "}
                  days. It turns {birth_years} tomorrow!
                </Typography>
              );
            } else {
              return (
                <Typography variant="body1">
                  You have taken care of this plant for {days_since_created}{" "}
                  days. It turns {birth_years} in {birth_days_left} days.
                </Typography>
              );
            }
          })()}
        </Box>

        <Box sx={{ padding: 1, marginRight: "6%" }}>
          <Button
            onClick={() => router.push(`../diary/${plantID}`)}
            sx={{ minWidth: 110 }}
            variant="contained"
            color="primary"
            startIcon={<ViewTimelineIcon />}
          >
            Diary
          </Button>
        </Box>
      </Box>

      {/* ------- Egen Information om plantan ------- 
              Om ingen information om plantan finns, sägs detta till användaren. 
              Annars visas användarens egna information. */}
      <Box
        sx={{
          direction: "row",
          alignItems: "center",
          marginTop: 2,
          textAlign: "center",
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        <Typography variant="h6">
          Own information
        </Typography>
      </Box>

        {(() => {
          if (!plants.information) {
            return (
              <Box
                sx={{textAlign: "center", alignItems: "center", marginTop: 1, marginLeft: "6%", borderRadius: 2,
                  background: 'myplant.default', 
                  padding: 1, width: "88%", textAlign: "center", boxShadow: 1}}>
                <Typography variant="body1">
                  Clicking on the pen above to add own information about your
                  plant!
                </Typography>
              </Box>
            );
          } else if (plants.information.length > 300){
            return (
              <Box sx={{textAlign: "center", alignItems: "center", marginTop: 1, marginLeft: "6%", borderRadius: 2,
                        backgroundColor: 'myplant.default',
                        padding: 1, width: "88%", textAlign: "center", boxShadow: 1, overflow: "scroll"}}>
                <Typography variant="body1" sx={{maxHeight: "20em" }}>
                  {plants.information}
                </Typography>
              </Box>
            );
          }
          else {
            return (
              <Box sx={{textAlign: "center", alignItems: "center", marginTop: 1, marginLeft: "6%", borderRadius: 2,
              backgroundColor: 'myplant.default',
                        padding: 1, width: "88%", textAlign: "center", boxShadow: 1}}>
                <Typography variant="body1" sx={{maxHeight: "20em" }}>
                  {plants.information}
                </Typography></Box>
            );
          }
        })()}

      {/* ------- Uppgifter  ------- */}

      {/* Uppgifter: Om uppgifter finns, visa titel "Assignments" med en plus-knapp brevid
              Om inte, visa titel "Assigments", indikera att uppgifter inte finns och en större knapp  */}
      {(() => {
        if (assignments.length) {
          return (
            <Box
              sx={{
                textAlign: "center",
                marginTop: 2,
                marginBottom: 2,
                position: "relative",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">
                Assignments
              </Typography>
              <Fab
                onClick={handleAssignmentDialogOpen}
                size="small"
                sx={{ boxShadow: 2, position: "absolute", top: -3, right: "20%", backgroundColor:'myplant.fabs', color:'background.default' }}
              >
                <AddIcon />
              </Fab>
            </Box>
          );
        } else {
          return (
            <Box
              sx={{
                direction: "row",
                alignItems: "center",
                textAlign: "center",
                marginTop: 2,
                marginBottom: 2,
              }}
            >
              <Typography variant="h6">
                Assignments
              </Typography>

              <Box
                sx={{
                  marginTop: 2,
                  position: "center",
                  textAlign: "center",
                  marginBottom: 10,
                }}
              >
                <Button
                  onClick={handleAssignmentDialogOpen}
                  variant="contained"
                  color="primary"
                  endIcon={<AddCircleIcon />}
                >
                  Add a new assignment
                </Button>
              </Box>
            </Box>
          );
        }
      })()}

      {/* Uppgifter: Om uppgifter finns, och:
                Uppgift klar: Visa dessa först med annan text och färg
                Uppgifter ej klar: Visa efter.
                Sorteras efter datum (äldst först)  */}

      {(() => {
        if (assignments.length) {
          return assignments
          .sort((a, b) => a.duedate > b.duedate ? 1 : -1)
          .map((assignment, i) => {
            if (assignment.done) {
              return (
                <Box
                  key={assignment._id}
                  sx={{
                    marginTop: 1,
                    textAlign: "center",
                    position: "relative",
                    backgroundColor: 'myplant.doneassignment',
                    borderRadius: 2,
                    width: "88%",
                    marginLeft: "6%",
                    boxShadow: 1,
                    padding: 3,
                    height: "7em",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{fontWeight: "bold" }}
                  >
                    {assignment.text}
                  </Typography>

                  <Box
                    sx={{
                      verticalAlign: "middle",
                      display: "inline-flex",
                      alignItems: "center",
                      marginTop: 1,
                    }}
                  >
                    <TaskAltIcon sx={{position: "absolute", marginLeft: "-8%", color: 'myplant.doneicon'}} />
                    <Typography variant="body1" sx={{}}>
                      Completed
                    </Typography>
                    
                  </Box>

                  <Box sx={{ left: 5, top: 5, position: "absolute" }}>
                    <Fab
                      onClick={() => deleteAssignment(assignment._id)}
                      sx={{ minWidth: 10, borderRadius: 10, boxShadow: 3, backgroundColor:'myplant.fabs', color:'background.default' }}
                      size="small"
                      variant="contained"
                    >
                      <DeleteIcon />
                    </Fab>
                  </Box>

                  <Box sx={{ right: 5, bottom: 5, position: "absolute" }}>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={() => markAssignmentAsDone(assignment._id)}
                      startIcon={<UndoIcon />}
                    >
                      Undo
                    </Button>
                  </Box>
                </Box>
              );
            }

            return (
              <Box
                sx={{
                  marginTop: 1,
                  textAlign: "center",
                  position: "relative",
                  backgroundColor: 'myplant.default',
                  height: "8em",
                  borderRadius: 2,
                  width: "88%",
                  marginLeft: "6%",
                  boxShadow: 1,
                  padding: 2,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{fontWeight: "bold" }}
                >
                  {assignment.text}
                </Typography>

                <Box sx={{ left: 5, top: 5, position: "absolute" }}>
                  <Fab
                    onClick={() => deleteAssignment(assignment._id)}
                    sx={{ minWidth: 10, borderRadius: 10, boxShadow: 3, backgroundColor:'myplant.fabs', color:'background.default' }}
                    
                    size="small"
                    variant="contained"
                  >
                    <DeleteIcon />
                  </Fab>
                </Box>

                {/** Indikera att uppgiften är sen om den är det: */}
                {(() => {
                  if (new Date(assignment.duedate) - Date.now() <= 0) {
                    return (
                      <Box sx={{
                        verticalAlign: "middle",
                        display: "inline-flex",
                        alignItems: "center",
                        marginTop: 1,
                    }}
                  >
                        <Typography variant="body1" sx={{color:'myplant.late', fontWeight: "bold"}}>
                          Duedate: {dateToString(assignment.duedate)}
                        </Typography>
                        <AssignmentLateIcon sx={{color:'myplant.late', position: "absolute", marginLeft: "55%"}}/>
                  </Box>   
                  )
                  } else {
                  return (
                    <Typography variant="body1" sx={{ marginTop: 1 }}>
                      Duedate: {dateToString(assignment.duedate)}
                    </Typography>
                  )}
                })()}

                <Button
                  onClick={() => markAssignmentAsDone(assignment._id)}
                  sx={{ marginTop: 1 }}
                  size="small"
                  variant="contained"
                  startIcon={<AddTaskIcon />}
                >
                  Mark as done
                </Button>
              </Box>
            );
          });
        }
      })()}

      {/* Dialog som öppnas när användaren trycker på att lägga till en uppgift*/}
      <DialogAddAssignment
        open={openNewAssignmentDialog}
        onClose={handleAssignmentDialogClose}
        plantID={plantID}
      ></DialogAddAssignment>
      </UserAuthGuard>
    </>
  );
}
export default Plants;
