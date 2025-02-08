import {  useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Box,
  Typography,
} from "@mui/material";
import { IoIosMore } from "react-icons/io";
import { FiEdit3 } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import dayjs from "dayjs";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { getTaskData } from "../../utils/taskGetService";
import { useDispatch } from "react-redux";
import { setAccessData } from "../../redux/reducers/systemConfigReducer";
import AddTaskModal from "../AddTaskModal";
interface Card {
  id: string;
  taskName: string;
  category: string;
  dueDate?: string;
  statusId: string;
  categoryId?: string;  
}

interface ListCardProps {
  card: Card;
}

const ListCard = ({ card }:ListCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  const [openAddModal, setOpenAddModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const dispatch = useDispatch();

  const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const deleteTask = async (id:any) => {
    dispatch(setAccessData({ type: "loading", response: true }));
    try {
      const taskDoc = doc(db, "tasks", id);
      await deleteDoc(taskDoc);
      await getTaskData(dispatch);
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      dispatch(setAccessData({ type: "loading", response: false }));
      setAnchorEl(null);
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card sx={{ borderRadius: 4, marginBottom: "10px" }}>
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
                onClick={(e) => e.stopPropagation()}
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
                    setOpenAddModal(true);
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
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {card?.category}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {card?.dueDate ? dayjs(card?.dueDate).format("D MMM, YYYY") : ""}
            </Typography>
          </Box>
        </CardContent>
      </Card>
      {openAddModal && (
        <AddTaskModal
          addText={false}
          setOpenAddModal={setOpenAddModal}
        />
      )}
    </div>
  );
};

export default ListCard;