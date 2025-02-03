import { useState, useEffect } from "react";
import { auth } from "./config/firebase"; // Ensure correct path
import { onAuthStateChanged, User } from "firebase/auth";

import "./App.css";
import LoginPage from "./components/Login/LoginPage";
import MainPage from "./components/MainPage";
import NavBar from "./components/NavBar";

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); 
  }, []);

  return (
    <>
      {!user ? (
        <LoginPage setUser={setUser}/> 
      ) : (
        <div className="mx-5">
          <NavBar user={user} />
          <MainPage />
        </div>
      )}
    </>
  );
}

export default App;
