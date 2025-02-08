import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react"; // Removed useEffect
import { CiSearch } from "react-icons/ci";
import AddTaskModal from "./AddTaskModal";
import { useDispatch, useSelector } from "react-redux";
import { setAccessData } from "../redux/reducers/systemConfigReducer";
import {
  collection,
  endAt,
  getDocs,
  orderBy,
  query,
  startAt,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { getTaskData } from "../utils/taskGetService";
import { auth } from "../config/firebase";
import { TbSortAscending, TbSortDescending } from "react-icons/tb";

const FilterCreateTasks = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [addText, setAddText] = useState(false);

  const dispatch = useDispatch();
  const isSmallScreen = useMediaQuery("(max-width: 640px)");

  const selectedCategoryId = useSelector(
    (state: { systemConfigReducer: { selectedCategory: string } }) =>
      state.systemConfigReducer.selectedCategory
  );

  const sortOrder = useSelector(
    (state: { systemConfigReducer: { selectedCategory: string } }) =>
      state.systemConfigReducer.sortOrder
  );

  interface Task {
    id: string;
    [key: string]: any;
  }

  const handleSearch = async (value: string) => {
    if (value === "") {
      getTaskData(dispatch);
      return;
    }

    try {
      const q = query(
        collection(db, "tasks"),
        where("userId", "==", auth?.currentUser?.uid),
        orderBy("taskName"),
        startAt(value),
        endAt(value + "\uf8ff")
      );

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as object),
      }));
      dispatch(setAccessData({ type: "taskGetDetails", response: data }));
    } catch (error) {
      console.error("Error searching tasks:", error);
    }
  };

  const fetchTasksByCategory = async (categoryId: string) => {
    try {
      const tasksCollection = collection(db, "tasks");

      let tasksQuery: any = tasksCollection;

      if (categoryId) {
        tasksQuery = query(
          tasksCollection,
          where("userId", "==", auth?.currentUser?.uid),
          where("categoryId", "==", categoryId)
        );
      }

      const querySnapshot = await getDocs(tasksQuery);
      const data: Task[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as object),
      }));

      dispatch(setAccessData({ type: "taskGetDetails", response: data }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    dispatch(setAccessData({ type: "selectedCategory", response: categoryId }));
    if (categoryId === "") {
      getTaskData(dispatch);
    } else {
      fetchTasksByCategory(categoryId);
    }
  };

  const handleSort = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    dispatch(setAccessData({ type: "sortOrder", response: newOrder }));
    getTaskData(dispatch, newOrder);
  };

  return (
    <>
      <div
        className={`flex ${
          isSmallScreen
            ? "flex-col gap-3"
            : "justify-between items-center sm:mt-5 mt-10"
        }`}
      >
        <div className={`flex ${isSmallScreen ? "flex-row gap-2" : "gap-4"}`}>
          <Box className="flex flex-wrap items-center gap-3">
            <div>Filter By:</div>
            <FormControl sx={{ width: "auto" }}>
              <Select
                value={selectedCategoryId}
                onChange={(event) => handleCategoryChange(event.target.value)}
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
            <Button
              onClick={handleSort}
              startIcon={sortOrder === "asc" ? <TbSortAscending /> : <TbSortDescending />}
              sx={{
                minWidth: 'auto',
                padding: '4px 8px',
                borderRadius: '16px',
                fontSize: '10px',
                backgroundColor: '#7B1984',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#641573'
                }
              }}
            >
              {`Sort By Due Date ${sortOrder === "asc" ? "↑" : "↓"}`}
            </Button>
          </Box>
        </div>

        <div className={`flex ${isSmallScreen ? "flex-col gap-3" : "gap-4"} `}>
          <div className="relative ">
            <div className="absolute inset-y-0 start-0 flex items-center ps-2 pointer-events-none">
              <CiSearch />
            </div>
            <input
              type="search"
              className={`block p-2 ps-8 text-sm text-gray-900 border border-gray-300 rounded-2xl bg-gray-50 dark:border-gray-600 placeholder-gray-700 ${
                isSmallScreen ? "w-full" : "w-auto"
              }`}
              placeholder="Search Task name"
              required
              onChange={(e) => handleSearch(e.target.value)}
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
              setAddText(true);
              setOpenAddModal(!openAddModal);
            }}
          >
            ADD TASKS
          </Button>
        </div>

        {openAddModal && (
          <AddTaskModal addText={addText} setOpenAddModal={setOpenAddModal} />
        )}
      </div>
    </>
  );
};

export default FilterCreateTasks;
