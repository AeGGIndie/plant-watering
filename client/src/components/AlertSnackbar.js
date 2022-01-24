import { useState } from "react";
import { Button } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const AlertSnackbar = ({ disableButton, buttonState, toggleState }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    toggleState();
    if (!buttonState) {
      setOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const action = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleClose}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  return (
    <>
      <Button disabled={disableButton} variant="contained" onClick={handleOpen}>
        {buttonState ? "Stop" : "Water Me!"}
      </Button>
      <Snackbar
        open={open}
        autoHideDuration={4500}
        onClose={handleClose}
        message="Watering plant..."
        action={action}
      />
    </>
  );
};

export default AlertSnackbar;
