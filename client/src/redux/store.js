import { createStore, applyMiddleware } from "redux";
import reduxLogger from "redux-logger";
import thunk from "redux-thunk";
import plantReducer from "./plants/plantReducer";

const store = createStore(plantReducer, applyMiddleware(reduxLogger, thunk));

export default store;
