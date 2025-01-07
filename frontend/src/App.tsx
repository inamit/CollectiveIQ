import "./App.css";
import NavBar from "./components/NavBar";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <NavBar />

      <div className="appContainer">
        <Outlet />
      </div>
    </>
  );
}

export default App;
