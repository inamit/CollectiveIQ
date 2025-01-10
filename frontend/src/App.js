import './App.css'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router'
import Home from './components/Home'
import Signin from './components/Signin/Signin'
import Signup from './components/Signup/Signup'
import { isValidToken, refreshAccessToken } from './services/SignInService'
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function App() {
  const AUTO_CLOSE_TIME = 3000;

  return (
    <div className="App">
      <ToastContainer autoClose={AUTO_CLOSE_TIME} position="top-center" aria-label="notification-container"/>
      <BrowserRouter>
        <Routes>
          <Route path='/Signin' element={<Signin/>}/>
          <Route path='/Signup' element={<Signup/>}/>
          <Route path='/' element={<PrivateRoute/>}>
            <Route path='/' element={<Home/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

const PrivateRoute = () => {
  if(!isValidToken("accessToken") && !isValidToken("googleToken")){
    if(!refreshAccessToken()){
      return <Navigate to="/Signin"/>;
    }
  }

  return <Outlet/>;
}

export default App
