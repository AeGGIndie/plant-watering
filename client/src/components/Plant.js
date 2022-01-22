import { Paper, Grid, Alert, Snackbar } from "@mui/material";
import LinearProgressWithLabel from "./LinearProgressWithLabel";
import AlertSnackbar from "./AlertSnackbar";
import { useEffect, useState } from "react";

const COOLDOWN = 10;

const Plant = ({ data }) => {
  const [disabled, setDisabled] = useState(false); // button
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [open, setOpen] = useState(false); // snackbar
  const [progress, setProgress] = useState(0);

  const toggle = () => {
    setIsActive(!isActive);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    /* Turn on the timer when button is pressed */
    let interval = null;
    if (isActive) {
      setDisabled(true);
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
        setProgress(((seconds + 1) / COOLDOWN) * 100);
      }, 1000);
      /* When isActive is disabled, clear the timer */
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }

    console.log("timer:", seconds);

    /* Check the time accumulated */
    if (seconds === COOLDOWN) {
      /* TODO: TURN EVERYTHING HERE INTO ONE FUNCTION */

      console.log("clearing...");
      clearInterval(interval);
      setIsActive(false);
      setSeconds(0);
      setDisabled(false);
      setOpen(true);
      setTimeout(() => {
        setProgress(0);
      }, 1000);

      /* Make HTTP Request to .NET API */
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
        <img src={"plant.png"} alt="plant" />
      </Paper>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Successfully watered!
        </Alert>
      </Snackbar>
      <AlertSnackbar buttonState={disabled} toggleState={toggle} />
      <LinearProgressWithLabel value={progress} />
    </Grid>
  );
};

export default Plant;
