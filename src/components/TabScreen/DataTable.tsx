import { MouseEvent, useState } from "react";
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

interface DataTableProps {
  rows: TableRow[];
  addTableRow: boolean;
  setAddTableRow: (value: boolean) => void;
  addRow:any;
  setAddRow:(value:any)=>void;
}

const DataTable = ({ rows, addTableRow ,setAddTableRow,addRow,setAddRow}: DataTableProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentMenuId, setCurrentMenuId] = useState<string | null>(null);

  // Open a menu
  const handleClickMenu = (
    event: MouseEvent<HTMLButtonElement>,
    menuId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setCurrentMenuId(menuId);
  };

  // Close the menu
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setCurrentMenuId(null);
  };

  const onChangeInput = (e, name) => {
    setAddRow({ ...addRow, [name]: e.target.value });
  };


  return (
    <div className="relative overflow-x-auto ">
      <table className="w-full text-sm text-left rtl:text-right ">
        <tbody>
          {addTableRow && (
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
                  value={addRow["taskName"]}
                  onChange={(e) => onChangeInput(e, "taskName")}
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
                        addRow && addRow["dueDate"]
                          ? dayjs(addRow["dueDate"])
                          : null
                      }
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </td>

              <td className="px-6 py-4">
                <IconButton
                  id="status-menu-button"
                  aria-controls={
                    currentMenuId === "status-menu" ? "status-menu" : undefined
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
                  onClose={handleCloseMenu}
                  MenuListProps={{
                    "aria-labelledby": "status-menu-button",
                  }}
                >
                  <MenuItem onClick={handleCloseMenu}>TODO</MenuItem>
                  <MenuItem onClick={handleCloseMenu}>In Progress</MenuItem>
                  <MenuItem onClick={handleCloseMenu}>Completed</MenuItem>
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
                  onClick={(event) => handleClickMenu(event, "category-menu")}
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
                >
                  <MenuItem onClick={handleCloseMenu}>Work</MenuItem>
                  <MenuItem onClick={handleCloseMenu}>Personal</MenuItem>
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
                  >
                    ADD
                  </Button>
                  <Button sx={{ color: "#000" }} onClick={() => setAddTableRow(false)}>CANCEL</Button>
                </div>
              </td>
              </tr>
            </>
          )}

          {rows.map((row) => (
            <tr
              key={row.id}
              className="bg-inherit border-b dark:text-black dark:border-gray-300 border-gray-200 hover:bg-gray-50 "
            >
              <td className="w-4 p-4">
                <div className="flex items-center">
                  <input
                    id={`checkbox-table-search-${row?.id}`}
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </td>
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-black"
              >
                <div className="flex justify-left items-center gap-2">
                  <FaCircleCheck
                    size={20}
                    color={row.status === "Completed" ? "Green" : "Black"}
                  />
                  {row.taskName}
                </div>
              </th>
              <td className="px-6 py-4">
                {(() => {
                  const [day, month, year] = row.dueDate?.split("/") || [];
                  return new Date(+year, +month - 1, +day).toDateString() ===
                    new Date().toDateString()
                    ? "Today"
                    : row.dueDate;
                })()}
              </td>
              <td className="px-6 py-4">
                <Chip label={row?.status} />
              </td>
              <td className="px-6 py-4">{row?.category}</td>
              <td className="px-6 py-4">
                {/* More Menu */}
                <div>
                  <IconButton
                    id="more-menu-button"
                    aria-controls={
                      currentMenuId === "more-menu" ? "more-menu" : undefined
                    }
                    aria-haspopup="true"
                    aria-expanded={
                      currentMenuId === "more-menu" ? "true" : undefined
                    }
                    onClick={(event) => handleClickMenu(event, "more-menu")}
                  >
                    <IoIosMore />
                  </IconButton>
                  <Menu
                    id="more-menu"
                    anchorEl={anchorEl}
                    open={currentMenuId === "more-menu"}
                    onClose={handleCloseMenu}
                    MenuListProps={{
                      "aria-labelledby": "more-menu-button",
                    }}
                  >
                    <MenuItem onClick={handleCloseMenu}>
                      {" "}
                      <ListItemIcon>
                        <FiEdit3 />
                      </ListItemIcon>
                      Edit
                    </MenuItem>
                    <MenuItem
                      sx={{
                        color: "red",
                      }}
                      onClick={handleCloseMenu}
                    >
                      <ListItemIcon>
                        <MdDelete color="red" />
                      </ListItemIcon>
                      Delete
                    </MenuItem>
                  </Menu>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
