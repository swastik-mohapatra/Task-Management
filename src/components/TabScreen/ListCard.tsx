import { Reorder } from "framer-motion";
import { useState } from "react";
import { TableRow } from "../../constants/tableData";
import { FiEdit3 } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { IoIosMore } from "react-icons/io";
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
  const [cards, setCards] = useState<TableRow[]>(rows);

  const handleReorder = (newOrder: TableRow[]) => {
    setCards(newOrder);
    setBoardCards(newOrder); // Update the parent state if needed
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Reorder.Group
        axis="y" // Allow vertical dragging
        values={cards}
        onReorder={handleReorder}
      >
        {cards.map((card) => (
          <DraggableCard key={card.id} card={card} />
        ))}
      </Reorder.Group>
    </Box>
  );
};

export default ListCard;

const DraggableCard = ({ card }: { card: TableRow }) => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useDispatch();

  const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const deleteTask = async (id: string) => {
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
    <Reorder.Item
      value={card} // The item being dragged
      whileDrag={{ scale: 1.05 }} // Add scaling effect while dragging
    >
      <Card
        sx={{ borderRadius: 4, marginBottom:"10px"}}
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
    </Reorder.Item>
  );
};