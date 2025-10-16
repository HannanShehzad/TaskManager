import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbarContext } from '../context/SnackbarContext';
import { TextField, Button, IconButton, InputAdornment, LinearProgress } from '@mui/material';
import { Mail, Lock, User, UserPlus, EyeOff, Eye, Upload, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const DOCUMENT_TYPES = [
  { id: 'passport', name: 'Passport', points: 70, category: 'Primary' },
  { id: 'driverLicense', name: 'Driver License', points: 40, category: 'Primary' },
  { id: 'birthCertificate', name: 'Birth Certificate', points: 70, category: 'Primary' },
  { id: 'medicareCard', name: 'Medicare Card', points: 25, category: 'Secondary' },
  { id: 'bankStatement', name: 'Bank Statement', points: 25, category: 'Secondary' },
  { id: 'utilityBill', name: 'Utility Bill', points: 25, category: 'Secondary' },
  { id: 'medicalCertificate', name: 'Medical Certificate', points: 25, category: 'Secondary' },
];

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '', // This will be sent as 'name' to the backend
    email: '',
    password: '',
    confirmPassword: '', // This will be sent as 'passwordConfirm' to the backend
  });
  const [uploadedDocuments, setUploadedDocuments] = useState({});
  const { openSnackBar } = useSnackbarContext();
  const { login } = useAuth();
  // const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleFileUpload = (docId) => (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedDocuments({
        ...uploadedDocuments,
        [docId]: { file: file, name: file.name },
      });
    }
  };

  const removeDocument = (docId) => {
    const newDocs = { ...uploadedDocuments };
    delete newDocs[docId];
    setUploadedDocuments(newDocs);
  };

  const calculatePoints = () => {
    return DOCUMENT_TYPES.reduce((total, doc) => {
      return uploadedDocuments[doc.id] ? total + doc.points : total;
    }, 0);
  };

  const currentPoints = calculatePoints();
  const progressPercentage = Math.min((currentPoints / 100) * 100, 100);
  const isVerificationComplete = currentPoints >= 100;

    const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      openSnackBar('error', 'Passwords do not match!');
      return;
    }

    if (formData.password.length < 8) {
      openSnackBar('error', 'Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      // Backend expects name instead of fullName
      const payload = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.confirmPassword // backend expects passwordConfirm
      };

      const response = await axios.post(
        'http://localhost:5000/api/v1/auth/signup',
        payload
      );

      // Handle success
      if (response.data?.status === 'success') {
        const { token, data: { user } } = response.data;
        openSnackBar('success', 'Registration successful! Please log in.');
        
        // Optionally auto-login the user
        login(user, token);
        // navigate('/home');
      }
    } catch (err) {
      console.error('Signup error:', err);
      const errorMessage =
        err.response?.data?.message || 'An unexpected error occurred. Please try again.';
      openSnackBar('error', errorMessage);
    } finally {
      setLoading(false);
    }
    
  }


  const groupedDocuments = DOCUMENT_TYPES.reduce((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = [];
    acc[doc.category].push(doc);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="text-white" size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            {currentStep === 1 ? 'Create Account' : '100-Point Identity Verification'}
          </h2>
          <p className="text-gray-600 mt-2">
            {currentStep === 1 ? 'Join us today and get started' : 'Upload documents to verify your identity'}
          </p>
        </div>

        {/* Progress Steps */}
        {/* <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
              1
            </div>
            <div className={`w-20 h-1 ${currentStep >= 2 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
              2
            </div>
          </div>
        </div> */}

        <form onSubmit={handleSubmit}>
          {currentStep === 1 ? (
            <div className="flex flex-col gap-y-5">
              <TextField
                fullWidth
                placeholder="Enter your full name"
                label="Full Name"
                variant="outlined"
                required
                value={formData.fullName}
                onChange={handleChange('fullName')}
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
                onChange={handleChange('email')}
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
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                required
                value={formData.password}
                onChange={handleChange('password')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock className="text-gray-400" size={20} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
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
                type={showConfirmPassword ? 'text' : 'password'}
                variant="outlined"
                required
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock className="text-gray-400" size={20} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
          ) : (
            <div>
              {/* Points Progress Bar */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700">Verification Progress</span>
                  <span className={`text-lg font-bold ${isVerificationComplete ? 'text-green-600' : 'text-purple-600'}`}>
                    {currentPoints} / 100 Points
                  </span>
                </div>
                <LinearProgress 
                  variant="determinate" 
                  value={progressPercentage} 
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: '#e5e7eb',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: isVerificationComplete ? '#16a34a' : '#9333ea',
                      borderRadius: 5,
                    }
                  }}
                />
                {isVerificationComplete && (
                  <div className="mt-2 flex items-center text-green-600 text-sm font-semibold">
                    <CheckCircle size={16} className="mr-1" />
                    Verification Complete!
                  </div>
                )}
              </div>

              {/* Document Upload Sections */}
              {Object.entries(groupedDocuments).map(([category, docs]) => (
                <div key={category} className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">{category} Documents</h3>
                  <div className="space-y-3">
                    {docs.map((doc) => (
                      <div key={doc.id} className="border border-gray-300 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-800">{doc.name}</h4>
                            <span className="text-sm text-purple-600 font-semibold">{doc.points} points</span>
                          </div>
                          {uploadedDocuments[doc.id] && (
                            <CheckCircle className="text-green-600" size={24} />
                          )}
                        </div>
                        
                        {uploadedDocuments[doc.id] ? (
                          <div className="flex items-center justify-between bg-green-50 p-3 rounded">
                            <span className="text-sm text-gray-700 truncate flex-1 mr-2">
                              {uploadedDocuments[doc.id].name}
                            </span>
                            <IconButton 
                              size="small" 
                              onClick={() => removeDocument(doc.id)}
                              className="text-red-600"
                            >
                              <XCircle size={20} />
                            </IconButton>
                          </div>
                        ) : (
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={handleFileUpload(doc.id)}
                            />
                            <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-purple-600 hover:bg-purple-50 transition">
                              <Upload className="text-gray-400 mr-2" size={20} />
                              <span className="text-sm text-gray-600">Click to upload</span>
                            </div>
                          </label>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex gap-3 mt-6">
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setCurrentStep(1)}
                  className="border-gray-300 text-gray-700"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={!isVerificationComplete}
                  size="large"
                  className={`${isVerificationComplete ? 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700' : 'bg-gray-400'} text-white py-3 rounded-lg font-semibold`}
                >
                  Complete Registration
                </Button>
              </div>
            </div>
          )}
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/" className="text-purple-600 hover:text-purple-800 font-semibold">
              Sign In
            </Link>
          </p>
        </div>

        <div className="mt-4">
          <Link to="/">
            <Button fullWidth variant="outlined" className="border-gray-300 text-gray-700">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;