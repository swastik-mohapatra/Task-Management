import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import AddTaskModal from "./AddTaskModal";
import { useDispatch, useSelector } from "react-redux";
import { setAccessData } from "../redux/reducers/systemConfigReducer";
import { collection, endAt, getDocs, orderBy, query, startAt, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { getTaskData } from "../utils/taskGetService";

const FilterCreateTasks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [addText, setAddText] = useState(false);

  const dispatch = useDispatch();
  const isSmallScreen = useMediaQuery("(max-width: 640px)");

  const selectedCategoryId = useSelector(
    (state) => state?.systemConfigReducer?.selectedCategory
  );

  useEffect(() => {
    if (searchTerm === "") {
      getTaskData(dispatch);
      return;
    }

    const fetchResults = async () => {
      const q = query(
        collection(db, "tasks"),
        orderBy("taskName"),
        startAt(searchTerm),
        endAt(searchTerm + "\uf8ff")
      );

      try {
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch(setAccessData({ type: "taskGetDetails", response: data }));
      } catch (error) {
        console.error("Error searching tasks:", error);
      }
    };

    const timeoutId = setTimeout(fetchResults, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchTasksByCategory = async (categoryId) => {
    try {
      let q = collection(db, "tasks");

      if (categoryId) {
        q = query(q, where("categoryId", "==", categoryId));
      }

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      dispatch(setAccessData({ type: "taskGetDetails", response: data }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    if (selectedCategoryId === "") {
      getTaskData(dispatch);
    }
    fetchTasksByCategory(selectedCategoryId);
  }, [selectedCategoryId]);

  return (
    <>
      <div className={`flex ${isSmallScreen ? "flex-col gap-3" : "justify-between items-center"}`}>
        {/* Filter Section */}
        <div className={`flex ${isSmallScreen ? "flex-col gap-2" : "gap-4"}`}>
          <div>Filter By:</div>
          <Box className={`flex ${isSmallScreen ? "flex-col gap-2" : "gap-2"}`}>
            <FormControl sx={{ width: "auto" }}>
              <Select
                value={selectedCategoryId}
                onChange={(event) =>
                  dispatch(setAccessData({ type: "selectedCategory", response: event.target.value }))
                }
                size="small"
                displayEmpty
                sx={{
                  borderRadius: "16px",
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
                <MenuItem value="W">Work</MenuItem>
                <MenuItem value="P">Personal</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </div>

        {/* Search & Add Task Section */}
        <div className={`flex ${isSmallScreen ? "flex-col gap-3" : "gap-4"}`}>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-2 pointer-events-none">
              <CiSearch />
            </div>
            <input
              type="search"
              className="block p-2 ps-8 text-sm text-gray-900 border border-gray-300 rounded-2xl bg-gray-50 dark:border-gray-600 placeholder-gray-700"
              placeholder="Search"
              required
              onChange={(e) => setSearchTerm(e.target.value)}
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
              dispatch(setAccessData({ type: "taskDetails", response: {} }));
              setOpenAddModal(!openAddModal);
            }}
          >
            ADD TASKS
          </Button>
        </div>

        {/* Add Task Modal */}
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
