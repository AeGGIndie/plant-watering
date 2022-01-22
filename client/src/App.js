import { Grid, Box } from "@mui/material";

import Plant from "./components/Plant";
import officePlants from "./officePlants";

const App = () => {
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
        {officePlants.map((plant) => (
          <Plant key={plant.id} data={plant} />
        ))}
      </Grid>
      <Grid item xs={2} />
    </Grid>
  );
};

export default App;
