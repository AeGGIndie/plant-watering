import {
  FETCH_PLANTS_REQUEST,
  FETCH_PLANTS_SUCCESS,
  FETCH_PLANTS_FAIL,
} from "./plantTypes";
import axios from "axios";

export const fetchPlantsRequest = () => {
  return {
    type: FETCH_PLANTS_REQUEST,
  };
};

const fetchPlantsSuccess = (plants) => {
  return {
    type: FETCH_PLANTS_SUCCESS,
    payload: plants,
  };
};

const fetchPlantsFail = (error) => {
  return {
    type: FETCH_PLANTS_FAIL,
    payload: error,
  };
};

export const fetchPlants = () => {
  return (dispatch) => {
    dispatch(fetchPlantsRequest());
    axios
      .get("http://localhost:8008/plants")
      .then((response) => {
        const plants = response.data;
        dispatch(fetchPlantsSuccess(plants));
      })
      .catch((error) => {
        const errorMsg = error.message;
        dispatch(fetchPlantsFail(errorMsg));
      });
  };
};
