import './App.css';
import Signup from './components/Signup/Signup.tsx';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <ToastContainer autoClose={3000} position="top-center" />
      <Signup className=""/>
    </div>
  );
}

export default App;