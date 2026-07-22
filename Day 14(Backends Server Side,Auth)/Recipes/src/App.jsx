import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";


import Signup from "./frontend/signup";
import Login from "./frontend/login";
import Home from "./frontend/myrecipe";


function App(){

  return(

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Signup />} />


        <Route path="/signup" element={<Signup />} />


        <Route path="/login" element={<Login />} />


        <Route path="/home" element={<Home />} />


      </Routes>

    </BrowserRouter>

  );

}


export default App;