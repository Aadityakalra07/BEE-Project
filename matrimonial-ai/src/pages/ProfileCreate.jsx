import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronRight, ChevronLeft, Upload, Camera } from 'lucide-react'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

const steps = [
  { id: 1, title: 'Basic Info' },
  { id: 2, title: 'Personal Details' },
  { id: 3, title: 'Education & Career' },
  { id: 4, title: 'Family' },
  { id: 5, title: 'Photos' },
]

export default function ProfileCreate() {
  const [currentStep, setCurrentStep] = useState(1)
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    // Basic Info
    dateOfBirth: '',
    religion: '',
    caste: '',
    motherTongue: '',
    
    // Personal
    height: '',
    maritalStatus: '',
    diet: '',
    smoking: '',
    drinking: '',
    
    // Education & Career
    education: '',
    occupation: '',
    income: '',
    company: '',
    
    // Family
    familyType: '',
    fatherOccupation: '',
    motherOccupation: '',
    siblings: '',
    
    // Photos
    photos: []
  })

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      // Submit and navigate
      console.log('Profile data:', formData)
      navigate('/preferences')
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="space-y-8">
      {/* Stepper */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-medium text-sm ${
              currentStep > step.id
                ? 'bg-green-500 text-white'
                : currentStep === step.id
                ? 'bg-primary-500 text-white'
                : 'bg-neutral-200 text-neutral-500'
            }`}>
              {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-1 mx-2 ${
                currentStep > step.id ? 'bg-green-500' : 'bg-neutral-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="text-center">
        <h2 className="text-xl font-semibold text-neutral-900">{steps[currentStep - 1].title}</h2>
        <p className="text-neutral-500 text-sm mt-1">Step {currentStep} of {steps.length}</p>
      </div>

      {/* Step Content */}
      <div className="space-y-4">
        {currentStep === 1 && (
          <>
            <Input
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => updateField('dateOfBirth', e.target.value)}
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-neutral-700">Religion</label>
              <select
                className="input"
                value={formData.religion}
                onChange={(e) => updateField('religion', e.target.value)}
              >
                <option value="">Select Religion</option>
                <option value="hindu">Hindu</option>
                <option value="muslim">Muslim</option>
                <option value="christian">Christian</option>
                <option value="sikh">Sikh</option>
                <option value="other">Other</option>
              </select>
            </div>
            <Input
              label="Caste"
              placeholder="Enter your caste"
              value={formData.caste}
              onChange={(e) => updateField('caste', e.target.value)}
            />
            <Input
              label="Mother Tongue"
              placeholder="Enter your mother tongue"
              value={formData.motherTongue}
              onChange={(e) => updateField('motherTongue', e.target.value)}
            />
          </>
        )}

        {currentStep === 2 && (
          <>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-neutral-700">Height</label>
              <select
                className="input"
                value={formData.height}
                onChange={(e) => updateField('height', e.target.value)}
              >
                <option value="">Select Height</option>
                {["4'8\"", "4'10\"", "5'0\"", "5'2\"", "5'4\"", "5'6\"", "5'8\"", "5'10\"", "6'0\"", "6'2\"", "6'4\""].map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-neutral-700">Marital Status</label>
              <select
                className="input"
                value={formData.maritalStatus}
                onChange={(e) => updateField('maritalStatus', e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="never_married">Never Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Diet', field: 'diet', options: ['Vegetarian', 'Non-Veg', 'Vegan'] },
                { label: 'Smoking', field: 'smoking', options: ['No', 'Occasionally', 'Yes'] },
                { label: 'Drinking', field: 'drinking', options: ['No', 'Occasionally', 'Yes'] },
              ].map(({ label, field, options }) => (
                <div key={field} className="space-y-1.5">
                  <label className="block text-sm font-medium text-neutral-700">{label}</label>
                  <select
                    className="input"
                    value={formData[field]}
                    onChange={(e) => updateField(field, e.target.value)}
                  >
                    <option value="">Select</option>
                    {options.map(o => <option key={o} value={o.toLowerCase()}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </>
        )}

        {currentStep === 3 && (
          <>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-neutral-700">Highest Education</label>
              <select
                className="input"
                value={formData.education}
                onChange={(e) => updateField('education', e.target.value)}
              >
                <option value="">Select Education</option>
                <option value="high_school">High School</option>
                <option value="bachelors">Bachelor's Degree</option>
                <option value="masters">Master's Degree</option>
                <option value="phd">PhD</option>
                <option value="professional">Professional Degree (CA, MBBS, etc.)</option>
              </select>
            </div>
            <Input
              label="Occupation"
              placeholder="e.g., Software Engineer"
              value={formData.occupation}
              onChange={(e) => updateField('occupation', e.target.value)}
            />
            <Input
              label="Company/Organization"
              placeholder="e.g., Google, TCS"
              value={formData.company}
              onChange={(e) => updateField('company', e.target.value)}
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-neutral-700">Annual Income</label>
              <select
                className="input"
                value={formData.income}
                onChange={(e) => updateField('income', e.target.value)}
              >
                <option value="">Select Income Range</option>
                <option value="below_5">Below 5 Lakhs</option>
                <option value="5_10">5-10 Lakhs</option>
                <option value="10_20">10-20 Lakhs</option>
                <option value="20_50">20-50 Lakhs</option>
                <option value="above_50">Above 50 Lakhs</option>
              </select>
            </div>
          </>
        )}

        {currentStep === 4 && (
          <>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-neutral-700">Family Type</label>
              <select
                className="input"
                value={formData.familyType}
                onChange={(e) => updateField('familyType', e.target.value)}
              >
                <option value="">Select Family Type</option>
                <option value="nuclear">Nuclear Family</option>
                <option value="joint">Joint Family</option>
              </select>
            </div>
            <Input
              label="Father's Occupation"
              placeholder="e.g., Businessman"
              value={formData.fatherOccupation}
              onChange={(e) => updateField('fatherOccupation', e.target.value)}
            />
            <Input
              label="Mother's Occupation"
              placeholder="e.g., Teacher"
              value={formData.motherOccupation}
              onChange={(e) => updateField('motherOccupation', e.target.value)}
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-neutral-700">Number of Siblings</label>
              <select
                className="input"
                value={formData.siblings}
                onChange={(e) => updateField('siblings', e.target.value)}
              >
                <option value="">Select</option>
                {[0, 1, 2, 3, 4, '5+'].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center">
              <Camera className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-600 mb-2">Upload your photos</p>
              <p className="text-sm text-neutral-400 mb-4">Add at least 2 photos for better visibility</p>
              <Button variant="outline">
                <Upload className="w-4 h-4" />
                Choose Photos
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-square bg-neutral-100 rounded-xl flex items-center justify-center">
                  <Camera className="w-8 h-8 text-neutral-300" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button
          variant="ghost"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
        <Button onClick={nextStep}>
          {currentStep === steps.length ? 'Complete' : 'Next'}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
