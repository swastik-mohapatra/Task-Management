import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SystemConfigState {
  taskDetails: Record<string, any>;
  taskGetDetails: any[];
  taskIdDetails:any[];
  loading: boolean;
  selectedCategory:string;
  sortOrder:string
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
    taskGetDetails: [],
    taskIdDetails:[],
    loading: false,
    selectedCategory:"",
    sortOrder:"asc"
  } as SystemConfigState,
  
  reducers: {
    setAccessData: (state, action: PayloadAction<AccessDataPayload>) => {
      (state[action.payload.type] as any) = action.payload.response;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    reorderTasks: (state, action: PayloadAction<any[]>) => {
      state.taskGetDetails = action.payload;
    },
  },
});

export const { 
  setAccessData, 
  setLoading, 
  reorderTasks 
} = systemConfigReducer.actions;

export default systemConfigReducer.reducer;