import { Paper, Grid, Alert, Snackbar, Badge } from "@mui/material";
import LinearProgressWithLabel from "./LinearProgressWithLabel";
import AlertSnackbar from "./AlertSnackbar";
import { useEffect, useState } from "react";
import axios from "axios";

const COOLDOWN = 10;

const Plant = ({ data }) => {
  const [disabled, setDisabled] = useState(false); // button
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [open, setOpen] = useState(false); // snackbar
  const [progress, setProgress] = useState(0);

  const toggle = () => {
    if (!isActive == false) {
      setSeconds(0);
    }
    setIsActive(!isActive);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    setProgress(0);
  };

  const waterAction = async () => {
    const response = await axios.put(`http://localhost:8008/plants/${data.id}`);
    if (!response || !response.data) {
      /* TODO: Create another snackbar to notify the user of an error */
    }
    /* Clear all states related to timer and snackbars */
    console.log("clearing...");
    setIsActive(false);
    setSeconds(0);
    setOpen(true);
    setTimeout(() => {
      setProgress(0);
    }, 1000);
    setTimeout(() => {
      setDisabled(false);
    }, 5 * 1000);
  };

  useEffect(() => {
    /* Turn on the timer when button is pressed */
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
        setProgress(((seconds + 1) / COOLDOWN) * 100);
      }, 1000);
      /* When isActive is disabled, clear the timer */
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }

    console.log(`${data.id} - timer:`, seconds);

    /* Check the time accumulated */
    if (seconds === COOLDOWN) {
      /* Make HTTP Request to .NET API and clear/set states */
      setDisabled(true);
      clearInterval(interval);
      waterAction();
    }

    return () => clearInterval(interval);
  }, [isActive, seconds]);

  return (
    <Grid
      item
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        maxWidth: "md",
      }}
    >
      <Paper
        sx={{
          width: "130px",
          margin: "0.2em",
        }}
      >
        <Badge badgeContent={data.id} color="primary">
          <img src={"plant.png"} alt="plant" />
        </Badge>
      </Paper>
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Successfully watered!
        </Alert>
      </Snackbar>
      <AlertSnackbar
        disableButton={disabled}
        buttonState={isActive}
        toggleState={toggle}
      />
      <LinearProgressWithLabel value={progress} />
    </Grid>
  );
};

export default Plant;
