import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import AddTaskModal from "./AddTaskModal";
import { useDispatch } from "react-redux";
import { setAccessData } from "../redux/reducers/systemConfigReducer";
import { collection, endAt, getDocs, orderBy, query, startAt, where } from "firebase/firestore";
import { db, auth, storage } from "../config/firebase"; 
import { getTaskData } from "../utils/taskGetService";
import { useSelector } from "react-redux";

const FilterCreateTasks = () => {
  const [age, setAge] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [addText, setAddText] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch()

  const selectedCategoryId = useSelector(
    (state)=>state?.systemConfigReducer?.selectedCategory
  )

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  // useEffect(() => {
  //   if (searchTerm === "") {
  //     getTaskData(dispatch);
  //     return;
  //   }

  //   const fetchResults = async () => {
  //     try {
  //       const querySnapshot = await getDocs(collection(db, "tasks"));
  //       const data = querySnapshot.docs
  //         .map((doc) => ({
  //           id: doc.id,
  //           ...doc.data(),
  //         }))
  //         .filter((task) =>
  //           task.taskName.toLowerCase().includes(searchTerm.toLowerCase())
  //         );

  //       dispatch(setAccessData({ type: "taskGetDetails", response: data }));
  //       // console.log(data);
  //     } catch (error) {
  //       console.error("Error searching tasks:", error);
  //     }
  //   };

  //   const timeoutId = setTimeout(() => {
  //     fetchResults();
  //   }, 500);

  //   return () => clearTimeout(timeoutId);
  // }, [searchTerm]);

  useEffect(() => {
    if (searchTerm === "") {
      getTaskData(dispatch)
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
    const timeoutId = setTimeout(() => {
      fetchResults();
    }, 500);

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
    if(selectedCategoryId===""){
      getTaskData(dispatch)
    }
    fetchTasksByCategory(selectedCategoryId);
  }, [selectedCategoryId]);

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
                value={selectedCategoryId}
                onChange={(event) => {
                  dispatch(setAccessData({ type: "selectedCategory", response: event.target.value })) 
                }}
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
                <MenuItem value="W">Work</MenuItem>
                <MenuItem value="P">Personal</MenuItem>
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
                  Status
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
