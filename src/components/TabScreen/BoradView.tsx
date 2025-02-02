import { Card, CardContent, Typography } from "@mui/material";
import FilterCreateTasks from "../FilterCreateTasks";
import ListCard from "./ListCard";
import { tableData } from "../../constants/tableData";
import { useState } from "react";

const BoradView = () => {
  const [boardCards, setBoardCards] = useState(tableData);
  const todoTasks = boardCards.filter((row) => row.status === "TODO");
  const inProgressTasks = boardCards.filter(
    (row) => row.status === "In Progress"
  );
  const completedTasks = boardCards.filter((row) => row.status === "Completed");

  return (
    <>
      <FilterCreateTasks />
      <div className="mt-6 flex gap-4">
        <Card
          sx={{
            width: 400,
            minHeight: 600,
            backgroundColor: "#FFFAEA",
          }}
        >
          <CardContent sx={{}}>
            <Typography
              gutterBottom
              sx={{
                backgroundColor: "#FAC3FF",
                width: "fit-content",
                padding: "5px",
                borderRadius: "5px",
                fontSize: "13px",
              }}
              component="div"
            >
              TO-DO
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {todoTasks.length > 0 ? (
                <ListCard rows={todoTasks} setBoardCards={setBoardCards}/>
              ) : (
                "No Tasks to display"
              )}
            </Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            width: 400,
            minHeight: 600,
            backgroundColor: "#FFFAEA",
          }}
        >
          <CardContent sx={{}}>
            <Typography
              gutterBottom
         
              sx={{
                backgroundColor: "#85D9F1",
                width: "fit-content",
                padding: "4px",
                borderRadius: "5px",
                fontSize: "13px",
              }}
              component="div"
            >
              IN-PROGRESS
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {inProgressTasks.length > 0 ? (
                <ListCard rows={inProgressTasks} setBoardCards={setBoardCards}/>
              ) : (
                "No Tasks to display"
              )}
            </Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            width: 400,
            minHeight: 600,
            backgroundColor: "#FFFAEA",
          }}
        >
          <CardContent sx={{}}>
            <Typography
              gutterBottom
              sx={{
                backgroundColor: "#A2D6A0",
                width: "fit-content",
                padding: "4px",
                borderRadius: "5px",
                fontSize: "13px",
              }}
              component="div"
            >
              COMPLETED
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {completedTasks.length > 0 ? (
                <ListCard rows={completedTasks} setBoardCards={setBoardCards}/>
              ) : (
                "No Tasks to display"
              )}
            </Typography>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default BoradView;
