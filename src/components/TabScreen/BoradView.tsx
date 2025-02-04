import { Card, CardContent, Typography } from "@mui/material";
import FilterCreateTasks from "../FilterCreateTasks";
import ListCard from "./ListCard";
import { tableData } from "../../constants/tableData";
import { useState } from "react";
import { useSelector } from "react-redux";

const BoradView = () => {
  const [boardCards, setBoardCards] = useState(tableData);

  const getTaskDetails = useSelector(
    (state: any) => state?.systemConfigReducer?.taskGetDetails
  );

  const todoTasks = getTaskDetails.filter((row) => row.statusId === "T");
  const inProgressTasks = getTaskDetails.filter(
    (row) => row.statusId === "P"
  );
  const completedTasks = getTaskDetails.filter((row) => row.statusId === "C");;

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
                marginBottom:"1.4rem"
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
                marginBottom:"1.4rem"
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
                marginBottom:"1.4rem"
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
