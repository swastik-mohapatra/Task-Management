/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Button,
  ButtonGroup,
  Divider,
  FormControl,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  getDocs,
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useSelector, useDispatch } from "react-redux";
import { setAccessData } from "../redux/reducers/systemConfigReducer";
import dayjs from "dayjs";
import { getTaskData } from "../utils/taskGetService";

interface AddTaskModalProps {
  addText: boolean;
  openAddModal: boolean;
  setOpenAddModal: (value: boolean) => void;
}

interface LogEntry {
  timestamp: string;
  description: string;
}

const AddTaskModal = ({
  addText,
  openAddModal,
  setOpenAddModal,
}: AddTaskModalProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [logActivities, setLogActivities] = useState<LogEntry[]>([]);
  const [selectedOption, setSelectedOption] = useState("details");
  const taskDetail = useSelector(
    (state: any) => state?.systemConfigReducer?.taskDetails
  );
  const dispatch = useDispatch();

  const taskCollectionRef = collection(db, "tasks");

  useEffect(() => {
    if (!addText && taskDetail?.id) {
      fetchLogActivities(taskDetail.id);
    }
  }, [taskDetail?.id, addText]);

  const fetchLogActivities = async (taskId: string) => {
    try {
      const logCollectionRef = collection(db, `tasks/${taskId}/logs`);
      const logSnapshot = await getDocs(logCollectionRef);
      const logs = logSnapshot.docs.map((doc) => doc.data() as LogEntry);
      setLogActivities(logs);
    } catch (error) {
      console.error("Error fetching log activities:", error);
    }
  };

  const addLogActivity = async (taskId: string, description: string) => {
    try {
      const logCollectionRef = collection(db, `tasks/${taskId}/logs`);
      const newLog = {
        timestamp: new Date().toISOString(),
        description,
      };
      await addDoc(logCollectionRef, newLog);
      setLogActivities((prevLogs) => [newLog, ...prevLogs]);
    } catch (error) {
      console.error("Error adding log activity:", error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...filesArray]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleChangeDate = (date: any) => {
    dispatch(
      setAccessData({
        type: "taskDetails",
        response: { ...taskDetail, dueDate: dayjs(date).format("MM-DD-YYYY") },
      })
    );
  };

  const handleChangeInput = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value } = event.target;
    if (name) {
      dispatch(
        setAccessData({
          type: "taskDetails",
          response: { ...taskDetail, [name]: value },
        })
      );
    }
  };

  const submitTask = async () => {
    if (!taskDetail?.taskName) {
      alert("Task name is required.");
      return;
    }

    const cloudinaryUrl =
      "https://api.cloudinary.com/v1_1/dzhm9jir2/image/upload";

    const fileUploadPromises = selectedFiles.map(async (file) => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "Task_Management");

        const response = await fetch(cloudinaryUrl, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload file to Cloudinary");
        }

        const result = await response.json();
        console.log("Cloudinary upload response:", result);

        return {
          name: file.name,
          url: result.secure_url,
          type: file.type
        };
      } catch (err) {
        console.error("Error uploading file to Cloudinary: ", err);
        return null;
      }
    });

    try {
      const fileData = await Promise.all(fileUploadPromises);

      const formattedTaskDetail = {
        taskName: taskDetail?.taskName || "",
        description: taskDetail?.description || "",
        category: taskDetail?.category === "W" ? "Work" : "Personal",
        categoryId: taskDetail?.category || "",
        dueDate: taskDetail?.dueDate
          ? dayjs(taskDetail?.dueDate).toISOString()
          : null,
        status:
          taskDetail?.status === "T"
            ? "TODO"
            : taskDetail?.status === "P"
            ? "In Progress"
            : "Completed",
        statusId: taskDetail?.status || "",
        userId: auth?.currentUser?.uid,
        files: fileData.filter((file) => file !== null),
      };

      const taskRef = await addDoc(taskCollectionRef, formattedTaskDetail);
      await addLogActivity(taskRef.id, "Task Created");

      getTaskData(dispatch);
      dispatch(setAccessData({ type: "taskDetails", response: {} }));
      setSelectedFiles([]);
      setOpenAddModal(false);
    } catch (err) {
      console.error("Error adding document: ", err);
    }
  };
  
  const updateTask = async (id: string) => {
    const updatePayload = {
      taskName: taskDetail?.taskName || "",
      description: taskDetail?.description || "",
      category: taskDetail?.category === "W" ? "Work" : "Personal",
      categoryId: taskDetail?.category || "",
      dueDate: taskDetail?.dueDate
        ? dayjs(taskDetail?.dueDate).toISOString()
        : null,
      status:
        taskDetail?.status === "T"
          ? "TODO"
          : taskDetail?.status === "P"
          ? "In Progress"
          : "Completed",
      statusId: taskDetail?.status || "",
      userId: auth?.currentUser?.uid,
      files: taskDetail?.files || [],
    };

    const taskUpdateDoc = doc(db, "tasks", id);
    try {
      const currentTaskDoc = await getDoc(taskUpdateDoc);
      const currentTaskData = currentTaskDoc.data();

      const changes = [];
      if (updatePayload.taskName !== currentTaskData?.taskName) {
        changes.push(
          `Task Name: "${currentTaskData?.taskName}" → "${updatePayload.taskName}"`
        );
      }
      if (updatePayload.description !== currentTaskData?.description) {
        changes.push(
          `Description: "${currentTaskData?.description}" → "${updatePayload.description}"`
        );
      }
      if (updatePayload.category !== currentTaskData?.category) {
        changes.push(
          `Category: "${currentTaskData?.category}" → "${updatePayload.category}"`
        );
      }
      if (updatePayload.dueDate !== currentTaskData?.dueDate) {
        changes.push(
          `Due Date: "${currentTaskData?.dueDate}" → "${updatePayload.dueDate}"`
        );
      }
      if (updatePayload.status !== currentTaskData?.status) {
        changes.push(
          `Status: "${currentTaskData?.status}" → "${updatePayload.status}"`
        );
      }

      await updateDoc(taskUpdateDoc, updatePayload);

      if (changes.length > 0) {
        await addLogActivity(id, `Task Updated: ${changes.join(", ")}`);
      }

      getTaskData(dispatch);
      dispatch(setAccessData({ type: "taskDetails", response: {} }));
      setOpenAddModal(false);
    } catch (err) {
      console.error("Error updating document: ", err);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/75 flex justify-center items-center z-[1000] overflow-y-auto">
      <div
        className={`top-24 sm:top-0 relative bg-[#FFFFFF] sm:rounded-lg shadow w-full ${
          addText ? "md:w-xl" : "md:w-5xl"
        } sm:mt-10 flex flex-col rounded-t-3xl h-full sm:h-auto`}
        style={{
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="flex items-center justify-center sm:justify-between p-2 sm:border-b sm:border-[#0000001A] rounded-t">
          <h3
            className={`text-xl font-semibold text-gray-900 ${
              addText ? "sm:block" : "sm:block hidden"
            }`}
          >
            {addText ? "Create Task" : "Update Task"}
          </h3>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-lg w-8 h-8 justify-center items-center sm:block hidden"
            onClick={() => setOpenAddModal(false)}
          >
            ✖
          </button>
          {!addText && (
            <div className="sm:hidden block ">
              <ButtonGroup>
                <Button
                  variant={
                    selectedOption === "details" ? "contained" : "outlined"
                  }
                  onClick={() => setSelectedOption("details")}
                >
                  Details
                </Button>
                <Button
                  variant={
                    selectedOption === "activity" ? "contained" : "outlined"
                  }
                  onClick={() => setSelectedOption("activity")}
                >
                  Activity
                </Button>
              </ButtonGroup>
            </div>
          )}
        </div>
        <div
          className="flex flex-col sm:flex-row gap-4 flex-grow overflow-y-auto"
          style={{
            flex: "1 1 auto",
            overflowY: "auto",
            maxHeight: "calc(100% - 120px)",
          }}
        >
          <div
            className={`${
              selectedOption === "details" ? "block" : "hidden sm:block"
            } p-4 md:p-4 space-y-4 flex-grow`}
          >
            <div>
              <TextField
                label="Task Title"
                variant="outlined"
                fullWidth
                name="taskName"
                value={taskDetail?.taskName || ""}
                onChange={handleChangeInput}
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
                name="description"
                value={taskDetail?.description || ""}
                onChange={handleChangeInput}
                rows={3}
              />
            </div>

            <div className="flex sm:flex-row flex-col gap-4">
              <div className="flex flex-col flex-1">
                <label className="text-xs font-medium mb-1">
                  Task Category
                </label>
                <ToggleButtonGroup
                  color="primary"
                  exclusive
                  aria-label="Platform"
                  value={taskDetail?.category || ""}
                  onChange={(_, value) =>
                    dispatch(
                      setAccessData({
                        type: "taskDetails",
                        response: { ...taskDetail, category: value },
                      })
                    )
                  }
                  fullWidth
                >
                  <ToggleButton size="small" value="W">
                    Work
                  </ToggleButton>
                  <ToggleButton size="small" value="P">
                    Personal
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>

              <div className="flex flex-col flex-1">
                <label className="text-xs font-medium mb-1">Due on</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={
                      taskDetail?.dueDate ? dayjs(taskDetail?.dueDate) : null
                    }
                    onChange={handleChangeDate}
                    slotProps={{
                      textField: { size: "small", fullWidth: true },
                    }}
                  />
                </LocalizationProvider>
              </div>

              <div className="flex flex-col flex-1">
                <label className="text-xs font-medium mb-1">Task Status</label>
                <FormControl fullWidth>
                  <Select
                    labelId="task-status-label"
                    id="task-status"
                    size="small"
                    name="status"
                    value={taskDetail?.status || ""}
                    onChange={handleChangeInput}
                  >
                    <MenuItem value="T">TODO</MenuItem>
                    <MenuItem value="P">In-Progress</MenuItem>
                    <MenuItem value="C">Completed</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className="flex flex-col flex-1">
              <label className="text-xs font-medium mb-1">Attachment</label>
              <Button
                component="label"
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#F1F1F15C",
                  color: "#000",
                  textTransform: "capitalize",
                  height: 50,
                }}
              >
                Drop your files or upload
                <input
                  type="file"
                  onChange={handleFileUpload}
                  multiple
                  accept="image/*, .pdf, .xlsx, .xls, .csv"
                  hidden
                />
              </Button>

              {taskDetail?.files?.length > 0 && (
                <div className="mt-2 text-xs text-gray-700">
                  <strong>Uploaded Files:</strong>
                  <ul className="list-disc pl-4">
                    {taskDetail.files.map((file, index) => (
                      <li key={index} className="flex items-center gap-2">
                        {file.url.startsWith("http") && (
                          <img
                            src={file.url}
                            alt="preview"
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <span>{file.name}</span>
                        <button
                          className="text-red-500 hover:underline ml-2"
                          onClick={() => handleRemoveFile(index)}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedFiles.length > 0 && (
                <div className="mt-2 text-xs text-gray-700">
                  <strong>New Files:</strong>
                  <ul className="list-disc pl-4">
                    {selectedFiles.map((file, index) => (
                      <li key={index} className="flex items-center gap-2">
                        {file.type.startsWith("image") && (
                          <img
                            src={URL.createObjectURL(file)}
                            alt="preview"
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <span>{file.name}</span>
                        <button
                          className="text-red-500 hover:underline ml-2"
                          onClick={() => handleRemoveFile(index)}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div
            className={`${
              selectedOption === "activity" ? "block" : "hidden sm:block"
            }`}
          >
            <Divider orientation="vertical" variant="middle" flexItem />
            {!addText && (
              <div className="flex flex-col my-2 mx-1 p-1">
                <label className="text-sm font-medium mb-2 border-b border-[#00000021]">
                  Activity
                </label>
                <div className="bg-gray-100 p-4 rounded-2xl">
                  {logActivities.length > 0 ? (
                    <ul className="space-y-2">
                      {logActivities.map((log, index) => (
                        <li key={index} className="text-xs text-gray-700">
                          <strong>
                            {dayjs(log?.timestamp).format("MMM D, YYYY h:mm A")}
                            :
                          </strong>{" "}
                          {log?.description}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-500">
                      No log activities found.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div
          className="flex justify-end gap-2 p-2 border-t border-gray-200 bg-[#F1F1F1] rounded-b sticky bottom-0"
          style={{
            flexShrink: 0,
            position: "sticky",
            bottom: 0,
            zIndex: 10,
          }}
        >
          <button
            type="button"
            className="text-black border border-[#00000030] duration-500 hover:bg-white hover:text-[#7B1984] focus:ring-4 focus:outline-none hover:border-[#7B1984] font-medium rounded-2xl text-xs px-3 py-1"
            onClick={() => setOpenAddModal(false)}
          >
            Close
          </button>
          {addText ? (
            <button
              type="button"
              className="text-white bg-[#7B1984] border duration-500 hover:bg-white hover:text-[#7B1984] focus:ring-4 focus:outline-none hover:border-[#7B1984] font-medium rounded-2xl text-xs px-3 py-1"
              onClick={submitTask}
            >
              Create
            </button>
          ) : (
            <button
              type="button"
              className="text-white bg-[#7B1984] border duration-500 hover:bg-white hover:text-[#7B1984] focus:ring-4 focus:outline-none hover:border-[#7B1984] font-medium rounded-2xl text-xs px-3 py-1"
              onClick={() => updateTask(taskDetail?.id)}
            >
              Update
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
