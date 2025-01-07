import './App.css'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router'
import Home from './components/Home'
import Signin from './components/Signin/Signin'
import { isValidToken } from './services/SignInService'

function App() {

  return (
    <>
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
