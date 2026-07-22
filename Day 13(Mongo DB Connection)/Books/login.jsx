import { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const data = await API.login({
        email,
        password
      });


      console.log(data);

      // after successful login
      navigate("/books");


    } catch (error) {

      alert(
        error.response?.data?.message || 
        "Login Failed"
      );

    }

  };


  return (

    <div className="login-container">

      <h1>Login</h1>


      <form onSubmit={handleLogin}>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
        />


        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
        />


        <button type="submit">
          Login
        </button>


      </form>


    </div>

  );

}


export default Login;