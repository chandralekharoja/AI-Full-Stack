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
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #f5f7fb;
            font-family: Arial, sans-serif;
          }

          .login-box {
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

          .signup-link {
            text-align: center;
            margin-top: 15px;
            font-size: 14px;
          }

          .signup-link span {
            color: #4f46e5;
            cursor: pointer;
            font-weight: bold;
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