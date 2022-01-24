import {
  FETCH_PLANTS_REQUEST,
  FETCH_PLANTS_SUCCESS,
  FETCH_PLANTS_FAIL,
} from "./plantTypes";

const initialState = {
  loading: false,
  plants: [],
  error: "",
};

const plantReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PLANTS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_PLANTS_SUCCESS:
      return {
        loading: false,
        plants: action.payload,
        error: "",
      };
    case FETCH_PLANTS_FAIL:
      return {
        loading: false,
        users: [],
        error: action.payload,
      };
    default:
      return state;
  }
};

export default plantReducer;
