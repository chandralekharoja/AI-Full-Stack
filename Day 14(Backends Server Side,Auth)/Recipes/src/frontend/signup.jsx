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
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #f5f7fb;
            font-family: Arial, sans-serif;
          }

          .signup-box {
            background: white;
            width: 350px;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0px 5px 20px rgba(0,0,0,0.1);
          }

          h1 {
            text-align: center;
            margin-bottom: 25px;
            color: #333;
          }

          input {
            width: 100%;
            padding: 12px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 8px;
            font-size: 15px;
            box-sizing: border-box;
          }

          input:focus {
            outline: none;
            border-color: #4f46e5;
          }

          button {
            width: 100%;
            padding: 12px;
            background: #4f46e5;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
          }

          button:hover {
            background: #3730a3;
          }

          .login-link {
            text-align: center;
            margin-top: 15px;
            font-size: 14px;
          }

          .login-link span {
            color: #4f46e5;
            cursor: pointer;
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