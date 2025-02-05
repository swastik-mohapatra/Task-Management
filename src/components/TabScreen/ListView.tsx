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
import { useSelector } from "react-redux";

const ListView = () => {
  const [addTableRow, setAddTableRow] = useState(false);
  const [addRow, setAddRow] = useState({});
  const [listRows, setListRows] = useState(tableData);

  const getTaskDetails = useSelector(
    (state: any) => state?.systemConfigReducer?.taskGetDetails
  );

  const todoTasks = getTaskDetails.filter((row) => row.statusId === "T");
  const inProgressTasks = getTaskDetails.filter((row) => row.statusId === "P");
  const completedTasks = getTaskDetails.filter((row) => row.statusId === "C");

  return (
    <>
      <div className="mt-2">
        <FilterCreateTasks />
        <div className="mt-6">
          <Divider />
          <table className="w-full text-sm text-left rtl:text-right ">
            <thead className="text-xs text-gray-700 uppercase bg-inherit dark:text-gray-400">
              <tr>
                <th scope="col" className="p-4">
                  <div className="flex items-center">
                    <input
                      id="checkbox-all-search"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 "/>
                  </div>
                </th>
                <th scope="col" className="px-6 py-4">
                  Task name
                </th>
                <th scope="col" className="px-6 py-4">
                  Due Date
                </th>
                <th scope="col" className="px-6 py-4">
                  Status
                </th>
                <th scope="col" className="px-6 py-4">
                  Category
                </th>
                <th scope="col" className="px-6 py-4">
                </th>
              </tr>
            </thead>
          </table>
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
                    setListRows={setListRows}
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
                    setListRows={setListRows}
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
                    setListRows={setListRows}
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
