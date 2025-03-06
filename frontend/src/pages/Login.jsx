import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState("Sign Up");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);

  const navigate = useNavigate();
  const { token, setToken } = useContext(AppContext);

  const validateUsername = (name) => /^[A-Za-z]+$/.test(name); // Ensures only letters

  const checkUsernameAvailability = async (username) => {
    try {
      const { data } = await axios.get(`http://localhost:4000/api/user/check-username/${username}`);
      setUsernameExists(data.exists);
    } catch (error) {
      console.error("Error checking username:", error);
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (state === "Sign Up") {
      if (!validateUsername(name)) {
        toast.error("Username should only contain letters.");
        setLoading(false);
        return;
      }
      if (usernameExists) {
        toast.error("Username already exists. Please choose another one.");
        setLoading(false);
        return;
      }
    }

    try {
      const endpoint =
        state === "Sign Up"
          ? "http://localhost:4000/api/user/register"
          : "http://localhost:4000/api/user/login";

      const payload =
        state === "Sign Up"
          ? { name, email, password }
          : { email, password };

      const { data } = await axios.post(endpoint, payload);

      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);

        toast.success(state === "Sign Up" ? "Registration successful!" : "Login successful!");

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (name.trim() !== "") {
      checkUsernameAvailability(name);
    }
  }, [name]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken && token) {
      navigate("/");
    }
  }, [token]);

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-white text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>
        <p>Please {state === "Sign Up" ? "sign up" : "log in"} to continue</p>

        {state === "Sign Up" && (
          <div className="w-full">
            <p>Username</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="border bg-zinc-800 text-white border-[#DADADA] rounded w-full p-2 mt-1"
              type="text"
              required
            />
            {usernameExists && <p className="text-red-500 text-xs">Username already exists</p>}
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border bg-zinc-800 text-white border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            required
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type={showPassword ? "text" : "password"}
            className="border bg-zinc-800 text-white border-[#DADADA] rounded w-full p-2 mt-1"
            required
          />
        </div>
        <div className="flex justify-between text-sm">
          <p className="flex gap-1">
            Show Password
            <input
              type="checkbox"
              className="cursor-pointer w-3"
              checked={showPassword}
              onChange={() => setShowPassword((prev) => !prev)}
            />
          </p>
        </div>
        <button
          className="bg-primary text-white w-full py-2 my-2 rounded-md text-base hover:bg-gray-700 transition-all duration-500"
          disabled={loading}
        >
          {loading ? (state === "Sign Up" ? "Signing Up..." : "Logging in...") : state === "Sign Up" ? "Sign Up" : "Login"}
        </button>
        {state === "Sign Up" ? (
          <p>
            Already have an account? <span onClick={() => setState("Login")} className="text-primary underline cursor-pointer">Login here</span>
          </p>
        ) : (
          <p>
            Create a new account? <span onClick={() => setState("Sign Up")} className="text-primary underline cursor-pointer">Click here</span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
