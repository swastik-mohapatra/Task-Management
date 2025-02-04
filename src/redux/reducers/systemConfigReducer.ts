import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SystemConfigState {
  taskDetails: Record<string, any>;
  taskGetDetails: any[];
  loading: boolean;
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
    taskGetDetails:[],
    loading: false,
  } as SystemConfigState, 
  reducers: {
    setAccessData: (state, action: PayloadAction<AccessDataPayload>) => {
      state[action.payload.type] = action.payload.response;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setAccessData,setLoading } = systemConfigReducer.actions;
export default systemConfigReducer.reducer;
