import "./App.css";
import NavBar from "./components/NavBar/NavBar";
import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";
import { UserProvider } from "./context/userContext";

function App() {
  const AUTO_CLOSE_TIME = 3000;

  return (
    <>
      <div className="App">
        <UserProvider>
          <ToastContainer autoClose={AUTO_CLOSE_TIME} position="top-center" />

          <NavBar />

          <div className="appContainer">
            <Outlet />
          </div>
        </UserProvider>
      </div>
    </>
  );
}

export default App;
