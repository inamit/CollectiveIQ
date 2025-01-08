import './App.css';
import Signup from './components/Signup/Signup.tsx';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function App() {
  const AUTO_CLOSE_TIME = 3000;

  return (
    <div className="App">
      <ToastContainer autoClose={AUTO_CLOSE_TIME} position="top-center" />
    </div>
  );
}

export default App;