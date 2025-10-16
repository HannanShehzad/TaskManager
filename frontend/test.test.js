import React, 'useState'
import { Link, useNavigate } from 'react-router-dom'
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  LinearProgress,
} from '@mui/material'
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
} from 'lucide-react'
import axios from 'axios' // NEW: For making API requests
import { toast } from 'react-hot-toast' // NEW: For displaying notifications

const DOCUMENT_TYPES = [
  { id: 'passport', name: 'Passport', points: 70, category: 'Primary' },
  { id: 'driverLicense', name: 'Driver License', points: 40, category: 'Primary' },
  { id: 'birthCertificate', name: 'Birth Certificate', points: 70, category: 'Primary' },
  { id: 'medicareCard', name: 'Medicare Card', points: 25, category: 'Secondary' },
  { id: 'bankStatement', name: 'Bank Statement', points: 25, category: 'Secondary' },
  { id: 'utilityBill', name: 'Utility Bill', points: 25, category: 'Secondary' },
  { id: 'medicalCertificate', name: 'Medical Certificate', points: 25, category: 'Secondary' },
]

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [uploadedDocuments, setUploadedDocuments] = useState({})
  const [loading, setLoading] = useState(false) // NEW: Loading state for API call
  const navigate = useNavigate() // NEW: For redirecting after success

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value })
  }

  const handleFileUpload = (docId) => (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadedDocuments({
        ...uploadedDocuments,
        [docId]: { file: file, name: file.name },
      })
    }
  }

  const removeDocument = (docId) => {
    const newDocs = { ...uploadedDocuments }
    delete newDocs[docId]
    setUploadedDocuments(newDocs)
  }

  const calculatePoints = () => {
    return DOCUMENT_TYPES.reduce((total, doc) => {
      return uploadedDocuments[doc.id] ? total + doc.points : total
    }, 0)
  }

  const currentPoints = calculatePoints()
  const progressPercentage = Math.min((currentPoints / 100) * 100, 100)
  const isVerificationComplete = currentPoints >= 100

  // MODIFIED: This function now handles API submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // --- Step 1: Basic validation and moving to the next step ---
    if (currentStep === 1) {
      // Frontend validation to match backend rules
      if (formData.password !== formData.confirmPassword) {
        return toast.error('Passwords do not match!')
      }
      if (formData.password.length < 6) {
        return toast.error('Password must be at least 6 characters long.')
      }
      setCurrentStep(2)
      return
    }

    // --- Step 2: Final submission to the backend ---
    if (currentStep === 2) {
      setLoading(true)

      // 1. Prepare the payload in the format the backend expects
      const documentsPayload = {}
      Object.keys(uploadedDocuments).forEach((docId) => {
        documentsPayload[docId] = { name: uploadedDocuments[docId].name }
      })

      const submissionData = {
        ...formData,
        uploadedDocuments: documentsPayload,
      }

      try {
        // 2. Make the API call
        // IMPORTANT: Replace with your actual backend URL
        const response = await axios.post(
          'http://localhost:3000/api/v1/clients/signup',
          submissionData
        )

        // 3. Handle success
        if (response.data.status === 'success') {
          toast.success('Registration successful! Please log in.')
          navigate('/login') // Redirect to login page on success
        }
      } catch (err) {
        // 4. Handle errors
        const errorMessage =
          err.response?.data?.message || 'An unexpected error occurred. Please try again.'
        toast.error(errorMessage)
      } finally {
        // 5. Reset loading state
        setLoading(false)
      }
    }
  }

  const groupedDocuments = DOCUMENT_TYPES.reduce((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = []
    acc[doc.category].push(doc)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8">
        {/* ... (rest of the JSX is the same until the submit button) */}
        
        {/* The form structure remains the same */}
        <form onSubmit={handleSubmit}>
          {currentStep === 1 ? (
            // ... (JSX for step 1 is unchanged)
          ) : (
            <div>
              {/* ... (JSX for progress bar and document uploads is unchanged) */}

              {/* MODIFIED: Updated buttons for step 2 */}
              <div className="flex gap-3 mt-6">
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setCurrentStep(1)}
                  disabled={loading} // Disable while submitting
                  className="border-gray-300 text-gray-700"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={!isVerificationComplete || loading} // Disable if points not met or during submission
                  size="large"
                  className={`${
                    isVerificationComplete && !loading
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700'
                      : 'bg-gray-400'
                  } text-white py-3 rounded-lg font-semibold`}
                >
                  {loading ? 'Registering...' : 'Complete Registration'}
                </Button>
              </div>
            </div>
          )}
        </form>

        {/* ... (rest of the JSX is the same) */}
      </div>
    </div>
  )
}

export default SignupPage