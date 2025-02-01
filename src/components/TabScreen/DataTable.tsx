import { MouseEvent, useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Chip, IconButton, ListItemIcon } from "@mui/material";
import { FiEdit3 } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { IoIosMore } from "react-icons/io";
import { TableRow } from "../../constants/tableData"; // Import shared data and type
import { FaCircleCheck } from "react-icons/fa6";

interface DataTableProps {
  rows: TableRow[]; // Define rows as a prop
}

const DataTable = ({ rows }: DataTableProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="relative overflow-x-auto ">
      <table className="w-full text-sm text-left rtl:text-right ">
        <tbody>
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
                <FaCircleCheck size={20} color={row.status==="Completed"?"Green":"Black"}/>
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
                <div>
                  <IconButton
                    id="basic-button"
                    aria-controls={open ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                  >
                    <IoIosMore />
                  </IconButton>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                  >
                    <MenuItem onClick={handleClose}>
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
                      onClick={handleClose}
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
