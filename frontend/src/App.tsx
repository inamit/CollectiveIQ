import "./App.css";
import NavBar from "./components/NavBar/NavBar";
import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";

function App() {
  const AUTO_CLOSE_TIME = 3000;

  return (
    <>
      <div className="App">
        <ToastContainer autoClose={AUTO_CLOSE_TIME} position="top-center" />

        <NavBar />

        <HomePage />
        <div className="appContainer">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default App;
