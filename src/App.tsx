import "./App.css";
import MainPage from "./components/MainPage";
import NavBar from "./components/NavBar";

function App() {
  return (
    <>
      <div className="mx-5">
        <NavBar />
        <MainPage />
      </div>
    </>
  );
}

export default App;
