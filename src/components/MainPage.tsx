import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { ReactNode, SyntheticEvent, useState } from "react";
import { TfiViewList } from "react-icons/tfi";
import { MdInsertChartOutlined } from "react-icons/md";
import ListView from "./TabScreen/ListView";
import BoradView from "./TabScreen/BoradView";

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
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
    <Box sx={{ width: "100%" }}>
      <Box>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          sx={{
            "& .Mui-selected": {
              color: "black !important",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "black", 
            },
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
        <ListView/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <BoradView/>
      </CustomTabPanel>
    </Box>
    </>
  );
}
