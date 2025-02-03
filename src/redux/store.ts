import { configureStore } from "@reduxjs/toolkit";
import reducers from "./reducers/index";
 
const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
    }),
});
 
export default store;