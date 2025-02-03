import { Avatar, Button } from "@mui/material";
import { signOut } from "firebase/auth";
import { TbClipboardText } from "react-icons/tb";
import { auth } from "../config/firebase";
import { RiLogoutBoxLine } from "react-icons/ri";

interface NavBarProps {
  user:String;
}

const NavBar = ({user}:NavBarProps) => {
  const logOutSystem = async () => {
      try {
        await signOut(auth);
      } catch (err) {
        console.error(err);
      }
    };
  return (
    <>
      <nav className="flex flex-row justify-between p-3 mt-6">
        <div className="flex justify-center items-center gap-2 text-2xl">
          <TbClipboardText size={35} />
          TaskBuddy
        </div>
        <div className="flex justify-center items-center gap-2 text-gray-500 font-medium">    
          <Avatar alt={user?.displayName} src={user?.photoURL} />
          {user?.displayName}
          <Button
            variant="outlined"
            startIcon={<RiLogoutBoxLine />
            }
            sx={{
              color: "#000",
              backgroundColor: "#FFF9F9",
              borderColor: "#7B198426",
              borderRadius: "10px",
              textTransform: "capitalize",
            }}
            onClick={logOutSystem}
          >
           Log Out
          </Button>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
