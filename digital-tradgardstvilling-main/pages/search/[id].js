import plants from "../../utils/textSearch_list.json";
import { useRouter } from "next/router";
import UserAuthGuard from "../../components/UserAuthGuard";
import AddIcon from "@mui/icons-material/Add";
import React, { useState } from "react";

import {
    Box,
    Stack,
    Container,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Button,
    Grid
} from "@mui/material";

function Category() {
    const router = useRouter();
    const Plants = plants.plants
    const { id } = router.query


    //styling för resultatrutor
    const result = {
        minHeight: '8vh',
        border: 1,
        borderColor: 'gray',
        padding: '5px 5px',
        borderRadius: 2,
        m: 0.5,
    };

    const filterPlants = (array) => {
        return array.filter(planta => {
            return planta.categories.includes(id)
        })
    }

    const [categoryInfo, setCategoryInfo] = useState(null);

    const getInfo = () => {
        if (id == "cacti") {
            
            return "Cacti and succulents are easy to care for and generally don't need a lot of water."
        }
        if (id == "easy") {
            return "These are plants that are easy to care for."
        }
        if (id == "flowering") {
            return "These plants have flowers. Sometimes or always."
        }
        if (id == "herbs") {
            return "Growing your own herbs and spices is an easy way for a more flavourful life."
        }
    }

    return (
        <UserAuthGuard>
            <Container maxWidth="xs">
                <Stack spacing={0}>
                    
                    {getInfo()}
                    
                    {filterPlants(Plants).map((val, key) => {
                        return (
                            <Grid key={key} xs={6} minWidth={"100%"} marginTop={2} item>
                                <div key={key}>
                                    <Card display="flex">
                                        <Stack direction="row">
                                            <CardMedia
                                                component="img"
                                                sx={{ width: 100 }}
                                                image={val.picture}
                                                alt="Bild på växt"
                                            />
                                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                                <CardContent sx={{ flex: "1 0 auto" }}>
                                                    <Typography component="div" variant="h5">
                                                        {val.plantName}
                                                    </Typography>
                                                    <Typography component="div" variant="p">
                                                        {val.scientificName}
                                                    </Typography>
                                                    <Button
                                                        onClick={() => handleSelectPlant(val)}
                                                        variant="contained"
                                                        startIcon={<AddIcon />}
                                                        component="span"
                                                        color="primary"
                                                    >
                                                        Lägg till
                                                    </Button>
                                                </CardContent>
                                            </Box>
                                        </Stack>
                                    </Card>
                                </div>
                            </Grid>
                        );
                    })}

                </Stack>
            </Container>

        </UserAuthGuard>
    )


}
export default Category;