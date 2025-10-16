import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbarContext } from '../context/SnackbarContext';
import { useAuth } from '../context/AuthContext';
import { TextField, Button, IconButton, InputAdornment, LinearProgress } from '@mui/material';
import { Mail, Lock, User, EyeOff, Eye, Upload, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const DOCUMENT_TYPES = [
  { id: 'passport', name: 'Passport', points: 70, category: 'Primary' },
  { id: 'driverLicense', name: 'Driver License', points: 40, category: 'Primary' },
  { id: 'birthCertificate', name: 'Birth Certificate', points: 70, category: 'Primary' },
  { id: 'medicareCard', name: 'Medicare Card', points: 25, category: 'Secondary' },
  { id: 'bankStatement', name: 'Bank Statement', points: 25, category: 'Secondary' },
  { id: 'utilityBill', name: 'Utility Bill', points: 25, category: 'Secondary' },
  { id: 'medicalCertificate', name: 'Medical Certificate', points: 25, category: 'Secondary' },
];

const UpdateProfilePage = () => {
  const { user, token } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [uploadedDocuments, setUploadedDocuments] = useState({});
  const { openSnackBar } = useSnackbarContext();
  // const navigate = useNavigate();

  // Pre-fill form data from user context
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || '',
        email: user.email || '',
      }));

      // Initialize uploaded documents state based on user data
      const existingDocs = {};
      DOCUMENT_TYPES.forEach(doc => {
        if (user[doc.id]) {
          existingDocs[doc.id] = {
            name: `Existing ${doc.name}`,
            existing: true
          };
        }
      });
      setUploadedDocuments(existingDocs);
    }
  }, [user]);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleFileUpload = (docId) => (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedDocuments({
        ...uploadedDocuments,
        [docId]: { file: file, name: file.name, existing: false },
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
    setLoading(true);

    try {
      // Validate passwords if they are provided
      if (formData.password || formData.confirmPassword) {
        if (formData.password !== formData.confirmPassword) {
          openSnackBar('error', 'Passwords do not match!');
          return;
        }
        if (formData.password.length < 6) {
          openSnackBar('error', 'Password must be at least 6 characters long.');
          return;
        }
      }

      // Prepare FormData
      const formDataPayload = new FormData();
      formDataPayload.append('fullName', formData.fullName);
      formDataPayload.append('email', formData.email);
      
      // Only append passwords if they are provided
      if (formData.password) {
        formDataPayload.append('password', formData.password);
        formDataPayload.append('confirmPassword', formData.confirmPassword);
      }

      // Append new document files
      Object.keys(uploadedDocuments).forEach((docId) => {
        const fileObj = uploadedDocuments[docId];
        if (fileObj && fileObj.file && !fileObj.existing) {
          formDataPayload.append(docId, fileObj.file);
        }
      });

      // Make the API call with token
      const response = await axios.post(
        'http://localhost:8000/api/auth/update-profile',
        formDataPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data?.status === 'success') {
        openSnackBar('success', 'Profile updated successfully!');
        // navigate('/home');
      }
    } catch (err) {
      console.error('Update profile error:', err);
      const errorMessage =
        err.response?.data?.message || 'An unexpected error occurred. Please try again.';
      openSnackBar('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const groupedDocuments = DOCUMENT_TYPES.reduce((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = [];
    acc[doc.category].push(doc);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-100 flex items-center justify-center p-4 pt-0 ">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 ">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="text-white" size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Update Profile</h2>
          <p className="text-gray-600 mt-2">Update your information and verification documents</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              placeholder="Enter new password (optional)"
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
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
              label="Confirm New Password"
              placeholder="Confirm new password"
              type={showConfirmPassword ? 'text' : 'password'}
              variant="outlined"
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
          </div>

          {/* Verification Progress */}
          {/* <div className="p-4 bg-gray-50 rounded-lg">
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
          </div> */}

          {/* Document Upload Sections */}
          {/* {Object.entries(groupedDocuments).map(([category, docs]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">{category} Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          ))} */}

          <div className="flex gap-4">
            <Button
              // onClick={() => navigate('/home')}
              fullWidth
              variant="outlined"
              className="border-gray-300 text-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              size="large"
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfilePage;