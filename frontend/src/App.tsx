import './App.css'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router'
import Home from './components/Home'
import Signin from './components/Signin/Signin'
import { isValidToken } from './services/SignInService'
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function App() {
  const AUTO_CLOSE_TIME = 3000;

  return (
    <>
      <ToastContainer autoClose={AUTO_CLOSE_TIME} position="top-center" aria-label="notification-container"/>
      <BrowserRouter>
        <Routes>
          <Route path='/Signin' element={<Signin/>}/>
          <Route path='/' element={<PrivateRoute/>}>
            <Route path='/' element={<Home/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

const PrivateRoute = () => {
  if(!isValidToken()){
    return <Navigate to="/Signin"/>;
  }

  return <Outlet/>;
}

export default App
