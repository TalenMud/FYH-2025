import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { userAPI, investmentsAPI } from '../services/api';
import { Check, ArrowRight } from 'lucide-react';

const APPS = [
  { name: 'Instagram', icon: '📷', color: 'bg-gradient-to-br from-purple-500 to-pink-500' },
  { name: 'TikTok', icon: '🎵', color: 'bg-black' },
  { name: 'Twitter', icon: '🐦', color: 'bg-blue-400' },
  { name: 'Facebook', icon: '👥', color: 'bg-blue-600' },
  { name: 'YouTube', icon: '▶️', color: 'bg-red-600' },
  { name: 'Snapchat', icon: '👻', color: 'bg-yellow-400' },
  { name: 'Reddit', icon: '🤖', color: 'bg-orange-500' },
];

const RISK_LEVELS = [
  {
    id: 'standard',
    name: 'Standard - General Savings',
    description: 'Conservative approach, focus on building savings',
    time: '6min/week conscious',
  },
  {
    id: 'low',
    name: 'Low Risk',
    description: '80% Bonds / 20% ETFs - Stable, predictable returns',
    time: '',
  },
  {
    id: 'medium',
    name: 'Medium Risk',
    description: '50% Bonds / 50% ETFs (S&P 500) - Balanced growth and stability',
    time: '',
  },
  {
    id: 'high',
    name: 'High Risk',
    description: '20% Bonds / 80% ETFs - Maximum growth potential, higher volatility',
    time: '',
  },
];

const Onboarding = () => {
  const { user } = useAuth0();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedApps, setSelectedApps] = useState([]);
  const [customApp, setCustomApp] = useState('');
  const [riskLevel, setRiskLevel] = useState('');

  const handleAppToggle = (appName) => {
    setSelectedApps(prev =>
      prev.includes(appName)
        ? prev.filter(a => a !== appName)
        : [...prev, appName]
    );
  };

  const handleAddCustomApp = () => {
    if (customApp.trim() && !selectedApps.includes(customApp.trim())) {
      setSelectedApps([...selectedApps, customApp.trim()]);
      setCustomApp('');
    }
  };

  const handleNext = async () => {
    if (step === 1) {
      if (selectedApps.length === 0) {
        alert('Please select at least one app to track');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      if (!riskLevel) {
        alert('Please select an investment risk level');
        return;
      }
      // Save selections
      try {
        await userAPI.updateApps(selectedApps);
        await investmentsAPI.setupInvestments(riskLevel);
        navigate('/profile');
      } catch (error) {
        console.error('Error saving onboarding data:', error);
        alert('Error saving your preferences. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name || 'there'}!</h1>
            <p className="text-gray-600 mb-8">
              Let's set up your screen time tracking. Select which apps you want to monitor.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              We'll only track and charge for time on these selected apps
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {APPS.map((app) => (
                <button
                  key={app.name}
                  onClick={() => handleAppToggle(app.name)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedApps.includes(app.name)
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-12 h-12 ${app.color} rounded-lg flex items-center justify-center text-2xl mb-2 mx-auto`}>
                    {app.icon}
                  </div>
                  <div className="text-sm font-medium">{app.name}</div>
                  {selectedApps.includes(app.name) && (
                    <Check className="w-5 h-5 text-blue-600 mx-auto mt-1" />
                  )}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customApp}
                  onChange={(e) => setCustomApp(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCustomApp()}
                  placeholder="Add custom app"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddCustomApp}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>

            {selectedApps.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Selected apps:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedApps.map((app) => (
                    <span
                      key={app}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleNext}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
            >
              Continue <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-4">Connect Screen Time Data</h2>
            <p className="text-gray-600 mb-6">
              To track your app usage, you'll need to connect your device's screen time data.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold mb-2">How to connect:</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                <li>On iOS: Settings → Screen Time → Share Screen Time Data</li>
                <li>On Android: Digital Wellbeing → Export Data</li>
                <li>For now, you can manually input your screen time data</li>
              </ul>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Future updates will include automatic API integration with your device.
            </p>
            <button
              onClick={handleNext}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
            >
              Continue <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-4">Choose Your Investment Risk Level</h2>
            <p className="text-gray-600 mb-6">
              Select how you want your charged amounts to be invested.
            </p>

            <div className="space-y-4 mb-6">
              {RISK_LEVELS.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setRiskLevel(level.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    riskLevel === level.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{level.name}</h3>
                      <p className="text-sm text-gray-600">{level.description}</p>
                      {level.time && (
                        <p className="text-xs text-gray-500 mt-1">{level.time}</p>
                      )}
                    </div>
                    {riskLevel === level.id && (
                      <Check className="w-6 h-6 text-blue-600 flex-shrink-0 ml-4" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
            >
              Complete Setup <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;

