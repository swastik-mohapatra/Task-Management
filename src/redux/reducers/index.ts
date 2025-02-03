import { combineReducers } from "redux";
import systemConfigReducer from "./systemConfigReducer";
 
const reducers = combineReducers({
  systemConfigReducer: systemConfigReducer,
 
});
 
export default reducers;