import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

interface AddTaskModalProps {
  openAddModal: (value: any) => void;
  setOpenAddModal: (value: any) => void;
}

const AddTaskModal = ({ openAddModal, setOpenAddModal }: AddTaskModalProps) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/75 flex justify-center items-center z-[100]">
      <div className="relative bg-[#FFFFFF] rounded-lg shadow w-2xl max-h-screen overflow-auto flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-2 md:p-3 border-b rounded-t">
          <h3 className="text-xl font-semibold text-gray-900">Create Task</h3>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-lg w-8 h-8 flex justify-center items-center"
            onClick={() => setOpenAddModal(false)}
          >
            <span className="sr-only">Close modal</span>✖
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 md:p-4 space-y-4 flex-grow">
          <div>
            <TextField
              label="Task Title"
              variant="outlined"
              fullWidth
              size="small"
            />
          </div>
          <div>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              size="small"
              multiline
              rows={4}
            />
          </div>
          <div className="flex gap-6">
            <div className="flex flex-col flex-1">
              <label className="text-sm font-medium mb-2">Task Category</label>
              <ToggleButtonGroup
                color="primary"
                exclusive
                aria-label="Platform"
                fullWidth
              >
                <ToggleButton size="small" value="work">
                  Work
                </ToggleButton>
                <ToggleButton size="small" value="personal">
                  Personal
                </ToggleButton>
              </ToggleButtonGroup>
            </div>

            {/* Due on */}
            <div className="flex flex-col flex-1">
              <label className="text-sm font-medium mb-2">Due on</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label=""
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              </LocalizationProvider>
            </div>

            {/* Task Status */}
            <div className="flex flex-col flex-1">
              <label className="text-sm font-medium mb-2">Task Status</label>
              <FormControl fullWidth>
                <Select
                  labelId="task-status-label"
                  id="task-status"
                  size="small"
                >
                  <MenuItem value="">Choose</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-2 p-3 md:p-2 border-t border-gray-200 bg-[#F1F1F1] rounded-b">
          <button
            type="button"
            className="text-black border border-[#00000030] duration-500 hover:bg-white hover:text-[#7B1984] focus:ring-4 focus:outline-none hover:border-[#7B1984] font-medium rounded-2xl text-sm px-4 py-2"
            onClick={() => setOpenAddModal(false)}
          >
            Close
          </button>
          <button
            type="button"
            className="text-white bg-[#7B1984] border duration-500 hover:bg-white hover:text-[#7B1984] focus:ring-4 focus:outline-none hover:border-[#7B1984] font-medium rounded-2xl text-sm px-4 py-2"
            onClick={() => setOpenAddModal(false)}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
