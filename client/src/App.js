import { useEffect, useState } from "react";
import axios from "axios";
import { Grid } from "@mui/material";
import Plant from "./components/Plant";

const App = () => {
  const [officePlants, setPlants] = useState([]);
  useEffect(() => {
    const retrievePlants = async () => {
      const response = await axios.get("http://localhost:8008/plants");
      console.log(response);
      if (!response || !response.data) {
        setPlants(null);
      }
      setPlants(response.data);
    };
    retrievePlants();
  }, []);

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
      </Grid>
      <Grid item xs={2} />
    </Grid>
  );
};

export default App;
