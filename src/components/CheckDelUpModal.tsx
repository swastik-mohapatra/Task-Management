import { Chip, Menu, MenuItem } from "@mui/material";
import { useSelector } from "react-redux";
import { setAccessData } from "../redux/reducers/systemConfigReducer";
import { useDispatch } from "react-redux";
import { doc, writeBatch } from "firebase/firestore";
import { db } from "../config/firebase";
import { getTaskData } from "../utils/taskGetService";
import { useState } from "react";

const statusOptions = [
  { key: "T", label: "TODO" },
  { key: "P", label: "In Progress" },
  { key: "C", label: "Completed" },
];

const CheckDelUpModal = () =>{
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const taskIdDetails = useSelector(
      (state: any) => state?.systemConfigReducer?.taskIdDetails
    );

    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleStatusChange = (statusKey: string) => {
      const batch = writeBatch(db);

      const getStatusLabel = (key: string) => {
        switch (key) {
          case "T":
            return "TODO";
          case "P":
            return "In Progress";
          case "C":
            return "Completed";
          default:
            return "";
        }
      };

      taskIdDetails.forEach((id: string) => {
        const taskRef = doc(db, "tasks", id);
        batch.update(taskRef, {
          status: getStatusLabel(statusKey),
          statusId: statusKey,
        });
      });

      batch
        .commit()
        .then(() => {
          dispatch(setAccessData({ type: "taskIdDetails", response: [] }));
          getTaskData(dispatch);
        })
        .catch((error) => console.error("Error updating status:", error));

      handleClose();
    };

    const handleBatchDelete = async () => {
      const batch = writeBatch(db);

      taskIdDetails.forEach((id: string) => {
        const taskRef = doc(db, "tasks", id);
        batch.delete(taskRef);
      });

      try {
        await batch.commit();
        dispatch(setAccessData({ type: "taskIdDetails", response: [] }));
        getTaskData(dispatch);
      } catch (error) {
        console.error("Error deleting tasks:", error);
      }
    };

    const dispatch = useDispatch();
    return (
      <>
        <div className="fixed bottom-1 left-0 w-full h-fit flex justify-center items-center z-[1000] ">
          <div className="relative bg-black sm:rounded-lg shadow w-lg mt-0 sm:mt-10 flex flex-col rounded-t-3xl">
            <div className="flex items-center justify-between p-2 md:p-3 border-b border-[#0000001A] rounded-t">
              <h3 className="text-xl font-semibold text-gray-200">
                {" "}
                <Chip
                  label={`${taskIdDetails.length}` + " tasks selected"}
                  variant="outlined"
                  color="info"
                  onDelete={() =>
                    dispatch(
                      setAccessData({
                        type: "taskIdDetails",
                        response: [],
                      })
                    )
                  }
                />
              </h3>
              <div className="flex gap-3">
                <Chip
                  label="Delete"
                  variant="outlined"
                  color="error"
                  sx={{ color: "red", backgroundColor: "#FF353524" }}
                  onClick={handleBatchDelete}
                  clickable
                />
                <Chip
                  label="Status"
                  variant="outlined"
                  sx={{ color: "white", backgroundColor: "#8D8A8A24" }}
                  onClick={handleClick}
                  clickable
                />
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                  <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                    {statusOptions.map((option) => (
                      <MenuItem
                        key={option?.key}
                        onClick={() => handleStatusChange(option.key)}
                      >
                        {option?.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </Menu>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

export default CheckDelUpModal;
