import { useEffect, useState } from "react";
import axios from "axios";
import { Grid, Snackbar, Alert } from "@mui/material";
import Plant from "./components/Plant";
import { useInterval } from "./hooks/useInterval";

const POLLING_INTERVAL = 1000 * 60 * 5;

const App = () => {
  const [officePlants, setPlants] = useState([]);
  const [notificationMsg, setMsg] = useState("");
  const [displayNotif, setDisplay] = useState(false);

  const handleNotifOpen = (dehydratedPlants) => {
    const plantsString = dehydratedPlants.reduce(
      (prev, curr) => prev + ` ${curr.id} `,
      ""
    );
    setMsg(`The following plants require attention: ${plantsString}`);
    setDisplay(true);
  };

  const handleNotifClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setDisplay(false);
  };

  useEffect(() => {
    const retrievePlants = async () => {
      const response = await axios.get("http://localhost:8008/plants");
      if (!response || !response.data) {
        setPlants(null);
      }
      setPlants(response.data);
    };
    retrievePlants();
  }, []);

  useInterval(async () => {
    // console.log("Checking last watered times...");
    const response = await axios.get("http://localhost:8008/remind");
    if (!response || !response.data || response.data.length === 0) {
      return;
    }

    /* Notify the user using the snackbar */
    handleNotifOpen(response.data);
  }, POLLING_INTERVAL);

  return (
    <Grid container>
      <Grid item xs={2} />
      <Grid item xs={8} sx={{ height: "8rem" }} />
      <Grid item xs={2} />
      <Grid item xs={2} />
      <Grid
        item
        container
        xs={8}
        spacing={2}
        sx={{
          display: "flex",
          justifyContent: "center",
          border: 1,
          background: "white",
          borderColor: "white",
          borderRadius: "18px",
          padding: "2rem",
        }}
      >
        {officePlants &&
          officePlants.map((plant) => <Plant key={plant.id} data={plant} />)}
        <Snackbar
          open={displayNotif}
          autoHideDuration={6000}
          onClose={handleNotifClose}
        >
          <Alert onClose={handleNotifClose} severity="info">
            {notificationMsg}
          </Alert>
        </Snackbar>
      </Grid>
      <Grid item xs={2} />
    </Grid>
  );
};

export default App;
