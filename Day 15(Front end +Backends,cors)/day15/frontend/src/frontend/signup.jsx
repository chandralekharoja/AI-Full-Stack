import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await API.signup(user);

      console.log(response.data);

      alert("Account Created Successfully");

      // Navigate to login page after signup
      navigate("/login");

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message || "Signup Failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">

      <style>
        {`
          .signup-container {

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



.signup-box {

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



.signup-box h1 {

  text-align:center;

  margin-bottom:25px;

  color:#ea580c;

  font-size:30px;

}



.signup-box h1::before{

content:"🍽️ ";

}



.signup-box input {

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



.signup-box input:focus {

  border-color:#f97316;

  box-shadow:
  0 0 8px rgba(249,115,22,0.3);

}



.signup-box button {

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



.signup-box button:hover {

  background:#ea580c;

  transform:translateY(-2px);

}



.login-link {

  text-align:center;

  margin-top:20px;

  font-size:14px;

  color:#555;

}



.login-link span {

  color:#f97316;

  cursor:pointer;

  font-weight:bold;

}



.login-link span:hover{

  text-decoration:underline;

}



/* Error popup */

.error-message{

background:#fee2e2;

color:#dc2626;

padding:10px;

border-radius:10px;

text-align:center;

margin-bottom:15px;

font-size:14px;

}



/* Success popup */

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


      <div className="signup-box">

        <h1>Create Account</h1>

        <form onSubmit={submit}>

          <input
            type="text"
            placeholder="Username"
            value={user.username}
            onChange={(e) =>
              setUser({
                ...user,
                username: e.target.value
              })
            }
            required
          />


          <input
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={(e) =>
              setUser({
                ...user,
                email: e.target.value
              })
            }
            required
          />


          <input
            type="password"
            placeholder="Password"
            value={user.password}
            onChange={(e) =>
              setUser({
                ...user,
                password: e.target.value
              })
            }
            required
          />


          <button type="submit">
            {loading ? "Creating..." : "Signup"}
          </button>


          <div className="login-link">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>
              Login
            </span>
          </div>


        </form>

      </div>

    </div>
  );
}

export default Signup;