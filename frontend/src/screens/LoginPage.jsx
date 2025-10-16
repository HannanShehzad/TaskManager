import React, { useState } from "react";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import { TextField, Button, IconButton, InputAdornment } from "@mui/material";
import { Mail, Lock, EyeClosed, Eye, CheckSquare } from "lucide-react";
import axios from "axios";
import { useSnackbarContext } from "../context/SnackbarContext";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { openSnackBar } = useSnackbarContext();
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        { email, password }
      );

      const {
        token,
        data: { user },
      } = response.data;

      // Store in AuthContext and localStorage
      login(user, token);

      openSnackBar("success", "Login successful!");
      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage =
        err.response?.data?.message ||
        "An unexpected error occurred. Please try again.";
      openSnackBar("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 transform hover:scale-105 transition duration-300">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CheckSquare size={40} className="text-indigo-600" />
            <span className="text-4xl font-bold text-gray-800">TaskMaster</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 mt-2">
            Sign in to continue to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
          <TextField
            fullWidth
            label="Email Address"
            placeholder="Enter your email"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Mail className="text-gray-400" size={20} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Password"
            placeholder="Enter your password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock className="text-gray-400" size={20} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

        

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Sign Up
            </Link>
          </p>
        </div>

        <div className="mt-6">
          <Link to="/">
            <Button
              fullWidth
              variant="outlined"
              className="border-gray-300 text-gray-700"
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
