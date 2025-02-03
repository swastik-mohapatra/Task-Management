import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface SystemConfigState {
  taskDetails: Record<string, any>;
  taskGetDetails: any[];
}

type SystemConfigKeys = keyof SystemConfigState;

interface AccessDataPayload {
  type: SystemConfigKeys;
  response: any;
}

export const systemConfigReducer = createSlice({
  name: "systemConfigReducer",
  initialState: {
    taskDetails: {},
    taskGetDetails:[]
  } as SystemConfigState, 
  reducers: {
    setAccessData: (state, action: PayloadAction<AccessDataPayload>) => {
      state[action.payload.type] = action.payload.response;
    },
  },
});

export const { setAccessData } = systemConfigReducer.actions;
export default systemConfigReducer.reducer;
