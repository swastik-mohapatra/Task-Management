import { useEffect } from "react";
import { auth, googleProvider } from "../../config/firebase";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import loginImage from "../../assets/images/loginPage2.png";

import { Button } from "@mui/material";
import { GrGoogle } from "react-icons/gr";
import { TbClipboardText } from "react-icons/tb";

interface LoginPageProps {
  setUser: (value: any) => void;
}

const LoginPage = ({ setUser }: LoginPageProps) => {
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result?.user);
    } catch (err) {
      console.log("Login Error:", err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("Auth State Changed:", currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#FFF9F9]">
      <div className="">
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-6">
          <div className="p-7 sm:mt-20 flex flex-col justify-left items-start gap-2">
            <div className="flex gap-2 text-3xl font-bold text-[#7B1984] mb-4">
              <TbClipboardText size={40} />
              TaskBuddy
            </div>
            <p className="text-gray-600 mb-6 text-sm ">
              Streamline your workflow and track progress effortlessly with our
              all-in-one task management app.
            </p>
            <Button
              variant="contained"
              startIcon={<GrGoogle />}
              sx={{
                color: "#fff",
                backgroundColor: "#000",
                textTransform: "capitalize",
                padding: "12px 24px",
                fontSize: "16px",
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#333" },
              }}
              onClick={signInWithGoogle}
            >
              Continue with Google
            </Button>
          </div>
          <div className="sm:block hidden">
            <img
              src={loginImage}
              alt="Login Page"
              className="rounded-l-3xl shadow-2xl h-full shadow-slate-800 "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
