import { MdExpandMore } from "react-icons/md";
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
import { useState } from "react";
import { useSelector } from "react-redux";
import { 
  DndContext, 
  closestCenter,
  DragOverlay,
  KeyboardSensor, 
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { doc, updateDoc } from "firebase/firestore";
import { getTaskData } from "../../utils/taskGetService";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useDispatch } from "react-redux";
import { db } from "../../config/firebase";
import { reorderTasks, setAccessData } from "../../redux/reducers/systemConfigReducer";

const Droppable: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div 
      ref={setNodeRef}
      style={{
        minHeight: "100px",
        backgroundColor: isOver ? 'rgba(0, 0, 0, 0.05)' : undefined,
        transition: 'background-color 0.2s ease'
      }}
    >
      {children}
    </div>
  );
};

const ListView = () => {
  const [addTableRow, setAddTableRow] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const dispatch = useDispatch();

  const getTaskDetails = useSelector(
    (state:any) => state?.systemConfigReducer?.taskGetDetails
  );

  const todoTasks = getTaskDetails.filter((row: { statusId: string; }) => row.statusId === "T");
  const inProgressTasks = getTaskDetails.filter((row: { statusId: string; }) => row.statusId === "P");
  const completedTasks = getTaskDetails.filter((row: { statusId: string; }) => row.statusId === "C");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event?.active?.id?.toString() || null);
  };

  const handleDragEnd = async (event:DragEndEvent) => {
    const { over } = event;
    
    if (!over) return;

    const draggedTask = getTaskDetails.find((task: { id: any; }) => task.id === activeId);
    if (!draggedTask) return;

    const statusMap = {
      'todo': { id: 'T', label: 'TODO' },
      'inProgress': { id: 'P', label: 'In Progress' },
      'completed': { id: 'C', label: 'Completed' }
    };

    if (over.id in statusMap) {
      const newStatusInfo = statusMap[over?.id as keyof typeof statusMap];
      
      if (draggedTask.statusId !== newStatusInfo.id) {
         dispatch(setAccessData({ type: "loading", response: true }))
        try {
          const taskRef = doc(db, "tasks", draggedTask.id);
          await updateDoc(taskRef, {
            statusId: newStatusInfo.id,
            status: newStatusInfo.label
          });
          await getTaskData(dispatch);
           dispatch(setAccessData({ type: "loading", response: false }))
        } catch (error) {
          console.error("Error updating task status:", error);
           dispatch(setAccessData({ type: "loading", response: false }))
        }
      }
    }
    else if (activeId !== over.id) {
      const oldIndex: number = getTaskDetails.findIndex((task: { id: any }) => task.id === activeId);
      const newIndex = getTaskDetails.findIndex((task: { id: any })  => task.id === over.id);
      
      const reorderedTasks = arrayMove(getTaskDetails, oldIndex, newIndex);
      dispatch(reorderTasks(reorderedTasks));
    }
    
    setActiveId(null);
  };

  const handleDragOver = (event:DragOverEvent) => {
    const { over } = event;
    if (!over) return;
  };

  return (
    <>
      <div className="mt-2">
        <div className="mt-6">
          <Divider />
          <table className="w-full text-sm text-left rtl:text-right hidden sm:table">
            <colgroup>
              <col className="w-12" /> 
              <col className="w-8" /> 
              <col className="w-1/4" /> 
              <col className="w-1/5" /> 
              <col className="w-1/6" /> 
              <col className="w-1/6" /> 
              <col className="w-12" /> 
            </colgroup>
            <thead className="text-xs text-gray-700 uppercase bg-inherit dark:text-gray-400">
              <tr>
                <th scope="col" className="p-4">
                  <div className="flex items-center">
                    <input
                      id="checkbox-all-search"
                      type="checkbox"
                      className="w-4 h-4 text-blue-800"
                      disabled
                    />
                  </div>
                </th>
                <th scope="col w-4 p-4"></th>
                <th scope="col">Task name</th>
                <th scope="col">Due Date</th>
                <th scope="col">Status</th>
                <th scope="col">Category</th>
                <th scope="col"></th>
              </tr>
            </thead>
          </table>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
          >
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
                  <Box className="hidden">
                    <Button
                      variant="text"
                      startIcon={<FiPlus />}
                      sx={{ color: "#000000", textTransform: "capitalize" }}
                      onClick={() => setAddTableRow(!addTableRow)}
                    >
                      Add Task
                    </Button>
                    <Divider />
                  </Box>
                  <Droppable id="todo">
                    {todoTasks.length > 0 ? (
                      <DataTable
                        rows={todoTasks}
                        addTableRow={addTableRow}
                        setAddTableRow={setAddTableRow}
                      />
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No Tasks in To-Do
                      </div>
                    )}
                  </Droppable>
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
                  <Droppable id="inProgress">
                    {inProgressTasks.length > 0 ? (
                      <DataTable
                        rows={inProgressTasks}
                        addTableRow={addTableRow}
                        setAddTableRow={setAddTableRow}
                      />
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No Tasks in Progress
                      </div>
                    )}
                  </Droppable>
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
                  <Droppable id="completed">
                    {completedTasks.length > 0 ? (
                      <DataTable
                        rows={completedTasks}
                        addTableRow={addTableRow}
                        setAddTableRow={setAddTableRow}
                      />
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No Tasks in Completed
                      </div>
                    )}
                  </Droppable>
                </AccordionDetails>
              </Accordion>
            </div>

            <DragOverlay>
              {activeId ? (
                <div className="bg-white shadow-lg rounded p-4">
                  {getTaskDetails.find((task: any) => task.id === activeId)?.taskName}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </>
  );
};

export default ListView;