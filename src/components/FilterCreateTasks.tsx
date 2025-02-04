import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import AddTaskModal from "./AddTaskModal";
import { useDispatch } from "react-redux";
import { setAccessData } from "../redux/reducers/systemConfigReducer";

const FilterCreateTasks = () => {
  const [age, setAge] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [addText, setAddText] = useState(false);

  const dispatch = useDispatch()

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <div>Filter By: </div>
          <Box className="flex gap-2">
            <FormControl sx={{ width: "auto" }}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                onChange={handleChange}
                size="small"
                displayEmpty
                sx={{
                  borderRadius: "16px",
                  paddingX: "8px",
                  minWidth: "80px",
                  fontSize: "14px",
                  height: "28px",
                  "& .MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                    paddingY: "4px",
                  },
                }}
              >
                <MenuItem value="" disabled>
                  Category
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ width: "auto" }}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                onChange={handleChange}
                size="small"
                displayEmpty
                sx={{
                  borderRadius: "16px",
                  paddingX: "8px",
                  minWidth: "80px",
                  fontSize: "14px",
                  height: "28px",
                  "& .MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                    paddingY: "4px",
                  },
                }}
              >
                <MenuItem value="" disabled>
                  Due Date
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-2 pointer-events-none">
              <CiSearch />
            </div>
            <input
              type="search"
              className="block p-2 ps-8 text-sm text-gray-900 border border-gray-300 rounded-2xl bg-gray-50 dark:border-gray-600 dark:text-white placeholder-gray-700"
              placeholder="Search"
              required
            />
          </div>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#7B1984",
              borderRadius: "22px",
              paddingX: "29px",
            }}
            onClick={() => {
              setAddText(!addText);
              dispatch(setAccessData({type: 'taskDetails', response: {}}))
              setOpenAddModal(!openAddModal);
            }}
          >
            ADD TASKS
          </Button>
        </div>
        {openAddModal && (
          <AddTaskModal
          addText={addText}
            openAddModal={openAddModal}
            setOpenAddModal={setOpenAddModal}
          />
        )}
      </div>
    </>
  );
};

export default FilterCreateTasks;
