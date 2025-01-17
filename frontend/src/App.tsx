import "./App.css";
import NavBar from "./components/NavBar/NavBar";
import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";

function App() {
  const AUTO_CLOSE_TIME = 3000;

  return (
    <>
      <div className="App">
        <ToastContainer autoClose={AUTO_CLOSE_TIME} position="top-center" />
        <NavBar />
        <div className="appContainer">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default App;