import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TaskDetails {
  taskId: string;
  taskName: string;
  description: string;
  status: string;
  dueDate: string;
  createdBy: string;
}

interface SystemConfigState {
  taskDetails: TaskDetails;
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
    taskDetails: {
      taskId: "",
      taskName: "",
      description: "",
      status: "",
      dueDate: "",
      createdBy: ""
    },
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
