import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { ReactNode, SyntheticEvent, useEffect, useState } from "react";
import { TfiViewList } from "react-icons/tfi";
import { MdInsertChartOutlined } from "react-icons/md";
import ListView from "./TabScreen/ListView";
import BoradView from "./TabScreen/BoradView";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { getTaskData } from "../utils/taskGetService";
import { useSelector } from "react-redux";
import { Bars } from "react-loader-spinner";

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function BasicTabs() {
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);

  const loader = useSelector(
    (state: any) => state?.systemConfigReducer?.loading
  );
  console.log(loader);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    getTaskData(dispatch);
  }, []);

  if (isSmallScreen) {
    return <ListView />;
  }

  return (
    <Box sx={{ width: "100%" }}>
      {loader ? (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            overflowY: "auto",
          }}
        >
          {/* <Box sx={{ color: "white" }}>Loading ....</Box> */}
          <Box sx={{ color: "white" }}>
            <Bars
              visible={true}
              height="80"
              width="80"
              color="#FFFAEA"
              ariaLabel="grid-loading"
              radius="12.5"
              wrapperStyle={{}}
              wrapperClass="grid-wrapper"
            />
          </Box>
        </Box>
      ) : (
        <>
          <Box>
            <Tabs
              value={value}
              onChange={(event: SyntheticEvent, newValue: number) =>
                setValue(newValue)
              }
              aria-label="basic tabs example"
              sx={{
                "& .Mui-selected": { color: "black !important" },
                "& .MuiTabs-indicator": { backgroundColor: "black" },
              }}
            >
              <Tab
                label="List"
                icon={<TfiViewList />}
                iconPosition="start"
                sx={{ textTransform: "capitalize" }}
              />
              <Tab
                label="Board"
                icon={<MdInsertChartOutlined />}
                iconPosition="start"
                sx={{ textTransform: "capitalize" }}
              />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <ListView />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <BoradView />
          </CustomTabPanel>
        </>
      )}
    </Box>
  );
}
