import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await API.login(data);

      console.log(response.data);

      localStorage.setItem(
  "token",
  response.data.token
);

localStorage.setItem(
  "user_id",
  response.data.user_id
);


console.log(
  "Saved Token:",
  localStorage.getItem("token")
);

console.log(
  "Saved User ID:",
  localStorage.getItem("user_id")
);
      alert("Login Successful");

      navigate("/home");

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message || "Login Failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      <style>
        {`
          .login-container {

  min-height:100vh;

  display:flex;

  justify-content:center;

  align-items:center;

  background:linear-gradient(
    135deg,
    #fff7ed,
    #ffedd5
  );

  font-family:"Poppins",Arial,sans-serif;

}



.login-box {

  background:white;

  width:380px;

  padding:35px;

  border-radius:20px;

  box-shadow:
  0 10px 30px rgba(0,0,0,0.15);

  animation:slideUp 0.5s ease;

}



@keyframes slideUp{

from{

transform:translateY(30px);

opacity:0;

}

to{

transform:translateY(0);

opacity:1;

}

}



.login-box h1 {

  text-align:center;

  margin-bottom:25px;

  color:#ea580c;

  font-size:30px;

}



.login-box h1::before{

content:"🍳 ";

}



.login-box input {

  width:100%;

  padding:14px;

  margin-bottom:18px;

  border:1px solid #ddd;

  border-radius:12px;

  font-size:15px;

  outline:none;

  box-sizing:border-box;

  transition:0.3s;

}



.login-box input:focus {

  border-color:#f97316;

  box-shadow:
  0 0 8px rgba(249,115,22,0.3);

}



.login-box button {


  width:100%;

  padding:14px;

  background:#f97316;

  color:white;

  border:none;

  border-radius:12px;

  font-size:17px;

  font-weight:bold;

  cursor:pointer;

  transition:0.3s;

}



.login-box button:hover {

  background:#ea580c;

  transform:translateY(-2px);

}



.signup-link {

  text-align:center;

  margin-top:20px;

  font-size:14px;

  color:#555;

}



.signup-link span {

  color:#f97316;

  cursor:pointer;

  font-weight:bold;

}



.signup-link span:hover{

  text-decoration:underline;

}



/* Error message */

.error-message{

background:#fee2e2;

color:#dc2626;

padding:10px;

border-radius:10px;

text-align:center;

margin-bottom:15px;

font-size:14px;

}



/* Success message */

.success-message{

background:#dcfce7;

color:#16a34a;

padding:10px;

border-radius:10px;

text-align:center;

margin-bottom:15px;

font-size:14px;

}
        `}
      </style>


      <div className="login-box">

        <h1>Login</h1>


        <form onSubmit={login}>

          <input
            type="email"
            placeholder="Email"
            value={data.email}
            onChange={(e) =>
              setData({
                ...data,
                email: e.target.value
              })
            }
            required
          />


          <input
            type="password"
            placeholder="Password"
            value={data.password}
            onChange={(e) =>
              setData({
                ...data,
                password: e.target.value
              })
            }
            required
          />


          <button type="submit">
            {loading ? "Logging in..." : "Login"}
          </button>


          <div className="signup-link">
            Don't have an account?{" "}
            <span onClick={() => navigate("/signup")}>
              Signup
            </span>
          </div>


        </form>


      </div>

    </div>
  );
}

export default Login;