import { MdExpandMore } from "react-icons/md";
import FilterCreateTasks from "../FilterCreateTasks";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Typography,
} from "@mui/material";
import { FiPlus } from "react-icons/fi";
import DataTable from "./DataTable";
import { tableData } from "../../constants/tableData";
import { useState } from "react";

const ListView = () => {
  const [addTableRow, setAddTableRow] = useState(false);
  const [addRow, setAddRow] = useState({});

  const todoTasks = tableData.filter((row) => row.status === "TODO");
  const inProgressTasks = tableData.filter(
    (row) => row.status === "In Progress"
  );
  const completedTasks = tableData.filter((row) => row.status === "Completed");

  return (
    <>
      <div className="mt-2">
        <FilterCreateTasks />
        <div className="mt-6">
          <Divider />
          <div className="mt-4">
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<MdExpandMore />}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{ backgroundColor: "#FAC3FF" }}
              >
                <Typography component="span">Todo</Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{ minHeight: "350px", backgroundColor: "#FFFAEA" }}
              >
                <Box>
                  <Button
                    variant="text"
                    startIcon={<FiPlus />}
                    sx={{ color: "#000000", textTransform: "capitalize" }}
                    onClick={() => {
                      setAddTableRow(!addTableRow);
                    }}
                  >
                    Add Task
                  </Button>
                  <Divider />
                </Box>
                {todoTasks.length > 0 ? (
                  <DataTable
                    rows={todoTasks}
                    addTableRow={addTableRow}
                    setAddTableRow={setAddTableRow}
                    addRow={addRow}
                    setAddRow={setAddRow}
                  />
                ) : (
                  "No Tasks in To-Do"
                )}
              </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<MdExpandMore />}
                aria-controls="panel2-content"
                id="panel2-header"
                sx={{ backgroundColor: "#85D9F1" }}
              >
                <Typography component="span">In-Progress</Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{ minHeight: "350px", backgroundColor: "#FFFAEA" }}
              >
                {inProgressTasks.length > 0 ? (
                  <DataTable
                    rows={inProgressTasks}
                    addRow={addRow}
                    setAddRow={setAddRow}
                  />
                ) : (
                  "No Tasks in Progress"
                )}
              </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<MdExpandMore />}
                aria-controls="panel3-content"
                id="panel3-header"
                sx={{ backgroundColor: "#CEFFCC" }}
              >
                <Typography component="span">Completed</Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{ minHeight: "350px", backgroundColor: "#FFFAEA" }}
              >
                {completedTasks.length > 0 ? (
                  <DataTable
                    rows={completedTasks}
                    addRow={addRow}
                    setAddRow={setAddRow}
                  />
                ) : (
                  "No Tasks in Completed"
                )}
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListView;


// import { useState } from "react";
// import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
// import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
// import { useSortable } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import { Button, Chip, IconButton, ListItemIcon, TextField } from "@mui/material";
// import { FiEdit3 } from "react-icons/fi";
// import { MdDelete } from "react-icons/md";
// import { IoIosMore } from "react-icons/io";
// import { TableRow } from "../../constants/tableData";
// import { FaCircleCheck } from "react-icons/fa6";
// import dayjs from "dayjs";

// interface DataTableProps {
//   rows: TableRow[];
//   setRows: (rows: TableRow[]) => void;
// }

// const DraggableRow = ({ row, children }) => {
//   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: row.id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };

//   return (
//     <tr ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-inherit border-b dark:text-black dark:border-gray-300 border-gray-200 hover:bg-gray-50">
//       {children}
//     </tr>
//   );
// };

// const DataTable = ({ rows, setRows }: DataTableProps) => {
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [currentMenuId, setCurrentMenuId] = useState<string | null>(null);

//   const handleClickMenu = (
//     event: React.MouseEvent<HTMLButtonElement>,
//     menuId: string
//   ) => {
//     setAnchorEl(event.currentTarget);
//     setCurrentMenuId(menuId);
//   };

//   const handleCloseMenu = () => {
//     setAnchorEl(null);
//     setCurrentMenuId(null);
//   };

//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );

//   const handleDragEnd = (event) => {
//     const { active, over } = event;
//     if (active.id !== over?.id) {
//       setRows((prevRows) => {
//         const oldIndex = prevRows.findIndex((row) => row.id === active.id);
//         const newIndex = prevRows.findIndex((row) => row.id === over?.id);
//         return arrayMove(prevRows, oldIndex, newIndex);
//       });
//     }
//   };

//   return (
//     <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
//       <SortableContext items={rows.map((row) => row.id)} strategy={verticalListSortingStrategy}>
//         <div className="relative overflow-x-auto">
//           <table className="w-full text-sm text-left rtl:text-right">
//             <tbody>
//               {rows.map((row) => (
//                 <DraggableRow key={row.id} row={row}>
//                   <td className="w-4 p-4 cursor-move">
//                     <div className="flex items-center">::</div>
//                   </td>
//                   <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-black">
//                     <div className="flex justify-left items-center gap-2">
//                       <FaCircleCheck size={20} color={row.status === "Completed" ? "Green" : "Black"} />
//                       {row.taskName}
//                     </div>
//                   </th>
//                   <td className="px-6 py-4">{row.dueDate}</td>
//                   <td className="px-6 py-4">
//                     <Chip label={row?.status} />
//                   </td>
//                   <td className="px-6 py-4">{row?.category}</td>
//                   <td className="px-6 py-4">
//                     <IconButton
//                       id="more-menu-button"
//                       aria-controls={currentMenuId === "more-menu" ? "more-menu" : undefined}
//                       aria-haspopup="true"
//                       aria-expanded={currentMenuId === "more-menu" ? "true" : undefined}
//                       onClick={(event) => handleClickMenu(event, "more-menu")}
//                     >
//                       <IoIosMore />
//                     </IconButton>
//                     <Menu
//                       id="more-menu"
//                       anchorEl={anchorEl}
//                       open={currentMenuId === "more-menu"}
//                       onClose={handleCloseMenu}
//                       MenuListProps={{ "aria-labelledby": "more-menu-button" }}
//                     >
//                       <MenuItem onClick={handleCloseMenu}>
//                         <ListItemIcon>
//                           <FiEdit3 />
//                         </ListItemIcon>
//                         Edit
//                       </MenuItem>
//                       <MenuItem sx={{ color: "red" }} onClick={handleCloseMenu}>
//                         <ListItemIcon>
//                           <MdDelete color="red" />
//                         </ListItemIcon>
//                         Delete
//                       </MenuItem>
//                     </Menu>
//                   </td>
//                 </DraggableRow>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </SortableContext>
//     </DndContext>
//   );
// };

// export default DataTable;

