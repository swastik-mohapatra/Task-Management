import {
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { TableRow } from "../../constants/tableData";
import { FiEdit3 } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { IoIosMore } from "react-icons/io";
import { MouseEvent, useState } from "react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import dayjs from "dayjs";
import { db } from "../../config/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { getTaskData } from "../../utils/taskGetService";
import { useDispatch } from "react-redux";
import { setAccessData } from "../../redux/reducers/systemConfigReducer";
import AddTaskModal from "../AddTaskModal";

interface DataTableProps {
  rows: TableRow[];
  setBoardCards: (rows: TableRow[]) => void;
}

const ListCard = ({ rows, setBoardCards }: DataTableProps) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setBoardCards((prevRows) => {
      const oldIndex = prevRows.findIndex((row) => row.id === active.id);
      const newIndex = prevRows.findIndex((row) => row.id === over.id);
      return arrayMove(prevRows, oldIndex, newIndex);
    });
  };

  return (
    // <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
    //   <SortableContext items={rows.map((row) => row.id)}>
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {rows.map((card) => (
        <DraggableCard key={card.id} card={card} />
      ))}
    </Box>
    //   </SortableContext>
    // </DndContext>
  );
};

export default ListCard;

const DraggableCard = ({ card }: { card: TableRow }) => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: card.id });

  const dispatch = useDispatch();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClickMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const deleteTask = async (id) => {
    try {
      const taskDoc = doc(db, "tasks", id);
      await deleteDoc(taskDoc);
      getTaskData(dispatch);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
    setAnchorEl(null);
  };

  return (
    <Card
      sx={{ borderRadius: 4, ...style }}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <CardHeader
        action={
          <>
            <IconButton aria-label="settings" onClick={handleClickMenu}>
              <IoIosMore />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              MenuListProps={{
                "aria-labelledby": `more-menu-button-${card?.id}`,
              }}
            >
              <MenuItem
                onClick={() => {
                  dispatch(
                    setAccessData({
                      type: "taskDetails",
                      response: {
                        ...card,
                        status: card?.statusId,
                        category: card?.categoryId,
                      },
                    })
                  );
                  setAnchorEl(null);
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
                onClick={() => deleteTask(card?.id)}
              >
                <ListItemIcon>
                  <MdDelete color="red" />
                </ListItemIcon>
                Delete
              </MenuItem>
            </Menu>
          </>
        }
        title={card?.taskName}
      />
      <CardContent sx={{ height: "100%" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {card?.category}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {card?.dueDate ? dayjs(card?.dueDate).format("D MMM, YYYY") : ""}
          </Typography>
        </Box>
      </CardContent>
      {openAddModal && (
          <AddTaskModal
            openAddModal={openAddModal}
            setOpenAddModal={setOpenAddModal}
          />
        )}
    </Card>
  );
};
