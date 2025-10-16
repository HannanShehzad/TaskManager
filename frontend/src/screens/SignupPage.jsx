import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSnackbarContext } from "../context/SnackbarContext";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  LinearProgress,
} from "@mui/material";
import {
  Mail,
  Lock,
  User,
  UserPlus,
  EyeOff,
  Eye,
  Upload,
  CheckCircle,
  XCircle,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const DOCUMENT_TYPES = [
  { id: "passport", name: "Passport", points: 70, category: "Primary" },
  {
    id: "driverLicense",
    name: "Driver License",
    points: 40,
    category: "Primary",
  },
  {
    id: "birthCertificate",
    name: "Birth Certificate",
    points: 70,
    category: "Primary",
  },
  {
    id: "medicareCard",
    name: "Medicare Card",
    points: 25,
    category: "Secondary",
  },
  {
    id: "bankStatement",
    name: "Bank Statement",
    points: 25,
    category: "Secondary",
  },
  {
    id: "utilityBill",
    name: "Utility Bill",
    points: 25,
    category: "Secondary",
  },
  {
    id: "medicalCertificate",
    name: "Medical Certificate",
    points: 25,
    category: "Secondary",
  },
];

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "", // This will be sent as 'name' to the backend
    email: "",
    password: "",
    confirmPassword: "", // This will be sent as 'passwordConfirm' to the backend
  });
  const { openSnackBar } = useSnackbarContext();
  const { login } = useAuth();
  // const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      openSnackBar("error", "Passwords do not match!");
      return;
    }

    if (formData.password.length < 8) {
      openSnackBar("error", "Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      // Backend expects name instead of fullName
      const payload = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.confirmPassword, // backend expects passwordConfirm
      };

      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/signup",
        payload
      );

      // Handle success
      if (response.data?.status === "success") {
        const {
          token,
          data: { user },
        } = response.data;
        openSnackBar("success", "Registration successful! Please log in.");

        // Optionally auto-login the user
        login(user, token);
        // navigate('/home');
      }
    } catch (err) {
      console.error("Signup error:", err);
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="text-white" size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-600 mt-2">Join us today and get started</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-y-5">
            <TextField
              fullWidth
              placeholder="Enter your full name"
              label="Full Name"
              variant="outlined"
              required
              value={formData.fullName}
              onChange={handleChange("fullName")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <User className="text-gray-400" size={20} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Email Address"
              placeholder="Enter your email"
              type="email"
              variant="outlined"
              required
              value={formData.email}
              onChange={handleChange("email")}
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
              placeholder="Enter your password"
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              required
              value={formData.password}
              onChange={handleChange("password")}
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
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              placeholder="Re-enter your password"
              type={showConfirmPassword ? "text" : "password"}
              variant="outlined"
              required
              value={formData.confirmPassword}
              onChange={handleChange("confirmPassword")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock className="text-gray-400" size={20} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <label className="flex items-start">
              <input type="checkbox" className="mt-1 mr-2 w-4 h-4" required />
              <span className="text-sm text-gray-600">
                I agree to the Terms of Service and Privacy Policy
              </span>
            </label>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold"
            >
              Create Account
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/"
              className="text-purple-600 hover:text-purple-800 font-semibold"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
