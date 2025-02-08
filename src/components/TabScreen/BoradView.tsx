import { Card, CardContent, Typography } from "@mui/material";
import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSelector, useDispatch } from "react-redux";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { getTaskData } from "../../utils/taskGetService";
import ListCard from "./ListCard";
import { setAccessData } from "../../redux/reducers/systemConfigReducer";

const BoardView = () => {
  const dispatch = useDispatch();
  const getTaskDetails = useSelector(
    (state) => state?.systemConfigReducer?.taskGetDetails
  );

  const [activeId, setActiveId] = useState(null);

  const todoTasks = getTaskDetails.filter((row) => row.statusId === "T");
  const inProgressTasks = getTaskDetails.filter((row) => row.statusId === "P");
  const completedTasks = getTaskDetails.filter((row) => row.statusId === "C");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const findContainer = (id) => {
    if (todoTasks.find(task => task.id === id)) return "todo";
    if (inProgressTasks.find(task => task.id === id)) return "inProgress";
    if (completedTasks.find(task => task.id === id)) return "completed";
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainer = over.data?.current?.sortable?.containerId || over.id;

    const draggedTask = getTaskDetails.find(task => task.id === active.id);
    if (!draggedTask) return;
    
    if (activeContainer !== overContainer) {
      const statusMap = {
        todo: { id: 'T', label: 'TODO' },
        inProgress: { id: 'P', label: 'In Progress' },
        completed: { id: 'C', label: 'Completed' }
      };

      if (statusMap[overContainer]) {
        dispatch(setAccessData({ type: "loading", response: true }))
        try {
          const taskRef = doc(db, "tasks", draggedTask.id);
          await updateDoc(taskRef, {
            statusId: statusMap[overContainer].id,
            status: statusMap[overContainer].label
          });
          await getTaskData(dispatch);
          dispatch(setAccessData({ type: "loading", response: false }))
        } catch (error) {
          console.error("Error updating task status:", error);
          dispatch(setAccessData({ type: "loading", response: false }))
        }
      }
    } 
    // Handle reordering within the same column
    else if (active.id !== over.id) {
      const oldIndex = getTaskDetails.findIndex(task => task.id === active.id);
      const newIndex = getTaskDetails.findIndex(task => task.id === over.id);
      const reorderedTasks = arrayMove(getTaskDetails, oldIndex, newIndex);
      // Update your Redux store with reordered tasks if needed
    }

    setActiveId(null);
  };

  const DroppableContainer = ({ id, items, title, backgroundColor }) => (
    <Card
      sx={{
        width: 400,
        minHeight: 600,
        backgroundColor: "#FFFAEA",
      }}
    >
      <CardContent>
        <Typography
          gutterBottom
          sx={{
            backgroundColor,
            width: "fit-content",
            padding: "5px",
            borderRadius: "5px",
            fontSize: "13px",
            marginBottom: "1.4rem",
            fontWeight: "bold",
          }}
          component="div"
        >
          {title}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: "text.secondary",
            minHeight: "100px",
          }}
        >
          <SortableContext
            items={items.map(item => item.id)}
            strategy={verticalListSortingStrategy}
            id={id}
          >
            {items.length > 0 ? (
              items.map((task) => (
                <ListCard
                  key={task.id}
                  card={task}
                />
              ))
            ) : (
              <div className="text-center p-4">No Tasks to display</div>
            )}
          </SortableContext>
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="mt-6 flex gap-4">
        <DroppableContainer
          id="todo"
          items={todoTasks}
          title="TO-DO"
          backgroundColor="#FAC3FF"
        />
        <DroppableContainer
          id="inProgress"
          items={inProgressTasks}
          title="IN-PROGRESS"
          backgroundColor="#85D9F1"
        />
        <DroppableContainer
          id="completed"
          items={completedTasks}
          title="COMPLETED"
          backgroundColor="#A2D6A0"
        />
      </div>

      <DragOverlay>
        {activeId ? (
          <Card sx={{ width: 400, opacity: 0.8 }}>
            <CardContent>
              {getTaskDetails.find(task => task.id === activeId)?.taskName}
            </CardContent>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default BoardView;