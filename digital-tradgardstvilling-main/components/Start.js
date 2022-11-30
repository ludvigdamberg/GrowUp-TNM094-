//call the database dataCard.json where it gets images and texts for the startsida.

import React, { useState } from "react";
//import { Box, List, Tag, ListItem, Divider } from "@chakra-ui/core";
//import { Pagination } from "@material-ui/lab";
import usePagination from "./Pagination";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Button, CardActionArea, CardActions, Card } from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import logo from "../public/plant_logo.png";

import { default as data } from "./dataCard.json";
import { Dialog } from "@mui/material";
import { CardContent } from "@mui/material";
import { Typography } from "@mui/material";
import { PaddingOutlined } from "@mui/icons-material";
import PaginationItem from "@mui/material/PaginationItem";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { Box } from "@mui/system";

export default function Start() {
  let [page, setPage] = useState(1);
  const PER_PAGE = 1;

  const count = Math.ceil(data.length / PER_PAGE);
  const _DATA = usePagination(data, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  const [open, setOpen] = React.useState(true);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={handleClickOpen} fullWidth size="small" margin={4}>
        Information
      </Button>

      <Dialog open={open} onClose={handleClose} height="object-contain">
        {/* <List p="10" pt="3" spacing={2}>
        {_DATA.currentData().map(v => {
          return (
            <ListItem key={v.id} listStyleType="disc">
              <span>{v.sku}</span>{" "}
              <Divider display="inline" orientation="vertical" />
              <span> {v.category_type}</span>{" "}
              <Divider display="inline" orientation="vertical" />
              <span>
                <Tag color="#0f4211">${v.msrp}</Tag>
              </span>
            </ListItem>
          );
        })}
      </List> */}

        <Card>
          {_DATA.currentData().map((v) => {
            return (
              <CardContent key={v.id}>
                <CardMedia
                  component="img"
                  src={v.image}
                  //src={logo.src}
                  //height="object-contain"
                />

                <Typography
                  utterBottom
                  variant="h5"
                  color="primary"
                  textAlign="center"
                >
                  {v.titel}
                </Typography>

                <Typography
                  variant="body2"
                  color="secondary"
                  textAlign="center"
                  marginTop={1}
                >
                  {v.text}
                </Typography>
                {page === 4 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "1rem",
                    }}
                  >
                    <Button onClick={() => setOpen(false)} variant="contained">
                      Continue
                    </Button>
                  </Box>
                )}
              </CardContent>
            );
          })}

          <Stack sx={{ margin: 5 }} spacing={2}>
            <Pagination
              color="primary"
              count={count}
              page={page}
              onChange={handleChange}
            />
          </Stack>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "1rem",
            }}
          >
            {page !== 4 && (
              <Typography
                onClick={() => setOpen(false)}
                textAlign={"center"}
                variant="body"
                color="primary"
              >
                Skip intro
              </Typography>
            )}
          </Box>
        </Card>
      </Dialog>
    </div>
  );
}
