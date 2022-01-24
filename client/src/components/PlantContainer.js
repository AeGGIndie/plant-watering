import { useEffect } from "react";
import { connect } from "react-redux";
import { fetchPlants } from "../redux";
import Plant from "./Plant";
import { Typography } from "@mui/material";

const PlantContainer = ({ plantData, fetchPlants }) => {
  useEffect(() => {
    fetchPlants();
  }, []);
  console.log(plantData);
  return plantData.loading ? (
    <Typography>Loading</Typography>
  ) : plantData.error ? (
    <div>{plantData.error}</div>
  ) : (
    <>
      {plantData.length > 0 &&
        plantData.map((plant) => <Plant key={plant.id} data={plant} />)}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    plantData: state.plants,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPlants: () => dispatch(fetchPlants()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlantContainer);
