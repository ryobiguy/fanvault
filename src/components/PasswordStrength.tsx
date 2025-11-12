import { Check, X } from 'lucide-react'

interface PasswordStrengthProps {
  password: string
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const requirements = [
    { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
    { label: 'Contains uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
    { label: 'Contains lowercase letter', test: (p: string) => /[a-z]/.test(p) },
    { label: 'Contains number', test: (p: string) => /[0-9]/.test(p) },
    { label: 'Contains special character', test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
  ]

  const passedRequirements = requirements.filter(req => req.test(password)).length
  const strength = passedRequirements === 0 ? 0 : (passedRequirements / requirements.length) * 100

  const getStrengthColor = () => {
    if (strength === 0) return 'bg-gray-200'
    if (strength < 40) return 'bg-red-500'
    if (strength < 60) return 'bg-orange-500'
    if (strength < 80) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getStrengthText = () => {
    if (strength === 0) return ''
    if (strength < 40) return 'Weak'
    if (strength < 60) return 'Fair'
    if (strength < 80) return 'Good'
    return 'Strong'
  }

  if (!password) return null

  return (
    <div className="mt-2 space-y-2">
      {/* Strength Bar */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-600">Password Strength</span>
          <span className={`text-xs font-semibold ${
            strength < 40 ? 'text-red-600' : 
            strength < 60 ? 'text-orange-600' : 
            strength < 80 ? 'text-yellow-600' : 
            'text-green-600'
          }`}>
            {getStrengthText()}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${strength}%` }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-1">
        {requirements.map((req, index) => {
          const passed = req.test(password)
          return (
            <div key={index} className="flex items-center space-x-2">
              {passed ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <X className="h-4 w-4 text-gray-400" />
              )}
              <span className={`text-xs ${passed ? 'text-green-600' : 'text-gray-500'}`}>
                {req.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
