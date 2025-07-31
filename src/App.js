import React, { useEffect } from 'react';
import { Route , Routes, useNavigate } from "react-router-dom";
import checkAuth from './checkAuth.js';
import SignIn from './Pages/LogIn.js';
import Homepage from './Pages/Homepage';
import SignUp from './Pages/SignUp';

const App = () => {
  const navigate = useNavigate()

  const checkAuthentication = async () => {
    const auth = await checkAuth();
    if (!auth) {
      alert("You need to Log In first");
      navigate("/login");
    } else {
      navigate("/");
    }
  };
  useEffect(() => {
  checkAuthentication();
}, []);

  return (
    <Routes>
      <Route path='/' element={<Homepage/>}/>
      <Route path='/login' element={<SignIn/>}/>
      <Route path='/signup' element={<SignUp/>}/>
    </Routes>
  );
}

export default App;