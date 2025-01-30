import { Avatar } from "@mui/material";
import { TbClipboardText } from "react-icons/tb";

const NavBar = () => {
  return (
    <>
      <nav className="flex flex-row justify-between p-3 mt-6">
        <div className="flex justify-center items-center gap-2 text-2xl">
          <TbClipboardText size={35} />
          TaskBuddy
        </div>
        <div className="flex justify-center items-center gap-2 text-gray-500 font-medium">    
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          Profile
        </div>
      </nav>
    </>
  );
};

export default NavBar;
