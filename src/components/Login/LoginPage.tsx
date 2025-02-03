import { useState, useEffect } from "react";
import { auth, googleProvider } from "../../config/firebase";
import { signInWithPopup, onAuthStateChanged, User, signOut } from "firebase/auth";

import { Button } from "@mui/material";
import { GrGoogle } from "react-icons/gr";
import { TbClipboardText } from "react-icons/tb";

interface LoginPageProps {  
    setUser: (value: any) => void;
  }

const LoginPage = ({setUser}:LoginPageProps) => {

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

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  return (
    <>
      <div>
        <div className="flex justify-center items-center gap-2 text-2xl text-[#7B1984]">
          <TbClipboardText size={35} />
          TaskBuddy
        </div>
        <p>
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
            }}
            onClick={signInWithGoogle}
          >
            Sign In With Google
          </Button>
      </div>
    </>
  );
};

export default LoginPage;
