import { MdExpandMore } from "react-icons/md";
import FilterCreateTasks from "../FilterCreateTasks";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Typography,
} from "@mui/material";
import { FiPlus } from "react-icons/fi";

const ListView = () => {
  return (
    <>
      <div className="mt-2">
        <FilterCreateTasks />
        <div className="mt-6">
          <Divider />
          <div className="mt-4">
            <Accordion>
              <AccordionSummary
                expandIcon={<MdExpandMore />}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{ backgroundColor: "#FAC3FF" }}
              >
                <Typography component="span">Todo</Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{ height: "350px", backgroundColor: "#FFFAEA" }}
              >
                <Box>
                  <Button variant="text" startIcon={<FiPlus />} sx={{ color: "#000000",textTransform:"capitalize" }}>
                    Add Task
                  </Button>
                  <Divider/>
                </Box>
                No Tasks in To-Do
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<MdExpandMore />}
                aria-controls="panel2-content"
                id="panel2-header"
                sx={{ backgroundColor: "#85D9F1" }}
              >
                <Typography component="span">In-Progress</Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{ height: "350px", backgroundColor: "#FFFAEA" }}
              >
                No Tasks in Progress
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
                sx={{ height: "350px", backgroundColor: "#FFFAEA" }}
              >
                No Tasks in Completed
              </AccordionDetails>
              <AccordionActions>
                <Button>Cancel</Button>
                <Button>Agree</Button>
              </AccordionActions>
            </Accordion>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListView;
