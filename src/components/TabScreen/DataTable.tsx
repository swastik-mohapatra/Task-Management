import { Children, MouseEvent, ReactNode, useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  Button,
  Chip,
  IconButton,
  ListItemIcon,
  TextField,
} from "@mui/material";
import { FiEdit3 } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { IoIosMore } from "react-icons/io";
import { TableRow } from "../../constants/tableData";
import { FaCircleCheck } from "react-icons/fa6";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { CiCirclePlus } from "react-icons/ci";
import dayjs from "dayjs";
import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {  deleteDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { getTaskData } from "../../utils/taskGetService";
import { useDispatch } from "react-redux";
import AddTaskModal from "../AddTaskModal";
import {
  setAccessData,
} from "../../redux/reducers/systemConfigReducer";
import { useSelector } from "react-redux";
import CheckDelUpModal from "../CheckDelUpModal";

interface DataTableProps {
  rows: TableRow[];
  addTableRow: boolean;
  setAddTableRow: (value: boolean) => void;
}

const DraggableRow = ({ row, children }: { row: TableRow; children: ReactNode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: row.id });

  const DragHandle = () => (
    <td className="w-4 p-4 cursor-move hidden sm:table-cell" {...listeners} {...attributes}>
      ::
    </td>
  );

  const wrappedChildren = Children.map(children, (child, index) => {
    if (index === 1) {
      return <DragHandle />;
    }
    return child;
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className="bg-inherit border-b border-[#0000001A] hover:bg-gray-50"
    >
      {wrappedChildren}
    </tr>
  );
};
const DataTable = ({
  rows,
  addTableRow,
  setAddTableRow,
}: DataTableProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentMenuId, setCurrentMenuId] = useState<string | null>(null);
  const [openAddModal, setOpenAddModal] = useState(false);

  const taskIdDetails = useSelector(
    (state: any) => state?.systemConfigReducer?.taskIdDetails
  );

   const dispatch = useDispatch();

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    rowId: string
  ) => {
    event.stopPropagation();
  
    const updatedSelectedRows = event.target.checked
      ? [...(taskIdDetails || []), rowId]
      : (taskIdDetails || []).filter((id: string) => id !== rowId);
     
    dispatch(
      setAccessData({ 
        type: "taskIdDetails", 
        response: updatedSelectedRows 
      })
    );
  };

  const taskDetail = useSelector(
    (state: any) => state?.systemConfigReducer?.taskDetails
  );

  const handleClickMenu = (
    event: MouseEvent<HTMLButtonElement>,
    menuId: string
  ) => {
    event.stopPropagation(); 
    setAnchorEl(event.currentTarget);
    setCurrentMenuId(menuId);
  };

  const handleCloseMenu = (event: MouseEvent | object) => {
    if (event && 'stopPropagation' in event) {
      event.stopPropagation(); 
    }
    setAnchorEl(null);
    setCurrentMenuId(null);
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

  const deleteTask = async (id:any) => {
    dispatch(setAccessData({ type: "loading", response: true }))
    try {
      const taskDoc = doc(db, "tasks", id);
      await deleteDoc(taskDoc);
      getTaskData(dispatch);
      dispatch(setAccessData({ type: "loading", response: false }))
    } catch (error) {
      console.error("Error deleting task:", error);
      dispatch(setAccessData({ type: "loading", response: false }))
    }
    setAnchorEl(null);
    setCurrentMenuId(null);
  };

  return (
    <>
      <div className="relative overflow-x-auto ">
        {addTableRow && (
          <table className="w-full text-sm text-left rtl:text-right hidden sm:table">
            <tbody>
              <>
                <tr className=" bg-inherit dark:text-black">
                  <td className="w-4 p-4">
                    <div className="flex items-center"></div>
                  </td>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-black"
                  >
                    <TextField
                      id="standard-basic"
                      label="Task Title"
                      variant="standard"
                      value={taskDetail?.taskName || ""}
                      onChange={handleChangeInput}
                    />
                  </th>
                  <td className="px-6 py-4">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          label="Add Date"
                          sx={{}}
                          slotProps={{ textField: { size: "small" } }}
                          value={
                            taskDetail?.dueDate
                              ? dayjs(taskDetail?.dueDate)
                              : null
                          }
                          onChange={handleChangeDate}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </td>

                  <td className="px-6 py-4">
                    <IconButton
                      id="status-menu-button"
                      aria-controls={
                        currentMenuId === "status-menu"
                          ? "status-menu"
                          : undefined
                      }
                      aria-haspopup="true"
                      aria-expanded={
                        currentMenuId === "status-menu" ? "true" : undefined
                      }
                      onClick={(event) => handleClickMenu(event, "status-menu")}
                    >
                      <CiCirclePlus />
                    </IconButton>
                    <Menu
                      id="status-menu"
                      anchorEl={anchorEl}
                      open={currentMenuId === "status-menu"}
                      onClose={(event) => handleCloseMenu(event)}
                      MenuListProps={{
                        "aria-labelledby": "status-menu-button",
                      }}
                      sx={{
                        "& .MuiPaper-root": {
                          backgroundColor: "#FFF9F9",
                          borderColor: "#7B198426",
                        },
                      }}
                    >
                      {["TODO", "In Progress", "Completed"].map((status) => (
                        <MenuItem
                          key={status}
                          onClick={(event) => {
                            event.stopPropagation();
                            dispatch(
                              setAccessData({
                                type: "taskDetails",
                                response: {
                                  ...taskDetail,
                                  status: status,
                                },
                              })
                            );
                          }}
                        >
                          {status}
                        </MenuItem>
                      ))}
                    </Menu>
                  </td>
                  <td className="px-6 py-4">
                    <IconButton
                      id="category-menu-button"
                      aria-controls={
                        currentMenuId === "category-menu"
                          ? "category-menu"
                          : undefined
                      }
                      aria-haspopup="true"
                      aria-expanded={
                        currentMenuId === "category-menu" ? "true" : undefined
                      }
                      onClick={(event) =>
                        handleClickMenu(event, "category-menu")
                      }
                    >
                      <CiCirclePlus />
                    </IconButton>
                    <Menu
                      id="category-menu"
                      anchorEl={anchorEl}
                      open={currentMenuId === "category-menu"}
                      onClose={handleCloseMenu}
                      MenuListProps={{
                        "aria-labelledby": "category-menu-button",
                      }}
                      sx={{
                        "& .MuiPaper-root": {
                          backgroundColor: "#FFF9F9",
                          borderColor: "#7B198426",
                        },
                      }}
                    >
                      {["Work", "Personal"].map((status) => (
                        <MenuItem
                          key={status}
                          onClick={(event) => {
                            event.stopPropagation();
                            dispatch(
                              setAccessData({
                                type: "taskDetails",
                                response: {
                                  ...taskDetail,
                                  category: status,
                                },
                              })
                            );
                            handleCloseMenu({});
                          }}
                        >
                          {status}
                        </MenuItem>
                      ))}
                    </Menu>
                  </td>
                  <td className="px-6 py-4"></td>
                </tr>
                <tr className=" bg-inherit border-b dark:text-black dark:border-gray-[300] border-gray-200">
                  <th className="w-4 p-4"></th>
                  <td>
                    <div className="flex gap-3 my-2 ml-3">
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#7B1984",
                          borderRadius: "22px",
                          paddingX: "9px",
                        }}
                        onClick={() => console.log(taskDetail)}
                      >
                        ADD
                      </Button>
                      <Button
                        sx={{ color: "#000" }}
                        onClick={() => setAddTableRow(false)}
                      >
                        CANCEL
                      </Button>
                    </div>
                  </td>
                </tr>
              </>
            </tbody>
          </table>
        )}

        {/* <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        > */}
          <SortableContext
            items={rows.map((row) => row.id)}
            strategy={verticalListSortingStrategy}
          >
        <div className="relative overflow-auto max-h-96">
          <table className="w-full text-xs text-left">
            <colgroup>
              <col className="w-12" />
              <col className="w-8" />
              <col className="w-1/4" />
              <col className="w-1/5" />
              <col className="w-1/6" />
              <col className="w-1/6" />
              <col className="w-12" />
            </colgroup>
            <tbody>
              {rows.map((row) => (
                <DraggableRow key={row?.id} row={row}>
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      <input
                        id={`checkbox-table-search-${row?.id}`}
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        onChange={(event) => {
                          handleCheckboxChange(event, row?.id?.toString());
                        }}
                        checked={taskIdDetails?.includes(row?.id)}
                      />
                    </div>
                  </td>
                  <td className="w-4 p-4 cursor-move hidden sm:table-cell">::</td>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium whitespace-nowrap"
                  >
                    <div className="flex items-center gap-2">
                      <FaCircleCheck
                        size={20}
                        color={row.status === "Completed" ? "Green" : "Black"}
                      />
                      {row.taskName}
                    </div>
                  </th>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    {row?.dueDate
                      ? dayjs(row?.dueDate)?.format("D MMM, YYYY")
                      : ""}
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <Chip label={row?.status} />
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">{row?.category}</td>
                  <td className="px-6 py-4">
                    <IconButton
                      aria-controls={
                        currentMenuId === row.id.toString() ? "menu" : undefined
                      }
                      aria-haspopup="true"
                      onClick={(event) => handleClickMenu(event, row?.id?.toString())}
                    >
                      <IoIosMore />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={currentMenuId === row?.id.toString()}
                      onClick={(e) => e.stopPropagation()}
                      onClose={handleCloseMenu}
                      sx={{
                        "& .MuiPaper-root": {
                          backgroundColor: "#FFF9F9",
                          borderColor: "#7B198426",
                        },
                      }}
                    >
                      <MenuItem
                        onClick={(event) => {
                          event.stopPropagation();
                          dispatch(
                            setAccessData({
                              type: "taskDetails",
                              response: {
                                ...row,
                                status: row?.statusId,
                                category: row?.categoryId,
                              },
                            })
                          );
                          setAnchorEl(null);
                          setCurrentMenuId(null);
                          setOpenAddModal(!openAddModal);
                        }}
                      >
                        <ListItemIcon>
                          <FiEdit3 />
                        </ListItemIcon>
                        Edit
                      </MenuItem>
                      <MenuItem
                        sx={{ color: "red" }}
                        onClick={() => deleteTask(row?.id)}
                      >
                        <ListItemIcon>
                          <MdDelete color="red" />
                        </ListItemIcon>
                        Delete
                      </MenuItem>
                    </Menu>
                  </td>
                </DraggableRow>
              ))}
            </tbody>
          </table>
        </div>
        </SortableContext>
        {openAddModal && (
          <AddTaskModal
            addText={false}
            setOpenAddModal={setOpenAddModal}
          />
        )}
        {taskIdDetails.length > 0 && (
          <CheckDelUpModal
/>
        )}
      </div>
    </>
  );
};

export default DataTable;
