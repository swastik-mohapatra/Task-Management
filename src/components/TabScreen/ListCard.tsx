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
  import {
    DndContext,
    DragEndEvent,
    closestCenter,
  } from "@dnd-kit/core";
  import {
    SortableContext,
    useSortable,
    arrayMove,
  } from "@dnd-kit/sortable";
  import { CSS } from "@dnd-kit/utilities";
  
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
  
  // 🔥 Draggable Card Component (Fixed Menu)
  const DraggableCard = ({ card }: { card: TableRow }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: card.id });
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
  
    // ✅ Fix: Menu state inside DraggableCard
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
    const handleClickMenu = (event: MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleCloseMenu = () => {
      setAnchorEl(null);
    };
  
    return (
      <Card sx={{ borderRadius: 4, ...style }} ref={setNodeRef} {...attributes} {...listeners}>
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
                MenuListProps={{ "aria-labelledby": `more-menu-button-${card.id}` }}
              >
                <MenuItem onClick={handleCloseMenu}>
                  <ListItemIcon>
                    <FiEdit3 />
                  </ListItemIcon>
                  Edit
                </MenuItem>
                <MenuItem sx={{ color: "red" }} onClick={handleCloseMenu}>
                  <ListItemIcon>
                    <MdDelete color="red" />
                  </ListItemIcon>
                  Delete
                </MenuItem>
              </Menu>
            </>
          }
          title={card.taskName}
        />
        <CardContent sx={{ height: "100%" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {card.category}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {card.dueDate}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };
  