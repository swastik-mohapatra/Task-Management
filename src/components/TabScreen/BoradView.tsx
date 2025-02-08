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
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSelector, useDispatch } from "react-redux";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { getTaskData } from "../../utils/taskGetService";
import ListCard from "./ListCard";
import {
  reorderTasks,
  setAccessData,
} from "../../redux/reducers/systemConfigReducer";

interface Row {
  id: string;
  statusId: string;
  taskName: string;
  category: string;
  categoryId?: string;
}

const BoardView = () => {
  const dispatch = useDispatch();
  const getTaskDetails = useSelector(
    (state: { systemConfigReducer: { taskGetDetails: any[] } }) =>
      state.systemConfigReducer.taskGetDetails
  );

  console.log(getTaskDetails)

  const [activeId, setActiveId] = useState<string | null>(null);
  const todoTasks = getTaskDetails
    .filter((row: Row) => row.statusId === "T")
    .map((task) => ({
      ...task,
      category: "TODO",
      categoryId: task.categoryId || "", // Ensure categoryId is included
    }));

  const inProgressTasks = getTaskDetails
    .filter((row: Row) => row.statusId === "P")
    .map((task) => ({
      ...task,
      category: "In Progress",
      categoryId: task.categoryId || "",
    }));

  const completedTasks = getTaskDetails
    .filter((row: Row) => row.statusId === "C")
    .map((task) => ({
      ...task,
      category: "Completed",
      categoryId: task.categoryId || "",
    }));

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  interface Task {
    id: string;
    statusId: string;
    taskName: string;
  }

  const findContainer = (id: string): string | null => {
    if (todoTasks.find((task: Task) => task.id === id)) return "todo";
    if (inProgressTasks.find((task: Task) => task.id === id))
      return "inProgress";
    if (completedTasks.find((task: Task) => task.id === id)) return "completed";
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id.toString());
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeContainer = findContainer(active.id.toString());
    const overContainer: "todo" | "inProgress" | "completed" =
      over.data?.current?.sortable?.containerId || over.id;

    const draggedTask = getTaskDetails.find((task) => task.id === active.id);
    if (!draggedTask) return;

    if (activeContainer !== overContainer) {
      const statusMap = {
        todo: { id: "T", label: "TODO" },
        inProgress: { id: "P", label: "In Progress" },
        completed: { id: "C", label: "Completed" },
      };

      if (statusMap[overContainer]) {
        dispatch(setAccessData({ type: "loading", response: true }));
        try {
          const taskRef = doc(db, "tasks", draggedTask.id);
          await updateDoc(taskRef, {
            statusId: statusMap[overContainer].id,
            status: statusMap[overContainer].label,
          });
          await getTaskData(dispatch);
          dispatch(setAccessData({ type: "loading", response: false }));
        } catch (error) {
          console.error("Error updating task status:", error);
          dispatch(setAccessData({ type: "loading", response: false }));
        }
      }
    } else if (active.id !== over.id) {
      const oldIndex = getTaskDetails.findIndex(
        (task) => task.id === active.id
      );
      const newIndex = getTaskDetails.findIndex((task) => task.id === over.id);
      const reorderedTasks = arrayMove(getTaskDetails, oldIndex, newIndex);

      dispatch(reorderTasks(reorderedTasks));
    }

    setActiveId(null);
  };

  interface DroppableContainerProps {
    id: string;
    items: any[];
    title: string;
    backgroundColor: string;
  }

  const DroppableContainer = ({
    id,
    items,
    title,
    backgroundColor,
  }: DroppableContainerProps) => (
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
            items={items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
            id={id}
          >
            {items.length > 0 ? (
              items.map((task) => <ListCard card={task} />)
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
              {getTaskDetails.find((task) => task.id === activeId)?.taskName}
            </CardContent>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default BoardView;
