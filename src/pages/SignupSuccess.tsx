import { Link } from 'react-router-dom'
import { Mail, CheckCircle } from 'lucide-react'

export default function SignupSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Check Your Email!</h1>
          <p className="text-gray-600 mb-6">
            We've sent a verification link to your email address. Please click the link to verify your account and complete your registration.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-semibold text-blue-900 mb-1">Didn't receive the email?</p>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Check your spam/junk folder</li>
                  <li>• Make sure you entered the correct email</li>
                  <li>• The link expires in 24 hours</li>
                </ul>
              </div>
            </div>
          </div>

          <Link
            to="/login"
            className="inline-block bg-gradient-to-r from-pink-500 to-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition"
          >
            Go to Login
          </Link>

          <p className="text-sm text-gray-500 mt-4">
            Already verified?{' '}
            <Link to="/login" className="text-pink-600 hover:text-pink-700 font-medium">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
